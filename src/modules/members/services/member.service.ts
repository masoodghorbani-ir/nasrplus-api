import path from 'path';
import fs from 'fs';
import { MemberRepository } from '../repositories/member.repository';
import { IMember } from '../interfaces/member.interface';
import { IMemberAddress } from '../interfaces/member-address.interface';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';
import {
  IAcademicQualification,
  QualificationVerificationStatus,
} from '../../lookup/interfaces/academic-qualification.interface';
import { ApiError } from '../../../common/utils/api-error';
import { FilterQuery, Types } from 'mongoose';

export interface MemberFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  membershipTypeId?: string;
  specializationId?: string;
  rankId?: string;
}

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  // --- Member Profile Methods ---
  async getMemberById(id: string): Promise<IMember> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return member;
  }

  async getMembers(options: MemberFilterOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IMember> = {};

    if (options.status) {
      filter.status = options.status;
    }
    if (options.membershipTypeId) {
      filter.membershipTypeId = new Types.ObjectId(options.membershipTypeId);
    }
    if (options.specializationId) {
      filter.specializationId = new Types.ObjectId(options.specializationId);
    }
    if (options.rankId) {
      filter.rankId = new Types.ObjectId(options.rankId);
    }

    if (options.search) {
      const searchRegex = { $regex: options.search, $options: 'i' };
      filter.$or = [
        { memberCode: searchRegex },
        { nationalCode: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      this.memberRepository.find(filter, skip, limit),
      this.memberRepository.count(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createMember(data: Partial<IMember>): Promise<IMember> {
    return await this.memberRepository.create(data);
  }

  async updateMember(id: string, data: Partial<IMember>): Promise<IMember> {
    const updated = await this.memberRepository.updateById(id, data);
    if (!updated) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return updated;
  }

  async deleteMember(id: string): Promise<IMember> {
    const member = await this.getMemberById(id);
    if (member.profileImage && member.profileImage.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), member.profileImage.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch {
          // Ignore file deletion error
        }
      }
    }

    const deleted = await this.memberRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return deleted;
  }

  // --- Member Profile Photo Methods ---
  async uploadMemberPhoto(id: string, file: Express.Multer.File): Promise<IMember> {
    const member = await this.getMemberById(id);

    // Remove old local photo file if present
    if (member.profileImage && member.profileImage.startsWith('/uploads/')) {
      const oldDiskPath = path.join(process.cwd(), member.profileImage.replace(/^\//, ''));
      if (fs.existsSync(oldDiskPath)) {
        try {
          fs.unlinkSync(oldDiskPath);
        } catch {
          // Ignore file deletion error
        }
      }
    }

    const relativePath = `/uploads/members/photos/${file.filename}`;
    const updated = await this.memberRepository.updateById(id, { profileImage: relativePath });
    if (!updated) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return updated;
  }

  async deleteMemberPhoto(id: string): Promise<IMember> {
    const member = await this.getMemberById(id);

    if (member.profileImage && member.profileImage.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), member.profileImage.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch {
          // Ignore file deletion error
        }
      }
    }

    const updated = await this.memberRepository.updateById(id, { profileImage: '' });
    if (!updated) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return updated;
  }

  // --- Member Address Methods ---
  async getMemberAddresses(memberId: string): Promise<IMemberAddress[]> {
    await this.getMemberById(memberId); // ensure member exists
    return await this.memberRepository.findAddressesByMemberId(memberId);
  }

  async addMemberAddress(memberId: string, addressData: Partial<IMemberAddress>): Promise<IMemberAddress> {
    await this.getMemberById(memberId);
    return await this.memberRepository.createAddress({
      ...addressData,
      membershipId: new Types.ObjectId(memberId),
    });
  }

  async updateMemberAddress(
    memberId: string,
    addressId: string,
    addressData: Partial<IMemberAddress>
  ): Promise<IMemberAddress> {
    await this.getMemberById(memberId);
    const updated = await this.memberRepository.updateAddress(addressId, memberId, addressData);
    if (!updated) {
      throw ApiError.notFound(`Address with ID '${addressId}' not found for member '${memberId}'`);
    }
    return updated;
  }

  async deleteMemberAddress(memberId: string, addressId: string): Promise<IMemberAddress> {
    await this.getMemberById(memberId);
    const deleted = await this.memberRepository.deleteAddress(addressId, memberId);
    if (!deleted) {
      throw ApiError.notFound(`Address with ID '${addressId}' not found for member '${memberId}'`);
    }
    return deleted;
  }

  // --- Member Telephone Methods ---
  async getMemberTelephones(memberId: string): Promise<IMemberTelephone[]> {
    await this.getMemberById(memberId);
    return await this.memberRepository.findTelephonesByMemberId(memberId);
  }

  async addMemberTelephone(memberId: string, telephoneData: Partial<IMemberTelephone>): Promise<IMemberTelephone> {
    await this.getMemberById(memberId);
    return await this.memberRepository.createTelephone({
      ...telephoneData,
      membershipId: new Types.ObjectId(memberId),
    });
  }

  async updateMemberTelephone(
    memberId: string,
    telephoneId: string,
    telephoneData: Partial<IMemberTelephone>
  ): Promise<IMemberTelephone> {
    await this.getMemberById(memberId);
    const updated = await this.memberRepository.updateTelephone(telephoneId, memberId, telephoneData);
    if (!updated) {
      throw ApiError.notFound(`Telephone with ID '${telephoneId}' not found for member '${memberId}'`);
    }
    return updated;
  }

  async deleteMemberTelephone(memberId: string, telephoneId: string): Promise<IMemberTelephone> {
    await this.getMemberById(memberId);
    const deleted = await this.memberRepository.deleteTelephone(telephoneId, memberId);
    if (!deleted) {
      throw ApiError.notFound(`Telephone with ID '${telephoneId}' not found for member '${memberId}'`);
    }
    return deleted;
  }

  // --- Member Academic Qualification Methods ---
  async getMemberAcademicQualifications(memberId: string): Promise<IAcademicQualification[]> {
    await this.getMemberById(memberId);
    return await this.memberRepository.findQualificationsByMemberId(memberId);
  }

  async addMemberAcademicQualification(
    memberId: string,
    data: Partial<IAcademicQualification>,
    adminId?: string
  ): Promise<IAcademicQualification> {
    const member = await this.getMemberById(memberId);
    const created = await this.memberRepository.createQualification(
      {
        ...data,
        memberId: new Types.ObjectId(memberId),
      },
      adminId
    );

    // If member has no latestAcademicQualifications set, link this one
    if (!member.latestAcademicQualifications) {
      await this.memberRepository.updateById(memberId, {
        latestAcademicQualifications: created._id,
      });
    }

    return created;
  }

  async updateMemberAcademicQualification(
    memberId: string,
    qualificationId: string,
    data: Partial<IAcademicQualification>,
    adminId?: string
  ): Promise<IAcademicQualification> {
    await this.getMemberById(memberId);
    const updated = await this.memberRepository.updateQualification(
      qualificationId,
      memberId,
      data,
      adminId
    );
    if (!updated) {
      throw ApiError.notFound(
        `Academic qualification with ID '${qualificationId}' not found for member '${memberId}'`
      );
    }
    return updated;
  }

  async deleteMemberAcademicQualification(
    memberId: string,
    qualificationId: string
  ): Promise<IAcademicQualification> {
    await this.getMemberById(memberId);
    const deleted = await this.memberRepository.deleteQualification(qualificationId, memberId);
    if (!deleted) {
      throw ApiError.notFound(
        `Academic qualification with ID '${qualificationId}' not found for member '${memberId}'`
      );
    }
    return deleted;
  }

  async verifyMemberAcademicQualification(
    memberId: string,
    qualificationId: string,
    status: QualificationVerificationStatus,
    rejectionReason?: string,
    adminId?: string,
    comment?: string
  ): Promise<IAcademicQualification> {
    await this.getMemberById(memberId);
    const item = await this.memberRepository.findQualificationById(qualificationId, memberId);
    if (!item) {
      throw ApiError.notFound(
        `Academic qualification with ID '${qualificationId}' not found for member '${memberId}'`
      );
    }

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw ApiError.badRequest('Invalid verification status. Allowed: PENDING, APPROVED, REJECTED');
    }

    if (status === 'REJECTED' && (!rejectionReason || !rejectionReason.trim())) {
      throw ApiError.badRequest('Rejection reason is required when status is REJECTED');
    }

    const fromStatus = item.verificationStatus;
    const finalComment = comment?.trim() || (status === 'REJECTED' ? rejectionReason!.trim() : `Status changed to ${status}`);

    item.verificationLogs.push({
      fromStatus,
      toStatus: status,
      changedBy: adminId ? new Types.ObjectId(adminId) : null,
      changedAt: new Date(),
      comment: finalComment,
    });

    item.verificationStatus = status;
    item.verifiedAt = status !== 'PENDING' ? new Date() : null;
    if (adminId) {
      item.verifiedBy = new Types.ObjectId(adminId);
    }
    if (status === 'REJECTED') {
      item.rejectionReason = rejectionReason!.trim();
    } else if (status === 'APPROVED') {
      item.rejectionReason = '';
    }

    await item.save();

    return await item.populate([
      { path: 'academicField' },
      { path: 'degreeLevel' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }
}

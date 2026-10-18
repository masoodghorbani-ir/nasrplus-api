import path from 'path';
import fs from 'fs';
import { MemberRepository } from '../repositories/member.repository';
import { IMember } from '../interfaces/member.interface';
import { IMemberAddress } from '../interfaces/member-address.interface';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';
import { IMemberSkill, SkillVerificationStatus } from '../interfaces/member-skill.interface';
import { Specialization } from '../../lookup/models/specialization.model';
import {
  IAcademicQualification,
  QualificationVerificationStatus,
} from '../../lookup/interfaces/academic-qualification.interface';
import { Member } from '../models/member.model';
import { JwtUtil } from '../../../common/utils/jwt.util';
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

  // --- Member Skills Methods ---
  async getMemberSkills(memberId: string): Promise<IMemberSkill[]> {
    await this.getMemberById(memberId);
    return await this.memberRepository.findSkillsByMemberId(memberId);
  }

  async getMemberSkillById(memberId: string, skillId: string): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const skill = await this.memberRepository.findSkillById(skillId, memberId);
    if (!skill) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }
    return skill;
  }

  async addMemberSkill(
    memberId: string,
    data: any,
    file?: Express.Multer.File,
    adminId?: string
  ): Promise<IMemberSkill> {
    await this.getMemberById(memberId);

    // Validate specialization exists
    if (!data.specializationId || !Types.ObjectId.isValid(data.specializationId)) {
      throw ApiError.badRequest('Valid specialization reference ID is required');
    }
    const specialization = await Specialization.findById(data.specializationId);
    if (!specialization) {
      throw ApiError.notFound(`Specialization with ID '${data.specializationId}' was not found`);
    }

    // Validate start date
    if (!data.startDate) {
      throw ApiError.badRequest('Activity start date is required');
    }
    const parsedStartDate = new Date(data.startDate);
    if (isNaN(parsedStartDate.getTime())) {
      throw ApiError.badRequest('Invalid activity start date format');
    }

    // Validate self assessment percentage (1 to 100)
    const rawPercentage = data.selfAssessmentPercentage ?? data.skillLevel;
    if (rawPercentage === undefined || rawPercentage === null || rawPercentage === '') {
      throw ApiError.badRequest('Self-assessment percentage (1 to 100) is required');
    }
    const percentage = Number(rawPercentage);
    if (isNaN(percentage) || percentage < 1 || percentage > 100) {
      throw ApiError.badRequest('Self-assessment percentage must be a number between 1 and 100');
    }

    // Parse boolean hasCertificate
    let hasCert = data.hasCertificate;
    if (typeof hasCert === 'string') {
      hasCert = hasCert.toLowerCase() === 'true' || hasCert === '1';
    } else {
      hasCert = Boolean(hasCert);
    }

    // Handle certificate file
    let certificateFile = (data.certificateFile || '').trim();
    if (file) {
      certificateFile = `/uploads/members/certificates/${file.filename}`;
      hasCert = true;
    } else if (hasCert && !certificateFile) {
      throw ApiError.badRequest('Certificate file is required when certificate is claimed (hasCertificate is true)');
    }

    const payload: Partial<IMemberSkill> = {
      memberId: new Types.ObjectId(memberId),
      specializationId: new Types.ObjectId(data.specializationId),
      startDate: parsedStartDate,
      selfAssessmentPercentage: percentage,
      hasCertificate: hasCert,
      certificateFile,
      certificateTitle: (data.certificateTitle || '').trim(),
      description: (data.description || '').trim(),
      verificationStatus: data.verificationStatus || 'PENDING',
      rejectionReason: data.rejectionReason || '',
    };

    return await this.memberRepository.createSkill(payload, adminId);
  }

  async updateMemberSkill(
    memberId: string,
    skillId: string,
    data: any,
    file?: Express.Multer.File,
    adminId?: string
  ): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const existing = await this.memberRepository.findSkillById(skillId, memberId);
    if (!existing) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }

    const updatePayload: Partial<IMemberSkill> = {};

    if (data.specializationId) {
      if (!Types.ObjectId.isValid(data.specializationId)) {
        throw ApiError.badRequest('Invalid specialization ID format');
      }
      const specialization = await Specialization.findById(data.specializationId);
      if (!specialization) {
        throw ApiError.notFound(`Specialization with ID '${data.specializationId}' was not found`);
      }
      updatePayload.specializationId = new Types.ObjectId(data.specializationId);
    }

    if (data.startDate) {
      const parsedStartDate = new Date(data.startDate);
      if (isNaN(parsedStartDate.getTime())) {
        throw ApiError.badRequest('Invalid activity start date format');
      }
      updatePayload.startDate = parsedStartDate;
    }

    const rawPercentage = data.selfAssessmentPercentage ?? data.skillLevel;
    if (rawPercentage !== undefined && rawPercentage !== null && rawPercentage !== '') {
      const percentage = Number(rawPercentage);
      if (isNaN(percentage) || percentage < 1 || percentage > 100) {
        throw ApiError.badRequest('Self-assessment percentage must be a number between 1 and 100');
      }
      updatePayload.selfAssessmentPercentage = percentage;
    }

    if (data.hasCertificate !== undefined) {
      let hasCert = data.hasCertificate;
      if (typeof hasCert === 'string') {
        hasCert = hasCert.toLowerCase() === 'true' || hasCert === '1';
      } else {
        hasCert = Boolean(hasCert);
      }
      updatePayload.hasCertificate = hasCert;
    }

    if (data.certificateTitle !== undefined) {
      updatePayload.certificateTitle = data.certificateTitle.trim();
    }

    if (data.description !== undefined) {
      updatePayload.description = data.description.trim();
    }

    if (data.verificationStatus !== undefined) {
      updatePayload.verificationStatus = data.verificationStatus;
    }

    if (data.rejectionReason !== undefined) {
      updatePayload.rejectionReason = data.rejectionReason;
    }

    if (file) {
      // Remove old certificate file if present
      if (existing.certificateFile && existing.certificateFile.startsWith('/uploads/')) {
        const diskPath = path.join(process.cwd(), existing.certificateFile.replace(/^\//, ''));
        if (fs.existsSync(diskPath)) {
          try {
            fs.unlinkSync(diskPath);
          } catch {
            // Ignore file deletion error
          }
        }
      }
      updatePayload.certificateFile = `/uploads/members/certificates/${file.filename}`;
      updatePayload.hasCertificate = true;
    } else if (data.certificateFile !== undefined) {
      updatePayload.certificateFile = data.certificateFile.trim();
    }

    const updated = await this.memberRepository.updateSkill(
      skillId,
      memberId,
      updatePayload,
      adminId
    );
    if (!updated) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }
    return updated;
  }

  async deleteMemberSkill(memberId: string, skillId: string): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const deleted = await this.memberRepository.deleteSkill(skillId, memberId);
    if (!deleted) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }
    return deleted;
  }

  async uploadSkillCertificate(
    memberId: string,
    skillId: string,
    file: Express.Multer.File,
    adminId?: string
  ): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const skill = await this.memberRepository.findSkillById(skillId, memberId);
    if (!skill) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }

    // Remove old certificate file if present
    if (skill.certificateFile && skill.certificateFile.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), skill.certificateFile.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch {
          // Ignore file deletion error
        }
      }
    }

    const relativePath = `/uploads/members/certificates/${file.filename}`;
    const previousStatus = skill.verificationStatus;

    skill.certificateFile = relativePath;
    skill.hasCertificate = true;
    skill.verificationStatus = 'PENDING';
    skill.verifiedAt = null;
    skill.verifiedBy = null;
    skill.rejectionReason = '';

    skill.verificationLogs.push({
      fromStatus: previousStatus,
      toStatus: 'PENDING',
      changedBy: adminId ? new Types.ObjectId(adminId) : null,
      changedAt: new Date(),
      comment: 'Certificate uploaded - Pending expert verification',
    });

    await skill.save();

    return await skill.populate([
      { path: 'specializationId' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  async deleteSkillCertificate(memberId: string, skillId: string): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const skill = await this.memberRepository.findSkillById(skillId, memberId);
    if (!skill) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
    }

    if (skill.certificateFile && skill.certificateFile.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), skill.certificateFile.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch {
          // Ignore file deletion error
        }
      }
    }

    skill.certificateFile = '';
    skill.hasCertificate = false;
    await skill.save();

    return await skill.populate([
      { path: 'specializationId' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  async verifyMemberSkill(
    memberId: string,
    skillId: string,
    status: SkillVerificationStatus,
    rejectionReason?: string,
    adminId?: string,
    comment?: string
  ): Promise<IMemberSkill> {
    await this.getMemberById(memberId);
    const item = await this.memberRepository.findSkillById(skillId, memberId);
    if (!item) {
      throw ApiError.notFound(`Member skill with ID '${skillId}' not found for member '${memberId}'`);
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
      { path: 'specializationId' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  // --- Global Member Skills Methods (Expert Desk) ---
  async getAllSkills(filter: {
    memberId?: string;
    specializationId?: string;
    verificationStatus?: string;
  } = {}): Promise<IMemberSkill[]> {
    return await this.memberRepository.findAllSkills(filter);
  }

  async getSkillByIdGlobal(id: string): Promise<IMemberSkill> {
    const item = await this.memberRepository.findSkillByIdGlobal(id);
    if (!item) {
      throw ApiError.notFound(`Member skill with ID '${id}' was not found`);
    }
    return item;
  }

  async verifySkillGlobal(
    id: string,
    status: SkillVerificationStatus,
    rejectionReason?: string,
    adminId?: string,
    comment?: string
  ): Promise<IMemberSkill> {
    const item = await this.memberRepository.findSkillByIdGlobal(id);
    if (!item) {
      throw ApiError.notFound(`Member skill with ID '${id}' was not found`);
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
      { path: 'memberId', select: 'memberCode nationalCode firstName lastName fullName status' },
      { path: 'specializationId' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  // --- Member Portal Authentication ---
  async portalLogin(
    memberCode: string,
    nationalCode: string
  ): Promise<{ token: string; member: IMember }> {
    if (!memberCode || !nationalCode) {
      throw ApiError.badRequest('کد عضویت و کد ملی الزامی است');
    }

    const cleanMemberCode = String(memberCode)
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .trim();

    const cleanNationalCode = String(nationalCode)
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .trim();

    const member = await Member.findOne({
      memberCode: { $regex: new RegExp(`^${cleanMemberCode}$`, 'i') },
    });

    if (!member) {
      throw ApiError.notFound('عضوی با این کد عضویت در سامانه یافت نشد');
    }

    if (member.nationalCode) {
      const memberNational = String(member.nationalCode)
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
        .trim();

      if (memberNational !== cleanNationalCode) {
        throw ApiError.unauthorized('کد ملی وارد شده با پرونده عضویت مطابقت ندارد');
      }
    }

    const populated = await this.memberRepository.findById(member._id.toString());
    if (!populated) {
      throw ApiError.notFound('اطلاعات تفصیلی عضو یافت نشد');
    }

    const token = JwtUtil.sign({
      id: member._id.toString(),
      memberCode: member.memberCode,
      type: 'MEMBER',
    });

    return {
      token,
      member: populated,
    };
  }
}

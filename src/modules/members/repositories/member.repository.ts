import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { Member } from '../models/member.model';
import { MemberAddress } from '../models/member-address.model';
import { MemberTelephone } from '../models/member-telephone.model';
import { AcademicQualification } from '../../lookup/models/academic-qualification.model';
import { IMember } from '../interfaces/member.interface';
import { IMemberAddress } from '../interfaces/member-address.interface';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';
import {
  IAcademicQualification,
  QualificationVerificationStatus,
} from '../../lookup/interfaces/academic-qualification.interface';
import { ApiError } from '../../../common/utils/api-error';

export class MemberRepository {
  // --- Member Operations ---
  async create(data: Partial<IMember>): Promise<IMember> {
    return await Member.create(data);
  }

  async findById(id: string): Promise<IMember | null> {
    return await Member.findById(id)
      .populate('membershipTypeId')
      .populate('specializationId')
      .populate('rankId')
      .populate('natureOfMembership')
      .populate({
        path: 'latestAcademicQualifications',
        populate: [
          { path: 'academicField' },
          { path: 'degreeLevel' },
          { path: 'verifiedBy', select: 'username fullName type' },
        ],
      })
      .populate({
        path: 'academicQualifications',
        populate: [
          { path: 'academicField' },
          { path: 'degreeLevel' },
          { path: 'verifiedBy', select: 'username fullName type' },
          { path: 'verificationLogs.changedBy', select: 'username fullName type' },
        ],
      })
      .populate('companyInformation')
      .populate({
        path: 'addresses',
        populate: [
          { path: 'addressType' },
          { path: 'province' },
          { path: 'city' },
        ],
      })
      .populate('telephones');
  }

  async find(filter: FilterQuery<IMember> = {}, skip = 0, limit = 20): Promise<IMember[]> {
    return await Member.find(filter)
      .populate('membershipTypeId')
      .populate('specializationId')
      .populate('rankId')
      .populate('natureOfMembership')
      .populate({
        path: 'latestAcademicQualifications',
        populate: [
          { path: 'academicField' },
          { path: 'degreeLevel' },
          { path: 'verifiedBy', select: 'username fullName type' },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(filter: FilterQuery<IMember> = {}): Promise<number> {
    return await Member.countDocuments(filter);
  }

  async updateById(id: string, updateData: UpdateQuery<IMember>): Promise<IMember | null> {
    return await Member.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IMember | null> {
    // Delete associated addresses, telephones, and qualifications when member is deleted
    await Promise.all([
      MemberAddress.deleteMany({ membershipId: id }),
      MemberTelephone.deleteMany({ membershipId: id }),
      AcademicQualification.deleteMany({ memberId: id }),
    ]);
    return await Member.findByIdAndDelete(id);
  }

  // --- Member Address Operations ---
  async findAddressesByMemberId(membershipId: string): Promise<IMemberAddress[]> {
    return await MemberAddress.find({ membershipId })
      .populate('addressType')
      .populate('province')
      .populate('city')
      .sort({ isPrimary: -1, createdAt: -1 });
  }

  async findAddressById(addressId: string, membershipId: string): Promise<IMemberAddress | null> {
    return await MemberAddress.findOne({ _id: addressId, membershipId })
      .populate('addressType')
      .populate('province')
      .populate('city');
  }

  async createAddress(data: Partial<IMemberAddress>): Promise<IMemberAddress> {
    if (data.isPrimary) {
      // Unset other primary addresses for this member
      await MemberAddress.updateMany({ membershipId: data.membershipId }, { isPrimary: false });
    }
    const created = await MemberAddress.create(data);
    return await created.populate(['addressType', 'province', 'city']);
  }

  async updateAddress(
    addressId: string,
    membershipId: string,
    data: Partial<IMemberAddress>
  ): Promise<IMemberAddress | null> {
    if (data.isPrimary) {
      await MemberAddress.updateMany({ membershipId, _id: { $ne: addressId } }, { isPrimary: false });
    }
    return await MemberAddress.findOneAndUpdate({ _id: addressId, membershipId }, data, {
      new: true,
      runValidators: true,
    }).populate(['addressType', 'province', 'city']);
  }

  async deleteAddress(addressId: string, membershipId: string): Promise<IMemberAddress | null> {
    return await MemberAddress.findOneAndDelete({ _id: addressId, membershipId });
  }

  // --- Member Telephone Operations ---
  async findTelephonesByMemberId(membershipId: string): Promise<IMemberTelephone[]> {
    return await MemberTelephone.find({ membershipId }).sort({ isPrimary: -1, createdAt: -1 });
  }

  async findTelephoneById(telephoneId: string, membershipId: string): Promise<IMemberTelephone | null> {
    return await MemberTelephone.findOne({ _id: telephoneId, membershipId });
  }

  async createTelephone(data: Partial<IMemberTelephone>): Promise<IMemberTelephone> {
    if (data.isPrimary) {
      // Unset other primary telephones for this member
      await MemberTelephone.updateMany({ membershipId: data.membershipId }, { isPrimary: false });
    }
    return await MemberTelephone.create(data);
  }

  async updateTelephone(
    telephoneId: string,
    membershipId: string,
    data: Partial<IMemberTelephone>
  ): Promise<IMemberTelephone | null> {
    if (data.isPrimary) {
      await MemberTelephone.updateMany({ membershipId, _id: { $ne: telephoneId } }, { isPrimary: false });
    }
    return await MemberTelephone.findOneAndUpdate({ _id: telephoneId, membershipId }, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTelephone(telephoneId: string, membershipId: string): Promise<IMemberTelephone | null> {
    return await MemberTelephone.findOneAndDelete({ _id: telephoneId, membershipId });
  }

  // --- Member Academic Qualification Operations ---
  async findQualificationsByMemberId(memberId: string): Promise<IAcademicQualification[]> {
    return await AcademicQualification.find({ memberId })
      .populate('academicField')
      .populate('degreeLevel')
      .populate('verifiedBy', 'username fullName type')
      .populate('verificationLogs.changedBy', 'username fullName type')
      .sort({ createdAt: -1 });
  }

  async findQualificationById(qualificationId: string, memberId: string): Promise<IAcademicQualification | null> {
    return await AcademicQualification.findOne({ _id: qualificationId, memberId })
      .populate('academicField')
      .populate('degreeLevel')
      .populate('verifiedBy', 'username fullName type')
      .populate('verificationLogs.changedBy', 'username fullName type');
  }

  async createQualification(
    data: Partial<IAcademicQualification>,
    adminId?: string
  ): Promise<IAcademicQualification> {
    const initialStatus: QualificationVerificationStatus = data.verificationStatus || 'PENDING';
    if (initialStatus === 'REJECTED' && (!data.rejectionReason || !data.rejectionReason.trim())) {
      throw ApiError.badRequest('Rejection reason is required when status is REJECTED');
    }

    const payload: Partial<IAcademicQualification> = {
      ...data,
      verificationStatus: initialStatus,
    };

    if (adminId && initialStatus !== 'PENDING') {
      payload.verifiedBy = new Types.ObjectId(adminId);
      payload.verifiedAt = new Date();
    }

    const initialComment = initialStatus === 'REJECTED'
      ? (data.rejectionReason?.trim() || 'Initial registration - Rejected')
      : (initialStatus === 'APPROVED'
        ? 'Initial registration - Approved'
        : 'Initial registration - Pending expert verification');

    payload.verificationLogs = [
      {
        toStatus: initialStatus,
        changedBy: adminId ? new Types.ObjectId(adminId) : null,
        changedAt: new Date(),
        comment: initialComment,
      },
    ];

    const created = new AcademicQualification(payload);
    await created.save();

    return await created.populate([
      { path: 'academicField' },
      { path: 'degreeLevel' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  async updateQualification(
    qualificationId: string,
    memberId: string,
    data: Partial<IAcademicQualification>,
    adminId?: string
  ): Promise<IAcademicQualification | null> {
    const item = await AcademicQualification.findOne({ _id: qualificationId, memberId });
    if (!item) {
      return null;
    }

    const previousStatus = item.verificationStatus;
    const isStatusChanging = data.verificationStatus && data.verificationStatus !== previousStatus;

    if (isStatusChanging) {
      if (data.verificationStatus === 'REJECTED' && !data.rejectionReason?.trim() && !item.rejectionReason?.trim()) {
        throw ApiError.badRequest('Rejection reason is required when status is REJECTED');
      }

      const toStatus = data.verificationStatus as QualificationVerificationStatus;
      const logComment = toStatus === 'REJECTED'
        ? (data.rejectionReason?.trim() || item.rejectionReason || 'Qualification rejected')
        : (toStatus === 'APPROVED' ? 'Qualification approved' : 'Status reverted to pending');

      item.verificationLogs.push({
        fromStatus: previousStatus,
        toStatus,
        changedBy: adminId ? new Types.ObjectId(adminId) : null,
        changedAt: new Date(),
        comment: logComment,
      });

      item.verificationStatus = toStatus;
      item.verifiedAt = toStatus !== 'PENDING' ? new Date() : null;
      if (adminId) {
        item.verifiedBy = new Types.ObjectId(adminId);
      }
      if (toStatus === 'REJECTED') {
        item.rejectionReason = (data.rejectionReason || item.rejectionReason || '').trim();
      } else if (toStatus === 'APPROVED') {
        item.rejectionReason = '';
      }
    } else if (data.rejectionReason !== undefined) {
      item.rejectionReason = data.rejectionReason.trim();
    }

    const { verificationStatus, verifiedBy, verifiedAt, verificationLogs, ...otherFields } = data as any;
    Object.assign(item, otherFields);

    await item.save();

    return await item.populate([
      { path: 'academicField' },
      { path: 'degreeLevel' },
      { path: 'verifiedBy', select: 'username fullName type' },
      { path: 'verificationLogs.changedBy', select: 'username fullName type' },
    ]);
  }

  async deleteQualification(qualificationId: string, memberId: string): Promise<IAcademicQualification | null> {
    const deleted = await AcademicQualification.findOneAndDelete({ _id: qualificationId, memberId });
    if (deleted) {
      // Clear latestAcademicQualifications if it pointed to this qualification
      await Member.updateOne(
        { _id: memberId, latestAcademicQualifications: qualificationId },
        { $unset: { latestAcademicQualifications: 1 } }
      );
    }
    return deleted;
  }
}

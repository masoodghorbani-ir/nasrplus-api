import { Model, Document, Types, UpdateQuery } from 'mongoose';
import {
  MembershipType,
  Specialization,
  Rank,
  NatureOfMembership,
  AcademicField,
  DegreeLevel,
  AcademicQualification,
  AddressType,
  Province,
  City,
} from '../models';
import { Member } from '../../members/models/member.model';
import { MemberAddress } from '../../members/models/member-address.model';
import { MemberSkill } from '../../members/models/member-skill.model';
import { assertNotReferenced, ReferenceUsage } from '../../../common/utils/reference-guard';
import {
  IMembershipType,
  ISpecialization,
  IRank,
  INatureOfMembership,
  IAcademicField,
  IDegreeLevel,
  IAcademicQualification,
  IAddressType,
  IProvince,
  ICity,
  QualificationVerificationStatus,
} from '../interfaces';
import { ApiError } from '../../../common/utils/api-error';

export class LookupService {
  private async getAllFromModel<T extends Document>(model: Model<T>, filter = {}): Promise<T[]> {
    return await model.find(filter).sort({ title: 1 });
  }

  private async getByIdFromModel<T extends Document>(model: Model<T>, id: string, entityName: string): Promise<T> {
    const item = await model.findById(id);
    if (!item) {
      throw ApiError.notFound(`${entityName} with ID '${id}' was not found`);
    }
    return item;
  }

  private async createInModel<T extends Document>(model: Model<T>, data: unknown): Promise<T> {
    return (await model.create(data)) as unknown as T;
  }

  private async updateInModel<T extends Document>(
    model: Model<T>,
    id: string,
    data: UpdateQuery<T>,
    entityName: string
  ): Promise<T> {
    const updated = await model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw ApiError.notFound(`${entityName} with ID '${id}' was not found`);
    }
    return updated as unknown as T;
  }

  private async deleteFromModel<T extends Document>(
    model: Model<T>,
    id: string,
    entityName: string,
    usages: ReferenceUsage[] = []
  ): Promise<T> {
    await assertNotReferenced(id, usages);
    const deleted = await model.findByIdAndDelete(id);
    if (!deleted) {
      throw ApiError.notFound(`${entityName} with ID '${id}' was not found`);
    }
    return deleted as unknown as T;
  }

  // --- Membership Types ---
  async getMembershipTypes(): Promise<IMembershipType[]> {
    return this.getAllFromModel(MembershipType);
  }
  async getMembershipTypeById(id: string): Promise<IMembershipType> {
    return this.getByIdFromModel(MembershipType, id, 'Membership type');
  }
  async createMembershipType(data: Partial<IMembershipType>): Promise<IMembershipType> {
    return this.createInModel(MembershipType, data);
  }
  async updateMembershipType(id: string, data: Partial<IMembershipType>): Promise<IMembershipType> {
    return this.updateInModel(MembershipType, id, data, 'Membership type');
  }
  async deleteMembershipType(id: string): Promise<IMembershipType> {
    return this.deleteFromModel(MembershipType, id, 'Membership type', [
      { model: Member, field: 'membershipTypeId', label: 'members' },
    ]);
  }

  // --- Specializations ---
  async getSpecializations(): Promise<ISpecialization[]> {
    return this.getAllFromModel(Specialization);
  }
  async getSpecializationById(id: string): Promise<ISpecialization> {
    return this.getByIdFromModel(Specialization, id, 'Specialization');
  }
  async createSpecialization(data: Partial<ISpecialization>): Promise<ISpecialization> {
    return this.createInModel(Specialization, data);
  }
  async updateSpecialization(id: string, data: Partial<ISpecialization>): Promise<ISpecialization> {
    return this.updateInModel(Specialization, id, data, 'Specialization');
  }
  async deleteSpecialization(id: string): Promise<ISpecialization> {
    return this.deleteFromModel(Specialization, id, 'Specialization', [
      { model: Member, field: 'specializationId', label: 'members' },
      { model: MemberSkill, field: 'specializationId', label: 'member skills' },
    ]);
  }

  // --- Ranks ---
  async getRanks(): Promise<IRank[]> {
    return await Rank.find().sort({ level: 1, title: 1 });
  }
  async getRankById(id: string): Promise<IRank> {
    return this.getByIdFromModel(Rank, id, 'Rank');
  }
  async createRank(data: Partial<IRank>): Promise<IRank> {
    return this.createInModel(Rank, data);
  }
  async updateRank(id: string, data: Partial<IRank>): Promise<IRank> {
    return this.updateInModel(Rank, id, data, 'Rank');
  }
  async deleteRank(id: string): Promise<IRank> {
    return this.deleteFromModel(Rank, id, 'Rank', [
      { model: Member, field: 'rankId', label: 'members' },
    ]);
  }

  // --- Nature of Membership ---
  async getNatureOfMemberships(): Promise<INatureOfMembership[]> {
    return this.getAllFromModel(NatureOfMembership);
  }
  async getNatureOfMembershipById(id: string): Promise<INatureOfMembership> {
    return this.getByIdFromModel(NatureOfMembership, id, 'Nature of membership');
  }
  async createNatureOfMembership(data: Partial<INatureOfMembership>): Promise<INatureOfMembership> {
    return this.createInModel(NatureOfMembership, data);
  }
  async updateNatureOfMembership(id: string, data: Partial<INatureOfMembership>): Promise<INatureOfMembership> {
    return this.updateInModel(NatureOfMembership, id, data, 'Nature of membership');
  }
  async deleteNatureOfMembership(id: string): Promise<INatureOfMembership> {
    return this.deleteFromModel(NatureOfMembership, id, 'Nature of membership', [
      { model: Member, field: 'natureOfMembership', label: 'members' },
    ]);
  }

  // --- Academic Fields ---
  async getAcademicFields(): Promise<IAcademicField[]> {
    return this.getAllFromModel(AcademicField);
  }
  async getAcademicFieldById(id: string): Promise<IAcademicField> {
    return this.getByIdFromModel(AcademicField, id, 'Academic field');
  }
  async createAcademicField(data: Partial<IAcademicField>): Promise<IAcademicField> {
    return this.createInModel(AcademicField, data);
  }
  async updateAcademicField(id: string, data: Partial<IAcademicField>): Promise<IAcademicField> {
    return this.updateInModel(AcademicField, id, data, 'Academic field');
  }
  async deleteAcademicField(id: string): Promise<IAcademicField> {
    return this.deleteFromModel(AcademicField, id, 'Academic field', [
      { model: AcademicQualification, field: 'academicField', label: 'academic qualifications' },
    ]);
  }

  // --- Degree Levels ---
  async getDegreeLevels(): Promise<IDegreeLevel[]> {
    return this.getAllFromModel(DegreeLevel);
  }
  async getDegreeLevelById(id: string): Promise<IDegreeLevel> {
    return this.getByIdFromModel(DegreeLevel, id, 'Degree level');
  }
  async createDegreeLevel(data: Partial<IDegreeLevel>): Promise<IDegreeLevel> {
    return this.createInModel(DegreeLevel, data);
  }
  async updateDegreeLevel(id: string, data: Partial<IDegreeLevel>): Promise<IDegreeLevel> {
    return this.updateInModel(DegreeLevel, id, data, 'Degree level');
  }
  async deleteDegreeLevel(id: string): Promise<IDegreeLevel> {
    return this.deleteFromModel(DegreeLevel, id, 'Degree level', [
      { model: AcademicQualification, field: 'degreeLevel', label: 'academic qualifications' },
    ]);
  }

  // --- Academic Qualifications ---
  async getAcademicQualifications(
    filter: { memberId?: string; verificationStatus?: string } = {}
  ): Promise<IAcademicQualification[]> {
    const query: Record<string, any> = {};
    if (filter.memberId) query.memberId = filter.memberId;
    if (filter.verificationStatus) query.verificationStatus = filter.verificationStatus;

    return await AcademicQualification.find(query)
      .populate('academicField')
      .populate('degreeLevel')
      .populate('verifiedBy', 'username fullName type')
      .populate('verificationLogs.changedBy', 'username fullName type')
      .sort({ createdAt: -1 });
  }

  async getAcademicQualificationById(id: string): Promise<IAcademicQualification> {
    const item = await AcademicQualification.findById(id)
      .populate('academicField')
      .populate('degreeLevel')
      .populate('verifiedBy', 'username fullName type')
      .populate('verificationLogs.changedBy', 'username fullName type');
    if (!item) {
      throw ApiError.notFound(`Academic qualification with ID '${id}' was not found`);
    }
    return item;
  }

  async createAcademicQualification(
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
      ? (data.rejectionReason?.trim() || 'ثبت اولیه مدرک - رد شده')
      : (initialStatus === 'APPROVED'
        ? 'ثبت اولیه مدرک - تایید شده'
        : 'ثبت اولیه مدرک - در انتظار تایید کارشناس');

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

  async updateAcademicQualification(
    id: string,
    data: Partial<IAcademicQualification>,
    adminId?: string
  ): Promise<IAcademicQualification> {
    const item = await AcademicQualification.findById(id);
    if (!item) {
      throw ApiError.notFound(`Academic qualification with ID '${id}' was not found`);
    }

    const previousStatus = item.verificationStatus;
    const isStatusChanging = data.verificationStatus && data.verificationStatus !== previousStatus;

    if (isStatusChanging) {
      if (data.verificationStatus === 'REJECTED' && !data.rejectionReason?.trim() && !item.rejectionReason?.trim()) {
        throw ApiError.badRequest('Rejection reason is required when status is REJECTED');
      }

      const toStatus = data.verificationStatus as QualificationVerificationStatus;
      const logComment = toStatus === 'REJECTED'
        ? (data.rejectionReason?.trim() || item.rejectionReason || 'رد مدرک تحصیلی')
        : (toStatus === 'APPROVED' ? 'تایید مدرک تحصیلی' : 'بازنشانی وضعیت به در انتظار بررسی');

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

  async verifyAcademicQualification(
    id: string,
    status: QualificationVerificationStatus,
    rejectionReason?: string,
    adminId?: string,
    comment?: string
  ): Promise<IAcademicQualification> {
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw ApiError.badRequest('Invalid verification status. Allowed: PENDING, APPROVED, REJECTED');
    }

    if (status === 'REJECTED' && (!rejectionReason || !rejectionReason.trim())) {
      throw ApiError.badRequest('Rejection reason is required when status is REJECTED');
    }

    const item = await AcademicQualification.findById(id);
    if (!item) {
      throw ApiError.notFound(`Academic qualification with ID '${id}' was not found`);
    }

    const fromStatus = item.verificationStatus;
    const statusTextFa = status === 'APPROVED' ? 'تایید شده' : (status === 'REJECTED' ? 'رد شده' : 'در انتظار بررسی');
    const finalComment = comment?.trim() || (status === 'REJECTED' ? rejectionReason!.trim() : `تغییر وضعیت به ${statusTextFa}`);

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

  async deleteAcademicQualification(id: string): Promise<IAcademicQualification> {
    return this.deleteFromModel(AcademicQualification, id, 'Academic qualification', [
      { model: Member, field: 'latestAcademicQualifications', label: 'members' },
    ]);
  }

  // --- Address Types ---
  async getAddressTypes(): Promise<IAddressType[]> {
    return this.getAllFromModel(AddressType);
  }
  async getAddressTypeById(id: string): Promise<IAddressType> {
    return this.getByIdFromModel(AddressType, id, 'Address type');
  }
  async createAddressType(data: Partial<IAddressType>): Promise<IAddressType> {
    return this.createInModel(AddressType, data);
  }
  async updateAddressType(id: string, data: Partial<IAddressType>): Promise<IAddressType> {
    return this.updateInModel(AddressType, id, data, 'Address type');
  }
  async deleteAddressType(id: string): Promise<IAddressType> {
    return this.deleteFromModel(AddressType, id, 'Address type', [
      { model: MemberAddress, field: 'addressType', label: 'member addresses' },
    ]);
  }

  // --- Provinces ---
  async getProvinces(): Promise<IProvince[]> {
    return this.getAllFromModel(Province);
  }
  async getProvinceById(id: string): Promise<IProvince> {
    return this.getByIdFromModel(Province, id, 'Province');
  }
  async createProvince(data: Partial<IProvince>): Promise<IProvince> {
    return this.createInModel(Province, data);
  }
  async updateProvince(id: string, data: Partial<IProvince>): Promise<IProvince> {
    return this.updateInModel(Province, id, data, 'Province');
  }
  async deleteProvince(id: string): Promise<IProvince> {
    return this.deleteFromModel(Province, id, 'Province', [
      { model: City, field: 'provinceId', label: 'cities' },
      { model: MemberAddress, field: 'province', label: 'member addresses' },
    ]);
  }

  // --- Cities ---
  async getCities(provinceId?: string): Promise<ICity[]> {
    const filter = provinceId ? { provinceId } : {};
    return await City.find(filter).populate('provinceId').sort({ title: 1 });
  }
  async getCityById(id: string): Promise<ICity> {
    const item = await City.findById(id).populate('provinceId');
    if (!item) {
      throw ApiError.notFound(`City with ID '${id}' was not found`);
    }
    return item;
  }
  async createCity(data: Partial<ICity>): Promise<ICity> {
    const created = await City.create(data);
    return await created.populate('provinceId');
  }
  async updateCity(id: string, data: Partial<ICity>): Promise<ICity> {
    const updated = await City.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('provinceId');
    if (!updated) {
      throw ApiError.notFound(`City with ID '${id}' was not found`);
    }
    return updated;
  }
  async deleteCity(id: string): Promise<ICity> {
    return this.deleteFromModel(City, id, 'City', [
      { model: MemberAddress, field: 'city', label: 'member addresses' },
    ]);
  }
}

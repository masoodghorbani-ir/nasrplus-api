import { FilterQuery, UpdateQuery } from 'mongoose';
import { Member } from '../models/member.model';
import { IMember } from '../interfaces/member.interface';

export class MemberRepository {
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
        populate: { path: 'academicField' },
      })
      .populate('companyInformation')
      .populate('addresses')
      .populate('telephones');
  }

  async find(filter: FilterQuery<IMember> = {}, skip = 0, limit = 20): Promise<IMember[]> {
    return await Member.find(filter)
      .populate('membershipTypeId')
      .populate('specializationId')
      .populate('rankId')
      .populate('natureOfMembership')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(filter: FilterQuery<IMember> = {}): Promise<number> {
    return await Member.countDocuments(filter);
  }

  async updateById(id: string, updateData: UpdateQuery<IMember>): Promise<IMember | null> {
    return await Member.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string): Promise<IMember | null> {
    return await Member.findByIdAndDelete(id);
  }
}

import { FilterQuery, UpdateQuery } from 'mongoose';
import { Member } from '../models/member.model';
import { MemberAddress } from '../models/member-address.model';
import { MemberTelephone } from '../models/member-telephone.model';
import { IMember } from '../interfaces/member.interface';
import { IMemberAddress } from '../interfaces/member-address.interface';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';

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
        ],
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
    return await Member.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IMember | null> {
    // Delete associated addresses and telephones when member is deleted
    await Promise.all([
      MemberAddress.deleteMany({ membershipId: id }),
      MemberTelephone.deleteMany({ membershipId: id }),
    ]);
    return await Member.findByIdAndDelete(id);
  }

  // --- Member Address Operations ---
  async findAddressesByMemberId(membershipId: string): Promise<IMemberAddress[]> {
    return await MemberAddress.find({ membershipId }).sort({ isPrimary: -1, createdAt: -1 });
  }

  async findAddressById(addressId: string, membershipId: string): Promise<IMemberAddress | null> {
    return await MemberAddress.findOne({ _id: addressId, membershipId });
  }

  async createAddress(data: Partial<IMemberAddress>): Promise<IMemberAddress> {
    if (data.isPrimary) {
      // Unset other primary addresses for this member
      await MemberAddress.updateMany({ membershipId: data.membershipId }, { isPrimary: false });
    }
    return await MemberAddress.create(data);
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
    });
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
}

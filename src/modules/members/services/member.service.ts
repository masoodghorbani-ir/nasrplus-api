import { MemberRepository } from '../repositories/member.repository';
import { IMember } from '../interfaces/member.interface';
import { IMemberAddress } from '../interfaces/member-address.interface';
import { IMemberTelephone } from '../interfaces/member-telephone.interface';
import { ApiError } from '../../../common/utils/api-error';
import { FilterQuery, Types } from 'mongoose';

export interface MemberFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  memberType?: string;
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
    if (options.memberType) {
      filter.memberType = options.memberType;
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
    const deleted = await this.memberRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound(`Member with ID '${id}' was not found`);
    }
    return deleted;
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
}

import { MemberRepository } from '../repositories/member.repository';
import { IMember } from '../interfaces/member.interface';
import { ApiError } from '../../../common/utils/api-error';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async getMemberById(id: string): Promise<IMember> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw ApiError.notFound('عضو مورد نظر یافت نشد');
    }
    return member;
  }

  async getMembers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.memberRepository.find({}, skip, limit),
      this.memberRepository.count({}),
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
}

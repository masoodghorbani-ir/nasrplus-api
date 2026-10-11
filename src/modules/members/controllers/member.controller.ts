import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/member.service';
import { ApiResponse } from '../../../common/utils/api-response';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const result = await this.memberService.getMembers(page, limit);
      res.json(ApiResponse.success(result.items, 'لیست اعضا با موفقیت دریافت شد', {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }));
    } catch (error) {
      next(error);
    }
  };

  getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const member = await this.memberService.getMemberById(id);
      res.json(ApiResponse.success(member, 'اطلاعات عضو دریافت شد'));
    } catch (error) {
      next(error);
    }
  };

  createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.memberService.createMember(req.body);
      res.status(201).json(ApiResponse.created(created, 'عضو جدید با موفقیت ثبت شد'));
    } catch (error) {
      next(error);
    }
  };
}

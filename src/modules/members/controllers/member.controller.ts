import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/member.service';
import { ApiResponse } from '../../../common/utils/api-response';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  // --- Member Core Handlers ---
  getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = (req.query.search as string) || undefined;
      const status = (req.query.status as string) || undefined;
      const membershipTypeId = (req.query.membershipTypeId as string) || undefined;
      const specializationId = (req.query.specializationId as string) || undefined;
      const rankId = (req.query.rankId as string) || undefined;

      const result = await this.memberService.getMembers({
        page,
        limit,
        search,
        status,
        membershipTypeId,
        specializationId,
        rankId,
      });

      res.json(
        ApiResponse.success(result.items, 'Members retrieved successfully', {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const member = await this.memberService.getMemberById(id);
      res.json(ApiResponse.success(member, 'Member details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.memberService.createMember(req.body);
      res.status(201).json(ApiResponse.created(created, 'Member created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await this.memberService.updateMember(id, req.body);
      res.json(ApiResponse.success(updated, 'Member updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const deleted = await this.memberService.deleteMember(id);
      res.json(ApiResponse.success(deleted, 'Member deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Member Address Handlers ---
  getMemberAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const addresses = await this.memberService.getMemberAddresses(memberId);
      res.json(ApiResponse.success(addresses, 'Member addresses retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  addMemberAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const address = await this.memberService.addMemberAddress(memberId, req.body);
      res.status(201).json(ApiResponse.created(address, 'Address added successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateMemberAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const addressId = req.params.addressId as string;
      const address = await this.memberService.updateMemberAddress(memberId, addressId, req.body);
      res.json(ApiResponse.success(address, 'Address updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteMemberAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const addressId = req.params.addressId as string;
      const deleted = await this.memberService.deleteMemberAddress(memberId, addressId);
      res.json(ApiResponse.success(deleted, 'Address deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Member Telephone Handlers ---
  getMemberTelephones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const telephones = await this.memberService.getMemberTelephones(memberId);
      res.json(ApiResponse.success(telephones, 'Member telephones retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  addMemberTelephone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const telephone = await this.memberService.addMemberTelephone(memberId, req.body);
      res.status(201).json(ApiResponse.created(telephone, 'Telephone added successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateMemberTelephone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const telephoneId = req.params.telephoneId as string;
      const telephone = await this.memberService.updateMemberTelephone(memberId, telephoneId, req.body);
      res.json(ApiResponse.success(telephone, 'Telephone updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteMemberTelephone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const telephoneId = req.params.telephoneId as string;
      const deleted = await this.memberService.deleteMemberTelephone(memberId, telephoneId);
      res.json(ApiResponse.success(deleted, 'Telephone deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --- Member Academic Qualification Handlers ---
  getMemberAcademicQualifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const items = await this.memberService.getMemberAcademicQualifications(memberId);
      res.json(ApiResponse.success(items, 'Member academic qualifications retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  addMemberAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const adminId = (req as any).admin?._id?.toString();
      const qualification = await this.memberService.addMemberAcademicQualification(
        memberId,
        req.body,
        adminId
      );
      res.status(201).json(ApiResponse.created(qualification, 'Academic qualification added successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateMemberAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const qualificationId = req.params.qualificationId as string;
      const adminId = (req as any).admin?._id?.toString();
      const qualification = await this.memberService.updateMemberAcademicQualification(
        memberId,
        qualificationId,
        req.body,
        adminId
      );
      res.json(ApiResponse.success(qualification, 'Academic qualification updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteMemberAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const qualificationId = req.params.qualificationId as string;
      const deleted = await this.memberService.deleteMemberAcademicQualification(memberId, qualificationId);
      res.json(ApiResponse.success(deleted, 'Academic qualification deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  verifyMemberAcademicQualification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberId = req.params.id as string;
      const qualificationId = req.params.qualificationId as string;
      const { status, rejectionReason, comment } = req.body;
      const adminId = (req as any).admin?._id?.toString();

      const updated = await this.memberService.verifyMemberAcademicQualification(
        memberId,
        qualificationId,
        status,
        rejectionReason,
        adminId,
        comment
      );
      res.json(
        ApiResponse.success(updated, 'Academic qualification verification status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service';
import { ApiResponse } from '../../../common/utils/api-response';

export class CompanyController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  getCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || undefined;
      const result = await this.companyService.getCompanies(page, limit, search);
      res.json(
        ApiResponse.success(result.items, 'Companies retrieved successfully', {
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

  getCompanyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const company = await this.companyService.getCompanyById(id);
      res.json(ApiResponse.success(company, 'Company details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.companyService.createCompany(req.body);
      res.status(201).json(ApiResponse.created(created, 'Company created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await this.companyService.updateCompany(id, req.body);
      res.json(ApiResponse.success(updated, 'Company updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const deleted = await this.companyService.deleteCompany(id);
      res.json(ApiResponse.success(deleted, 'Company deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

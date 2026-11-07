import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../../../common/utils/api-response';
import { ApiError } from '../../../common/utils/api-error';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getAdmins = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admins = await this.adminService.getAdmins();
      res.json(ApiResponse.success(admins, 'Admins retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAdminById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const admin = await this.adminService.getAdminById(id);
      res.json(ApiResponse.success(admin, 'Admin retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw ApiError.badRequest('Username and password are required');
      }

      const admin = await this.adminService.createAdmin(req.body);
      res.status(201).json(ApiResponse.created(admin, 'Admin created successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const admin = await this.adminService.updateAdmin(id, req.body);
      res.json(ApiResponse.success(admin, 'Admin updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.adminService.deleteAdmin(id);
      res.json(ApiResponse.success(null, 'Admin deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  getPermissions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissions = await this.adminService.getPermissions();
      res.json(ApiResponse.success(permissions, 'Permissions retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  createPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, key } = req.body;
      if (!name || !key) {
        throw ApiError.badRequest('Permission name and key are required');
      }

      const permission = await this.adminService.createPermission(req.body);
      res.status(201).json(ApiResponse.created(permission, 'Permission created successfully'));
    } catch (error) {
      next(error);
    }
  };

  assignPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { permissionIds } = req.body;
      if (!Array.isArray(permissionIds)) {
        throw ApiError.badRequest('permissionIds must be an array of IDs');
      }

      const id = req.params.id as string;
      const admin = await this.adminService.assignPermissions(id, permissionIds);
      res.json(ApiResponse.success(admin, 'Permissions assigned successfully'));
    } catch (error) {
      next(error);
    }
  };

  getLoginLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const { adminId, username, adminType, status, startDate, endDate, search } = req.query;

      const result = await this.adminService.getLoginLogs({
        page,
        limit,
        adminId: adminId as string,
        username: username as string,
        adminType: adminType as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
      });

      res.json(ApiResponse.success(result, 'Admin login logs retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };
}

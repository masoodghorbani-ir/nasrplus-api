import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../common/utils/api-response';
import { ApiError } from '../../../common/utils/api-error';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /** Login admin and return JWT token */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw ApiError.badRequest('Username and password are required');
      }

      const forwarded = req.headers['x-forwarded-for'];
      const rawIp =
        (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) ||
        req.socket.remoteAddress ||
        req.ip ||
        'Unknown';
      const userAgent = (req.headers['user-agent'] as string) || '';

      const result = await this.authService.login(username, password, {
        ip: rawIp,
        userAgent,
      });
      res.json(ApiResponse.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  };

  /** Change password for the authenticated admin */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.admin) {
        throw ApiError.unauthorized('Authentication required');
      }

      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(
        req.admin._id.toString(),
        currentPassword,
        newPassword
      );
      res.json(ApiResponse.success(null, 'رمز عبور با موفقیت تغییر کرد'));
    } catch (error) {
      next(error);
    }
  };

  /** Retrieve authenticated admin profile */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.admin) {
        throw ApiError.unauthorized('Authentication required');
      }

      const profile = await this.authService.getProfile(req.admin._id.toString());
      res.json(ApiResponse.success(profile, 'Profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  /** Retrieve authenticated admin's own login logs */
  getMyLoginLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.admin) {
        throw ApiError.unauthorized('Authentication required');
      }

      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

      const result = await this.authService.getMyLoginLogs(
        req.admin._id.toString(),
        page,
        limit
      );
      res.json(ApiResponse.success(result, 'Login history retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };
}

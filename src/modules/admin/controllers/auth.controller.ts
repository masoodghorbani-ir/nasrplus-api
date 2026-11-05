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

      const result = await this.authService.login(username, password);
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
}

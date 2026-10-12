import { Admin } from '../models/admin.model';
import { JwtUtil } from '../../../common/utils/jwt.util';
import { ApiError } from '../../../common/utils/api-error';
import { IAdminDocument } from '../interfaces/admin.interface';
import { IPermission } from '../interfaces/permission.interface';

export interface LoginResult {
  token: string;
  admin: {
    id: string;
    username: string;
    type: string;
    fullName?: string;
    permissions: IPermission[];
  };
}

export class AuthService {
  /** Authenticate admin by credentials and issue JWT token */
  async login(username: string, password: string): Promise<LoginResult> {
    const trimmedUsername = username.trim().toLowerCase();
    const admin = await Admin.findOne({ username: trimmedUsername }).populate<{
      permissions: IPermission[];
    }>('permissions');

    if (!admin) {
      throw ApiError.unauthorized('Invalid username or password');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Admin account is disabled');
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid username or password');
    }

    const token = JwtUtil.sign({
      id: admin._id.toString(),
      username: admin.username,
      type: admin.type,
    });

    return {
      token,
      admin: {
        id: admin._id.toString(),
        username: admin.username,
        type: admin.type,
        fullName: admin.fullName,
        permissions: (admin.permissions as IPermission[]) || [],
      },
    };
  }

  /** Retrieve authenticated admin profile */
  async getProfile(adminId: string): Promise<IAdminDocument> {
    const admin = await Admin.findById(adminId).populate('permissions');
    if (!admin) {
      throw ApiError.notFound('Admin profile not found');
    }
    return admin;
  }
}

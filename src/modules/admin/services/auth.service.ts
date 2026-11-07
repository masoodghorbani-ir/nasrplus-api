import { Types } from 'mongoose';
import { Admin } from '../models/admin.model';
import { AdminLoginLog } from '../models/admin-login-log.model';
import { JwtUtil } from '../../../common/utils/jwt.util';
import { ApiError } from '../../../common/utils/api-error';
import { IAdminDocument } from '../interfaces/admin.interface';
import { IPermission } from '../interfaces/permission.interface';
import { ISpecialization } from '../../lookup/interfaces/specialization.interface';
import { parseUserAgent } from '../utils/device-detector.util';

export interface LoginMetadata {
  ip?: string;
  userAgent?: string;
}

export interface LoginResult {
  token: string;
  admin: {
    id: string;
    username: string;
    type: string;
    fullName?: string;
    permissions: IPermission[];
    reviewableSpecializations?: ISpecialization[];
  };
}

export class AuthService {
  /** Safely record admin login attempts to audit log */
  private async recordLoginLog(params: {
    adminId?: Types.ObjectId;
    username: string;
    adminType?: any;
    fullName?: string;
    ip?: string;
    userAgent?: string;
    status: 'SUCCESS' | 'FAILED';
    failureReason?: string;
  }): Promise<void> {
    try {
      const parsed = parseUserAgent(params.userAgent);
      await AdminLoginLog.create({
        adminId: params.adminId,
        username: params.username,
        adminType: params.adminType,
        fullName: params.fullName || '',
        ip: params.ip || 'Unknown',
        userAgent: params.userAgent || '',
        device: parsed.device,
        browser: parsed.browser,
        os: parsed.os,
        status: params.status,
        failureReason: params.failureReason,
        loginAt: new Date(),
      });
    } catch {
      // Do not block authentication flow if logging encounters transient errors
    }
  }

  /** Authenticate admin by credentials and issue JWT token */
  async login(
    username: string,
    password: string,
    meta?: LoginMetadata
  ): Promise<LoginResult> {
    const trimmedUsername = username.trim().toLowerCase();
    const admin = await Admin.findOne({ username: trimmedUsername })
      .populate<{ permissions: IPermission[] }>('permissions')
      .populate<{ reviewableSpecializations: ISpecialization[] }>('reviewableSpecializations');

    if (!admin) {
      await this.recordLoginLog({
        username: trimmedUsername,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
        status: 'FAILED',
        failureReason: 'User not found',
      });
      throw ApiError.unauthorized('Invalid username or password');
    }

    if (!admin.isActive) {
      await this.recordLoginLog({
        adminId: admin._id,
        username: admin.username,
        adminType: admin.type,
        fullName: admin.fullName,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
        status: 'FAILED',
        failureReason: 'Admin account is disabled',
      });
      throw ApiError.forbidden('Admin account is disabled');
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      await this.recordLoginLog({
        adminId: admin._id,
        username: admin.username,
        adminType: admin.type,
        fullName: admin.fullName,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
        status: 'FAILED',
        failureReason: 'Invalid password',
      });
      throw ApiError.unauthorized('Invalid username or password');
    }

    // Record successful login audit log
    await this.recordLoginLog({
      adminId: admin._id,
      username: admin.username,
      adminType: admin.type,
      fullName: admin.fullName,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
      status: 'SUCCESS',
    });

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
        reviewableSpecializations: (admin.reviewableSpecializations as ISpecialization[]) || [],
      },
    };
  }

  /** Retrieve authenticated admin profile */
  async getProfile(adminId: string): Promise<IAdminDocument> {
    const admin = await Admin.findById(adminId)
      .populate('permissions')
      .populate('reviewableSpecializations');
    if (!admin) {
      throw ApiError.notFound('Admin profile not found');
    }
    return admin;
  }

  /** Change the authenticated admin password after verifying the current one */
  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest('رمز عبور فعلی و رمز عبور جدید الزامی است');
    }

    const cleanNew = String(newPassword).trim();
    if (cleanNew.length < 6) {
      throw ApiError.badRequest('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw ApiError.notFound('حساب مدیر یافت نشد');
    }

    const isCurrentValid = await admin.comparePassword(String(currentPassword));
    if (!isCurrentValid) {
      throw ApiError.badRequest('رمز عبور فعلی صحیح نیست');
    }

    if (await admin.comparePassword(cleanNew)) {
      throw ApiError.badRequest('رمز عبور جدید نباید با رمز فعلی یکسان باشد');
    }

    admin.password = cleanNew;
    await admin.save();
  }

  /** Retrieve login history for a specific admin */
  async getMyLoginLogs(
    adminId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ logs: any[]; pagination: any }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const query = { adminId: new Types.ObjectId(adminId) };
    const [logs, total] = await Promise.all([
      AdminLoginLog.find(query).sort({ loginAt: -1 }).skip(skip).limit(safeLimit),
      AdminLoginLog.countDocuments(query),
    ]);

    return {
      logs,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }
}

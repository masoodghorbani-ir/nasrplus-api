import { Types } from 'mongoose';
import { Admin } from '../models/admin.model';
import { Permission } from '../models/permission.model';
import { AdminLoginLog } from '../models/admin-login-log.model';
import { Specialization } from '../../lookup/models/specialization.model';
import { AdminType, IAdminDocument } from '../interfaces/admin.interface';
import { IPermissionDocument } from '../interfaces/permission.interface';
import { IAdminLoginLogDocument } from '../interfaces/admin-login-log.interface';
import { AcademicQualification } from '../../lookup/models/academic-qualification.model';
import { MemberSkill } from '../../members/models/member-skill.model';
import { ApiError } from '../../../common/utils/api-error';
import { assertNotReferenced } from '../../../common/utils/reference-guard';

export interface CreateAdminDto {
  username: string;
  password: string;
  type?: AdminType;
  fullName?: string;
  isActive?: boolean;
  permissions?: string[];
  reviewableSpecializations?: string[];
}

export interface UpdateAdminDto {
  username?: string;
  password?: string;
  type?: AdminType;
  fullName?: string;
  isActive?: boolean;
  permissions?: string[];
  reviewableSpecializations?: string[];
}

export interface GetLoginLogsFilter {
  page?: number;
  limit?: number;
  adminId?: string;
  username?: string;
  adminType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginatedLoginLogs {
  logs: IAdminLoginLogDocument[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class AdminService {
  /** Validate and transform reviewable specialization IDs */
  private async validateSpecializations(specIds: string[]): Promise<Types.ObjectId[]> {
    if (!Array.isArray(specIds) || specIds.length === 0) {
      throw ApiError.badRequest('At least one reviewable specialization is required for expert admins');
    }

    const uniqueIds = Array.from(new Set(specIds.map((id) => String(id).trim())));
    for (const id of uniqueIds) {
      if (!Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest(`Invalid specialization ID format: ${id}`);
      }
    }

    const objectIds = uniqueIds.map((id) => new Types.ObjectId(id));
    const count = await Specialization.countDocuments({ _id: { $in: objectIds } });
    if (count !== objectIds.length) {
      throw ApiError.badRequest('One or more selected reviewable specializations do not exist');
    }

    return objectIds;
  }

  /** Create a new admin account */
  async createAdmin(dto: CreateAdminDto): Promise<IAdminDocument> {
    const trimmedUsername = dto.username.trim().toLowerCase();

    const normalizedType = dto.type ? (String(dto.type).trim().toUpperCase() as AdminType) : AdminType.ADMIN;

    // Enforce single SUPERADMIN rule
    if (normalizedType === AdminType.SUPERADMIN) {
      const existingSuperadmin = await Admin.findOne({ type: AdminType.SUPERADMIN });
      if (existingSuperadmin) {
        throw ApiError.badRequest(
          'A SUPERADMIN account already exists. Only one SUPERADMIN is allowed.'
        );
      }
    }

    const existingUser = await Admin.findOne({ username: trimmedUsername });
    if (existingUser) {
      throw ApiError.conflict('An admin with this username already exists');
    }

    let reviewableSpecializations: Types.ObjectId[] = [];
    if (normalizedType === AdminType.EXPERT) {
      if (!dto.reviewableSpecializations || dto.reviewableSpecializations.length === 0) {
        throw ApiError.badRequest('Reviewable specializations are required for expert admins');
      }
      reviewableSpecializations = await this.validateSpecializations(dto.reviewableSpecializations);
    }

    let cleanPermissions: Types.ObjectId[] = [];
    if (normalizedType === AdminType.ADMIN && Array.isArray(dto.permissions)) {
      cleanPermissions = dto.permissions
        .filter((p) => p && Types.ObjectId.isValid(String(p).trim()))
        .map((p) => new Types.ObjectId(String(p).trim()));
    }

    const admin = new Admin({
      ...dto,
      username: trimmedUsername,
      type: normalizedType,
      permissions: cleanPermissions,
      reviewableSpecializations: normalizedType === AdminType.EXPERT ? reviewableSpecializations : [],
    });

    await admin.save();
    return Admin.findById(admin._id)
      .populate('permissions')
      .populate('reviewableSpecializations') as Promise<IAdminDocument>;
  }

  /** Retrieve all admin accounts */
  async getAdmins(): Promise<IAdminDocument[]> {
    return Admin.find()
      .populate('permissions')
      .populate('reviewableSpecializations')
      .sort({ createdAt: -1 });
  }

  /** Retrieve admin by ID */
  async getAdminById(id: string): Promise<IAdminDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid admin ID format');
    }

    const admin = await Admin.findById(id)
      .populate('permissions')
      .populate('reviewableSpecializations');
    if (!admin) {
      throw ApiError.notFound('Admin account not found');
    }

    return admin;
  }

  /** Update an existing admin account */
  async updateAdmin(id: string, dto: UpdateAdminDto): Promise<IAdminDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid admin ID format');
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      throw ApiError.notFound('Admin account not found');
    }

    // Enforce single SUPERADMIN rule on type change
    if (dto.type === AdminType.SUPERADMIN && admin.type !== AdminType.SUPERADMIN) {
      const existingSuperadmin = await Admin.findOne({
        type: AdminType.SUPERADMIN,
        _id: { $ne: id },
      });
      if (existingSuperadmin) {
        throw ApiError.badRequest(
          'A SUPERADMIN account already exists. Only one SUPERADMIN is allowed.'
        );
      }
    }

    // Check unique username if updated
    if (dto.username) {
      const trimmedUsername = dto.username.trim().toLowerCase();
      const existingUser = await Admin.findOne({
        username: trimmedUsername,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw ApiError.conflict('An admin with this username already exists');
      }
      admin.username = trimmedUsername;
    }

    if (dto.password) {
      admin.password = dto.password;
    }

    // Handle type transitions and reviewableSpecializations
    if (dto.type !== undefined) {
      if (dto.type === AdminType.EXPERT) {
        if (dto.reviewableSpecializations !== undefined) {
          admin.reviewableSpecializations = await this.validateSpecializations(
            dto.reviewableSpecializations
          );
        } else if (
          !admin.reviewableSpecializations ||
          (admin.reviewableSpecializations as any[]).length === 0
        ) {
          throw ApiError.badRequest('Reviewable specializations are required when type is EXPERT');
        }
      } else {
        // Clear specializations when changing from EXPERT to ADMIN/SUPERADMIN
        admin.reviewableSpecializations = [];
      }
      admin.type = dto.type;
    } else if (admin.type === AdminType.EXPERT && dto.reviewableSpecializations !== undefined) {
      admin.reviewableSpecializations = await this.validateSpecializations(
        dto.reviewableSpecializations
      );
    }

    if (dto.fullName !== undefined) {
      admin.fullName = dto.fullName;
    }
    if (dto.isActive !== undefined) {
      admin.isActive = dto.isActive;
    }
    if (dto.permissions !== undefined) {
      if (admin.type === AdminType.EXPERT) {
        admin.permissions = [];
      } else {
        admin.permissions = Array.isArray(dto.permissions)
          ? dto.permissions
              .filter((p) => p && Types.ObjectId.isValid(String(p).trim()))
              .map((p) => new Types.ObjectId(String(p).trim()))
          : [];
      }
    }

    await admin.save();
    return Admin.findById(id)
      .populate('permissions')
      .populate('reviewableSpecializations') as Promise<IAdminDocument>;
  }

  /** Delete an admin account */
  async deleteAdmin(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid admin ID format');
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      throw ApiError.notFound('Admin account not found');
    }

    if (admin.type === AdminType.SUPERADMIN) {
      throw ApiError.badRequest('The SUPERADMIN account cannot be deleted');
    }

    await assertNotReferenced(id, [
      { model: AcademicQualification, field: 'verifiedBy', label: 'academic qualifications' },
      { model: AcademicQualification, field: 'verificationLogs.changedBy', label: 'academic qualifications' },
      { model: MemberSkill, field: 'verifiedBy', label: 'member skills' },
      { model: MemberSkill, field: 'verificationLogs.changedBy', label: 'member skills' },
      { model: AdminLoginLog, field: 'adminId', label: 'admin login logs' },
    ]);

    await Admin.findByIdAndDelete(id);
  }

  /** Retrieve all system permissions */
  async getPermissions(): Promise<IPermissionDocument[]> {
    return Permission.find().sort({ module: 1, key: 1 });
  }

  /** Create a new permission */
  async createPermission(dto: {
    name: string;
    key: string;
    description?: string;
    module?: string;
  }): Promise<IPermissionDocument> {
    const trimmedKey = dto.key.trim().toLowerCase();
    const existing = await Permission.findOne({ key: trimmedKey });
    if (existing) {
      throw ApiError.conflict('A permission with this key already exists');
    }

    return Permission.create({
      ...dto,
      key: trimmedKey,
    });
  }

  /** Assign permissions to an admin */
  async assignPermissions(adminId: string, permissionIds: string[]): Promise<IAdminDocument> {
    if (!Types.ObjectId.isValid(adminId)) {
      throw ApiError.badRequest('Invalid admin ID format');
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw ApiError.notFound('Admin account not found');
    }

    admin.permissions = permissionIds.map((id) => new Types.ObjectId(id));
    await admin.save();

    return Admin.findById(adminId)
      .populate('permissions')
      .populate('reviewableSpecializations') as Promise<IAdminDocument>;
  }

  /** Retrieve paginated admin login logs with search and filter capabilities */
  async getLoginLogs(filters: GetLoginLogsFilter): Promise<PaginatedLoginLogs> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (filters.adminId && Types.ObjectId.isValid(filters.adminId)) {
      query.adminId = new Types.ObjectId(filters.adminId);
    }

    if (filters.username) {
      query.username = { $regex: filters.username.trim(), $options: 'i' };
    }

    if (filters.adminType) {
      query.adminType = filters.adminType.trim().toUpperCase();
    }

    if (filters.status) {
      query.status = filters.status.trim().toUpperCase();
    }

    if (filters.startDate || filters.endDate) {
      query.loginAt = {};
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (!isNaN(start.getTime())) {
          query.loginAt.$gte = start;
        }
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        if (!isNaN(end.getTime())) {
          query.loginAt.$lte = end;
        }
      }
    }

    if (filters.search) {
      const searchRegex = { $regex: filters.search.trim(), $options: 'i' };
      query.$or = [
        { username: searchRegex },
        { fullName: searchRegex },
        { ip: searchRegex },
        { device: searchRegex },
        { browser: searchRegex },
        { os: searchRegex },
      ];
    }

    const [logs, total] = await Promise.all([
      AdminLoginLog.find(query)
        .populate('adminId', 'username fullName type isActive')
        .sort({ loginAt: -1 })
        .skip(skip)
        .limit(limit),
      AdminLoginLog.countDocuments(query),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

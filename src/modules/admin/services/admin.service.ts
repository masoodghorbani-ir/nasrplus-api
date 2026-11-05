import { Types } from 'mongoose';
import { Admin } from '../models/admin.model';
import { Permission } from '../models/permission.model';
import { AdminType, IAdminDocument } from '../interfaces/admin.interface';
import { IPermissionDocument } from '../interfaces/permission.interface';
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
}

export interface UpdateAdminDto {
  username?: string;
  password?: string;
  type?: AdminType;
  fullName?: string;
  isActive?: boolean;
  permissions?: string[];
}

export class AdminService {
  /** Create a new admin account */
  async createAdmin(dto: CreateAdminDto): Promise<IAdminDocument> {
    const trimmedUsername = dto.username.trim().toLowerCase();

    // Enforce single SUPERADMIN rule
    if (dto.type === AdminType.SUPERADMIN) {
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

    const admin = new Admin({
      ...dto,
      username: trimmedUsername,
      type: dto.type || AdminType.ADMIN,
    });

    await admin.save();
    return Admin.findById(admin._id).populate('permissions') as Promise<IAdminDocument>;
  }

  /** Retrieve all admin accounts */
  async getAdmins(): Promise<IAdminDocument[]> {
    return Admin.find().populate('permissions').sort({ createdAt: -1 });
  }

  /** Retrieve admin by ID */
  async getAdminById(id: string): Promise<IAdminDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid admin ID format');
    }

    const admin = await Admin.findById(id).populate('permissions');
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
    if (dto.type) {
      admin.type = dto.type;
    }
    if (dto.fullName !== undefined) {
      admin.fullName = dto.fullName;
    }
    if (dto.isActive !== undefined) {
      admin.isActive = dto.isActive;
    }
    if (dto.permissions !== undefined) {
      admin.permissions = dto.permissions.map((p) => new Types.ObjectId(p));
    }

    await admin.save();
    return Admin.findById(id).populate('permissions') as Promise<IAdminDocument>;
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

    return Admin.findById(adminId).populate('permissions') as Promise<IAdminDocument>;
  }
}

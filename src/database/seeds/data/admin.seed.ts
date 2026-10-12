import bcrypt from 'bcryptjs';
import { Admin } from '../../../modules/admin/models/admin.model';
import { AdminType } from '../../../modules/admin/interfaces/admin.interface';
import { SeedTableConfig, SeedAdminItem } from '../types';

/** Seed data for default Superadmin account */
export const adminSeed: SeedTableConfig<SeedAdminItem> = {
  tableName: 'Admin',
  model: Admin,
  forceInsertBySeed: false,
  uniqueKey: 'username',
  data: [
    {
      username: 'superadmin@nasrplus.ir',
      password: bcrypt.hashSync('superadmin@12345678', 10),
      type: AdminType.SUPERADMIN,
      fullName: 'مدیر ارشد سامانه',
      isActive: true,
      permissions: [],
    },
  ],
};

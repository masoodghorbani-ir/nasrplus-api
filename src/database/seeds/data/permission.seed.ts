import { Permission } from '../../../modules/admin/models/permission.model';
import { SeedTableConfig, SeedPermissionItem } from '../types';

/** Seed data for system permissions */
export const permissionSeed: SeedTableConfig<SeedPermissionItem> = {
  tableName: 'Permission',
  model: Permission,
  forceInsertBySeed: false,
  uniqueKey: 'key',
  data: [
    // Members module permissions
    {
      name: 'مشاهده اعضا',
      key: 'members:read',
      module: 'members',
      description: 'دسترسی مشاهده لیست و جزییات اعضای صنف',
    },
    {
      name: 'ثبت عضو جدید',
      key: 'members:create',
      module: 'members',
      description: 'دسترسی ایجاد عضو جدید در سامانه',
    },
    {
      name: 'ویرایش اطلاعات عضو',
      key: 'members:update',
      module: 'members',
      description: 'دسترسی ویرایش اطلاعات فردی، آدرس و شماره تلفن اعضا',
    },
    {
      name: 'حذف عضو',
      key: 'members:delete',
      module: 'members',
      description: 'دسترسی حذف پرونده عضو از سامانه',
    },

    // Companies module permissions
    {
      name: 'مشاهده شرکت‌ها',
      key: 'companies:read',
      module: 'companies',
      description: 'دسترسی مشاهده لیست و مشخصات شرکت‌ها',
    },
    {
      name: 'ثبت شرکت جدید',
      key: 'companies:create',
      module: 'companies',
      description: 'دسترسی ثبت اطلاعات شرکت جدید',
    },
    {
      name: 'ویرایش اطلاعات شرکت',
      key: 'companies:update',
      module: 'companies',
      description: 'دسترسی به‌روزرسانی مشخصات شرکت‌ها',
    },
    {
      name: 'حذف شرکت',
      key: 'companies:delete',
      module: 'companies',
      description: 'دسترسی حذف اطلاعات شرکت',
    },

    // Lookups module permissions
    {
      name: 'مشاهده اطلاعات پایه',
      key: 'lookups:read',
      module: 'lookups',
      description: 'دسترسی مشاهده مقادیر جداول مرجع و پایه',
    },
    {
      name: 'مدیریت اطلاعات پایه',
      key: 'lookups:manage',
      module: 'lookups',
      description: 'دسترسی افزودن، ویرایش و حذف رکوردهای جداول مرجع',
    },

    // Admin module permissions
    {
      name: 'مدیریت مدیران',
      key: 'admins:manage',
      module: 'admins',
      description: 'دسترسی مدیریت کاربران مدیر و دسترسی‌ها',
    },
  ],
};

import { MembershipType } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedMembershipTypeItem } from '../types';

/** Seed data for MembershipType */
export const membershipTypeSeed: SeedTableConfig<SeedMembershipTypeItem> = {
  tableName: 'MembershipType',
  model: MembershipType,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'شرکت',
      code: 'COMPANY',
      description: 'عضویت حقوقی شرکت‌ها و مؤسسات',
      isActive: true,
    },
    {
      title: 'مشاور',
      code: 'CONSULTANT',
      description: 'عضویت مشاوران حقیقی و حقوقی',
      isActive: true,
    },
    {
      title: 'فروشگاه',
      code: 'STORE',
      description: 'عضویت فروشگاه‌ها و عرضه‌کنندگان سخت‌افزار و نرم‌افزار',
      isActive: true,
    },
    {
      title: 'کارشناس',
      code: 'EXPERT',
      description: 'عضویت کارشناسان تخصصی فناوری اطلاعات',
      isActive: true,
    },
    {
      title: 'آزادکار',
      code: 'FREELANCER',
      description: 'عضویت آزادکاران و فریلنسرها',
      isActive: true,
    },
  ],
};

import { AcademicField } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedAcademicFieldItem } from '../types';

/** Seed data for AcademicField */
export const academicFieldSeed: SeedTableConfig<SeedAcademicFieldItem> = {
  tableName: 'AcademicField',
  model: AcademicField,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'مهندسی کامپیوتر',
      isActive: true,
    },
    {
      title: 'علوم کامپیوتر',
      isActive: true,
    },
    {
      title: 'مهندسی فناوری اطلاعات (IT)',
      isActive: true,
    },
    {
      title: 'مهندسی نرم‌افزار',
      isActive: true,
    },
    {
      title: 'شبکه‌های کامپیوتری',
      isActive: true,
    },
    {
      title: 'رایانش امن (امنیت اطلاعات)',
      isActive: true,
    },
    {
      title: 'هوش مصنوعی و رباتیک',
      isActive: true,
    },
    {
      title: 'معماری سیستم‌های کامپیوتری',
      isActive: true,
    },
    {
      title: 'تجارت الکترونیک',
      isActive: true,
    },
  ],
};

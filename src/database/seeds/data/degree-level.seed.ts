import { DegreeLevel } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedDegreeLevelItem } from '../types';

/** Seed data for DegreeLevel */
export const degreeLevelSeed: SeedTableConfig<SeedDegreeLevelItem> = {
  tableName: 'DegreeLevel',
  model: DegreeLevel,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'دیپلم',
      description: 'مدرک دیپلم متوسطه',
      isActive: true,
    },
    {
      title: 'کاردانی (یا فوق دیپلم)',
      description: 'مقطع کاردانی / فوق دیپلم',
      isActive: true,
    },
    {
      title: 'کارشناسی (یا لیسانس)',
      description: 'مقطع کارشناسی / لیسانس',
      isActive: true,
    },
    {
      title: 'کارشناسی ارشد (یا فوق لیسانس)',
      description: 'مقطع کارشناسی ارشد / فوق لیسانس',
      isActive: true,
    },
    {
      title: 'دکترا',
      description: 'مقطع دکتری تخصصی (PhD)',
      isActive: true,
    },
    {
      title: 'سایر',
      description: 'سایر مدارک و دوره‌های مهارتی معتبر',
      isActive: true,
    },
  ],
};

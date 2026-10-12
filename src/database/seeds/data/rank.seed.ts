import { Rank } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedRankItem } from '../types';

/** Seed data for Rank */
export const rankSeed: SeedTableConfig<SeedRankItem> = {
  tableName: 'Rank',
  model: Rank,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'رتبه 3',
      level: 3,
      description: 'رتبه ۳ تخصصی نظام صنفی رایانه‌ای',
      isActive: true,
    },
    {
      title: 'رتبه 2',
      level: 2,
      description: 'رتبه ۲ تخصصی نظام صنفی رایانه‌ای',
      isActive: true,
    },
    {
      title: 'رتبه 1',
      level: 1,
      description: 'رتبه ۱ عالی نظام صنفی رایانه‌ای',
      isActive: true,
    },
    {
      title: 'بدون رتبه',
      description: 'فاقد رتبه‌بندی صنفی',
      isActive: true,
    },
  ],
};

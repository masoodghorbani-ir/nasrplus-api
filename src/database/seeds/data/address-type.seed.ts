import { AddressType } from '../../../modules/lookup/models';
import { SeedTableConfig, SeedAddressTypeItem } from '../types';

/** Seed data for AddressType */
export const addressTypeSeed: SeedTableConfig<SeedAddressTypeItem> = {
  tableName: 'AddressType',
  model: AddressType,
  forceInsertBySeed: false,
  uniqueKey: 'title',
  data: [
    {
      title: 'محل کار',
      code: 'WORK',
      description: 'نشانی محل کار یا شرکت',
      isActive: true,
    },
    {
      title: 'منزل',
      code: 'HOME',
      description: 'نشانی منزل یا محل سکونت',
      isActive: true,
    },
    {
      title: 'دفتر مرکزی',
      code: 'CENTRAL_OFFICE',
      description: 'نشانی دفتر مرکزی',
      isActive: true,
    },
    {
      title: 'شعبه',
      code: 'BRANCH',
      description: 'نشانی شعبه یا نمایندگی',
      isActive: true,
    },
    {
      title: 'سایر',
      code: 'OTHER',
      description: 'سایر نشانی‌ها',
      isActive: true,
    },
  ],
};

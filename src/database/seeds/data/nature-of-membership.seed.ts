import { NatureOfMembership } from '../../../modules/lookup/models';
import { NatureOfMembershipKey } from '../../../modules/lookup/interfaces';
import { SeedTableConfig, SeedNatureOfMembershipItem } from '../types';

/** Seed data for NatureOfMembership */
export const natureOfMembershipSeed: SeedTableConfig<SeedNatureOfMembershipItem> = {
  tableName: 'NatureOfMembership',
  model: NatureOfMembership,
  forceInsertBySeed: false,
  uniqueKey: 'key',
  data: [
    {
      title: 'حقیقی',
      key: NatureOfMembershipKey.REAL,
      description: 'عضویت اشخاص حقیقی',
      isActive: true,
    },
    {
      title: 'حقوقی',
      key: NatureOfMembershipKey.LEGAL,
      description: 'عضویت اشخاص حقوقی و شرکت‌ها',
      isActive: true,
    },
  ],
};

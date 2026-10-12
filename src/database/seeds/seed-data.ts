import { SeedDataConfiguration } from './types';
import {
  membershipTypeSeed,
  natureOfMembershipSeed,
  specializationSeed,
  rankSeed,
  degreeLevelSeed,
  academicFieldSeed,
  addressTypeSeed,
  provinceSeed,
  citySeed,
  permissionSeed,
  adminSeed,
} from './data';

/**
 * Central seed configuration.
 * Modular seed data resides in './data/' directory.
 */
export const seedDataConfig: SeedDataConfiguration = {
  // Global flag for force insert across all non-empty collections
  forceInsertBySeed: false,

  tables: {
    membershipType: membershipTypeSeed,
    natureOfMembership: natureOfMembershipSeed,
    specialization: specializationSeed,
    rank: rankSeed,
    degreeLevel: degreeLevelSeed,
    academicField: academicFieldSeed,
    addressType: addressTypeSeed,
    province: provinceSeed,
    city: citySeed,
    permission: permissionSeed,
    admin: adminSeed,
  },
};

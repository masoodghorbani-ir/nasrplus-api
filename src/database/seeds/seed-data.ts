import { SeedDataConfiguration } from './types';
import {
  membershipTypeSeed,
  specializationSeed,
  rankSeed,
  degreeLevelSeed,
  academicFieldSeed,
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
    specialization: specializationSeed,
    rank: rankSeed,
    degreeLevel: degreeLevelSeed,
    academicField: academicFieldSeed,
  },
};

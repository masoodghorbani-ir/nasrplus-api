import { Model } from 'mongoose';
import { IMembershipType } from '../../modules/lookup/interfaces/membership-type.interface';
import { ISpecialization } from '../../modules/lookup/interfaces/specialization.interface';
import { IRank } from '../../modules/lookup/interfaces/rank.interface';
import { IDegreeLevel } from '../../modules/lookup/interfaces/degree-level.interface';
import { IAcademicField } from '../../modules/lookup/interfaces/academic-field.interface';

export interface SeedItemMeta {
  /** Force insert this single item if table is not empty */
  forceInsertBySeed?: boolean;
}

export type SeedMembershipTypeItem = Partial<IMembershipType> & SeedItemMeta;
export type SeedSpecializationItem = Partial<ISpecialization> & SeedItemMeta;
export type SeedRankItem = Partial<IRank> & SeedItemMeta;
export type SeedDegreeLevelItem = Partial<IDegreeLevel> & SeedItemMeta;
export type SeedAcademicFieldItem = Partial<IAcademicField> & SeedItemMeta;

export interface SeedTableConfig<T = any> {
  tableName: string;
  model: Model<any>;
  /** If false, table is skipped when not empty */
  forceInsertBySeed: boolean;
  /** Unique key for duplicate prevention (default: 'title') */
  uniqueKey?: string;
  data: T[];
}

export interface SeedDataConfiguration {
  /** Global override for forceInsertBySeed across all tables */
  forceInsertBySeed: boolean;
  tables: {
    membershipType: SeedTableConfig<SeedMembershipTypeItem>;
    specialization: SeedTableConfig<SeedSpecializationItem>;
    rank: SeedTableConfig<SeedRankItem>;
    degreeLevel: SeedTableConfig<SeedDegreeLevelItem>;
    academicField: SeedTableConfig<SeedAcademicFieldItem>;
    [key: string]: SeedTableConfig<any>;
  };
}

export interface SeederOptions {
  /** Override file-level forceInsertBySeed */
  forceInsertBySeed?: boolean;
  /** Suppress console logs */
  silent?: boolean;
}

export interface TableSeedResult {
  tableName: string;
  totalInConfig: number;
  existingCount: number;
  insertedCount: number;
  skipped: boolean;
  status: 'INITIAL_SEEDED' | 'FORCED_ADDED' | 'SKIPPED' | 'ALREADY_EXISTS';
  message: string;
}

export interface SeedExecutionSummary {
  success: boolean;
  results: TableSeedResult[];
  error?: Error;
}

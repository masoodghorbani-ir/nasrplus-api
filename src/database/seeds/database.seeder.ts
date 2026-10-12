import { seedDataConfig } from './seed-data';
import {
  SeedTableConfig,
  SeederOptions,
  TableSeedResult,
  SeedExecutionSummary,
} from './types';

/** Strip internal seed metadata from document data */
const cleanItemData = (item: any): Record<string, any> => {
  const { forceInsertBySeed, ...rest } = item;
  return rest;
};

/** Seed a single collection based on seed rules */
const seedSingleTable = async (
  tableConfig: SeedTableConfig,
  globalForceOption?: boolean,
  silent: boolean = false
): Promise<TableSeedResult> => {
  const { tableName, model, uniqueKey = 'title', data } = tableConfig;
  const log = (msg: string) => {
    if (!silent) console.log(msg);
  };

  const existingCount = await model.countDocuments();

  // Rule 1: If collection is completely empty, insert all seed items
  if (existingCount === 0) {
    const cleanedData = data.map(cleanItemData);
    await model.insertMany(cleanedData);

    const message = `Collection ${tableName} was empty. Inserted ${cleanedData.length} records.`;
    log(`  [${tableName}] 🟢 ${message}`);

    return {
      tableName,
      totalInConfig: data.length,
      existingCount: 0,
      insertedCount: cleanedData.length,
      skipped: false,
      status: 'INITIAL_SEEDED',
      message,
    };
  }

  // Rule 2: If collection has data, only insert when forceInsertBySeed is true
  const isForced =
    globalForceOption ??
    tableConfig.forceInsertBySeed ??
    seedDataConfig.forceInsertBySeed ??
    false;

  // Check items flagged individually with forceInsertBySeed: true
  const candidateItems = isForced
    ? data
    : data.filter((item: any) => item.forceInsertBySeed === true);

  if (candidateItems.length === 0) {
    const message = `Collection ${tableName} is not empty (${existingCount} items). Skipped (forceInsertBySeed: false).`;
    log(`  [${tableName}] ⏭️  ${message}`);

    return {
      tableName,
      totalInConfig: data.length,
      existingCount,
      insertedCount: 0,
      skipped: true,
      status: 'SKIPPED',
      message,
    };
  }

  // Filter out existing documents by uniqueKey
  const candidateKeys = candidateItems
    .map((item: any) => item[uniqueKey])
    .filter((val: any) => val !== undefined && val !== null);

  const existingMatches = await model
    .find({ [uniqueKey]: { $in: candidateKeys } }, { [uniqueKey]: 1 })
    .lean();

  const existingSet = new Set(
    existingMatches.map((doc: any) => String(doc[uniqueKey]))
  );

  const itemsToInsert = candidateItems
    .filter((item: any) => !existingSet.has(String(item[uniqueKey])))
    .map(cleanItemData);

  if (itemsToInsert.length === 0) {
    const message = `Collection ${tableName} already contains all seed records. Nothing added.`;
    log(`  [${tableName}] ℹ️  ${message}`);

    return {
      tableName,
      totalInConfig: data.length,
      existingCount,
      insertedCount: 0,
      skipped: false,
      status: 'ALREADY_EXISTS',
      message,
    };
  }

  await model.insertMany(itemsToInsert);

  const message = `Added ${itemsToInsert.length} new records to ${tableName} (forceInsertBySeed: true).`;
  log(`  [${tableName}] ➕ ${message}`);

  return {
    tableName,
    totalInConfig: data.length,
    existingCount,
    insertedCount: itemsToInsert.length,
    skipped: false,
    status: 'FORCED_ADDED',
    message,
  };
};

/** Run initial seed across all configured collections */
export const seedDatabase = async (
  options?: SeederOptions
): Promise<SeedExecutionSummary> => {
  const silent = options?.silent ?? false;
  const log = (msg: string) => {
    if (!silent) console.log(msg);
  };

  log('\n🌱 ========================================================');
  log('🌱 Starting database seeding process...');
  log('🌱 ========================================================');

  const results: TableSeedResult[] = [];
  const tableConfigs = Object.values(seedDataConfig.tables);

  try {
    for (const tableConfig of tableConfigs) {
      const result = await seedSingleTable(
        tableConfig,
        options?.forceInsertBySeed,
        silent
      );
      results.push(result);
    }

    log('🌱 ========================================================');
    log('✅ Database seeding finished successfully.');
    log('🌱 ========================================================\n');

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return {
      success: false,
      results,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

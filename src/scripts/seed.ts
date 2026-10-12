import { connectDatabase, disconnectDatabase } from '../config/database';
import { seedDatabase } from '../database/seeds';

const runSeedScript = async () => {
  try {
    await connectDatabase();

    // Support --force CLI flag to force insert into non-empty tables
    const isForce = process.argv.includes('--force');
    if (isForce) {
      console.log('⚡ Flag --force detected. Seed will insert into non-empty collections.');
    }

    const result = await seedDatabase({
      forceInsertBySeed: isForce ? true : undefined,
    });

    if (!result.success) {
      throw result.error || new Error('Database seeding completed with errors.');
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to run seed script:', error);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
};

void runSeedScript();

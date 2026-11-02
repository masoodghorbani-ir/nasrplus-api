import app from './app';
import { envConfig } from './config/env.config';
import { connectDatabase, disconnectDatabase } from './config/database';
import { seedDatabase } from './database/seeds';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB database
    await connectDatabase();

    // Execute initial seed for default lookup tables
    await seedDatabase();

    // تعیین انعطاف‌پذیر پورت (پشتیبانی از پورت عددی و Pipeهای ویندوز/iisnode)
    const port = process.env.PORT || envConfig.port || 3000;

    const server = app.listen(port as any, () => {
      console.log(`🚀 NasrPlus API server is running on port ${port} in ${envConfig.nodeEnv} mode`);
    });

    // Handle graceful shutdown signals
    const gracefulShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDatabase();
        console.log('Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
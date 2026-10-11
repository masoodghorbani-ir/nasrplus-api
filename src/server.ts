import app from './app';
import { envConfig } from './config/env.config';
import { connectDatabase, disconnectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    // اتصال به پایگاه داده MongoDB
    await connectDatabase();

    const server = app.listen(envConfig.port, () => {
      console.log(`🚀 NasrPlus API server is running on port ${envConfig.port} in ${envConfig.nodeEnv} mode`);
    });

    // مدیریت خروج تمیز (Graceful Shutdown)
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

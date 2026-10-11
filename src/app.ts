import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/env.config';
import { notFoundHandler } from './common/middlewares/not-found.middleware';
import { errorHandler } from './common/middlewares/error.middleware';
import { memberRoutes } from './modules/members/routes/member.routes';

const app: Application = express();

// Middlewares امنیتی و عمومی
app.use(helmet());
app.use(cors({ origin: envConfig.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!envConfig.isProduction) {
  app.use(morgan('dev'));
}

// مسیر بررسی سلامت سرویس (Health Check)
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NasrPlus Members Management API',
    timestamp: new Date().toISOString(),
  });
});

// مسیرهای ماژول‌ها
app.use('/api/v1/members', memberRoutes);

// مدیریت خطاهای ۴۰۴ و سراسری
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

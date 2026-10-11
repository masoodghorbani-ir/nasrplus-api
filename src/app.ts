import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from './config/env.config';
import { swaggerDocument } from './config/swagger.config';
import { notFoundHandler } from './common/middlewares/not-found.middleware';
import { errorHandler } from './common/middlewares/error.middleware';
import { memberRoutes } from './modules/members/routes/member.routes';

const app: Application = express();

// Middlewares امنیتی و عمومی
// برای سازگاری کامل Swagger UI استایل‌ها و اسکریپت‌های اینلاین، CSP غیرفعال یا تنظیم می‌شود
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors({ origin: envConfig.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!envConfig.isProduction) {
  app.use(morgan('dev'));
}

// مستندات تعاملی Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs', (_req, res) => res.redirect('/api-docs'));

// مسیر بررسی سلامت سرویس (Health Check)
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NasrPlus Members Management API',
    swaggerDocs: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

// مسیرهای ماژول‌ها
app.use('/api/v1/members', memberRoutes);

// مدیریت خطاهای ۴۰۴ و سراسری
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

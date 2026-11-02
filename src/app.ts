import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from './config/env.config';
import { swaggerDocument } from './config/swagger.config';
import { notFoundHandler } from './common/middlewares/not-found.middleware';
import { errorHandler } from './common/middlewares/error.middleware';
import { memberRoutes } from './modules/members/routes/member.routes';
import { lookupRoutes } from './modules/lookup/routes/lookup.routes';
import { companyRoutes } from './modules/company/routes/company.routes';
import { authRoutes } from './modules/admin/routes/auth.routes';
import { adminRoutes } from './modules/admin/routes/admin.routes';

const app: Application = express();

// Security and utility middlewares
// Content-Security-Policy is disabled to allow inline Swagger UI styles and assets
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors({ origin: envConfig.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

if (!envConfig.isProduction) {
  app.use(morgan('dev'));
}

// Swagger UI interactive documentation endpoints
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs', (_req, res) => res.redirect('/api-docs'));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NasrPlus Members Management API',
    swaggerDocs: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

// Resource module routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/lookups', lookupRoutes);
app.use('/api/v1/companies', companyRoutes);

// Global 404 and error-handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

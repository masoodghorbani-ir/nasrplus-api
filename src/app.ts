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

// Security and utility middlewares
// Content-Security-Policy is disabled to allow inline Swagger UI styles and assets
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

// Swagger UI interactive documentation endpoints
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs', (_req, res) => res.redirect('/api-docs'));

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
app.use('/api/v1/members', memberRoutes);

// Global 404 and error-handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

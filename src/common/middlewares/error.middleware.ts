import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { envConfig } from '../../config/env.config';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'An unexpected internal server error occurred';
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Mongoose Validation Error
    statusCode = 400;
    const mongooseErrors = (err as any).errors;
    if (mongooseErrors && typeof mongooseErrors === 'object') {
      const messages = Object.values(mongooseErrors)
        .map((e: any) => e.message || e.reason?.message || String(e))
        .filter(Boolean);
      message = messages.length > 0 ? messages.join(' | ') : 'Validation Error: Invalid input parameters';
    } else {
      message = (err as Error).message || 'Validation Error: Invalid input parameters';
    }
    details = err;
  } else if (err.name === 'CastError') {
    // Mongoose Cast Error (Invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID format provided';
  } else if ((err as { code?: number }).code === 11000) {
    // MongoDB Duplicate Key Error
    statusCode = 409;
    message = 'Duplicate key error: Record with this unique value already exists';
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(envConfig.isProduction ? {} : { stack: err.stack }),
  });
};

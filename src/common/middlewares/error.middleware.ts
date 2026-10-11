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
  let message = 'خطای داخلی سرور رخ داده است';
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Mongoose Validation Error
    statusCode = 400;
    message = 'اطلاعات ارسالی نامعتبر است';
    details = err;
  } else if (err.name === 'CastError') {
    // Mongoose Cast Error (Invalid ObjectId)
    statusCode = 400;
    message = 'فرمت شناسه نامعتبر است';
  } else if ((err as { code?: number }).code === 11000) {
    // MongoDB Duplicate Key Error
    statusCode = 409;
    message = 'اطلاعات تکراری است و قبلاً ثبت شده است';
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(envConfig.isProduction ? {} : { stack: err.stack }),
  });
};

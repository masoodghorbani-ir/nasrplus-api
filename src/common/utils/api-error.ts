export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'درخواست نامعتبر است', details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'عدم احراز هویت'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'عدم دسترسی لازم'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'مورد درخواستی یافت نشد'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message = 'تعارض در اطلاعات ارسالی'): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'خطای داخلی سرور'): ApiError {
    return new ApiError(500, message, undefined, false);
  }
}

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

  static badRequest(message = 'Invalid request parameters', details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Access forbidden: Insufficient permissions'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Requested resource not found'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict with existing data'): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, undefined, false);
  }
}

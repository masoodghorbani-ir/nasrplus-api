export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(data?: T, message = 'Operation completed successfully', meta?: Record<string, unknown>): ApiResponsePayload<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static created<T>(data?: T, message = 'Resource created successfully'): ApiResponsePayload<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'An error occurred during request processing', data?: unknown): ApiResponsePayload {
    return {
      success: false,
      message,
      data,
    };
  }
}

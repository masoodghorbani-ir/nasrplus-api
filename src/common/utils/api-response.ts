export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(data?: T, message = 'عملیات با موفقیت انجام شد', meta?: Record<string, unknown>): ApiResponsePayload<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static created<T>(data?: T, message = 'رکورد با موفقیت ایجاد شد'): ApiResponsePayload<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'خطایی رخ داد', data?: unknown): ApiResponsePayload {
    return {
      success: false,
      message,
      data,
    };
  }
}

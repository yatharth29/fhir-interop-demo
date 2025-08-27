import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  void _next; // satisfy noUnusedParameters
  // Try to unwrap Axios-like errors
  const anyErr: any = error as any;
  const upstreamStatus = anyErr?.response?.status as number | undefined;
  const upstreamData = anyErr?.response?.data;
  const statusCode = upstreamStatus || error.statusCode || 500;
  const message = (anyErr?.response?.statusText as string) || error.message || 'Internal Server Error';

  // Log the error
  console.error(`❌ Error ${statusCode}: ${message}`);
  console.error(`📍 ${req.method} ${req.path}`);
  console.error(`🏥 Hospital: ${req.headers['x-hospital-id'] || 'Unknown'}`);
  console.error(`📝 Stack: ${error.stack}`);
  if (upstreamData) {
    console.error(`↩️ Upstream response:`, JSON.stringify(upstreamData));
  }

  // Don't leak error details in production
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  
  res.status(statusCode).json({
    error: {
      message: isDevelopment ? message : 'Internal Server Error',
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      upstream: isDevelopment ? upstreamData : undefined,
      ...(isDevelopment && { stack: error.stack })
    }
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFoundError = (resource: string): AppError => {
  return createError(`${resource} not found`, 404);
};

export const validationError = (message: string): AppError => {
  return createError(message, 400);
};

export const unauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return createError(message, 401);
};

export const forbiddenError = (message: string = 'Forbidden'): AppError => {
  return createError(message, 403);
}; 
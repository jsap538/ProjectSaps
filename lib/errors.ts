import { NextResponse } from 'next/server';
import { corsHeaders } from './security';

/**
 * Centralized error handling for API routes
 * Provides consistent error responses and logging
 */

export enum ErrorCode {
  // Client errors (4xx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  CONFLICT = 'CONFLICT',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Common API errors for quick use
 */
export const ApiErrors = {
  unauthorized: (message = 'Unauthorized') => 
    new ApiError(ErrorCode.UNAUTHORIZED, message, 401),
  
  forbidden: (message = 'Access forbidden') => 
    new ApiError(ErrorCode.FORBIDDEN, message, 403),
  
  notFound: (resource = 'Resource', message?: string) => 
    new ApiError(ErrorCode.NOT_FOUND, message || `${resource} not found`, 404),
  
  badRequest: (message = 'Bad request', details?: unknown) => 
    new ApiError(ErrorCode.BAD_REQUEST, message, 400, details),
  
  validation: (message = 'Validation failed', details?: unknown) => 
    new ApiError(ErrorCode.VALIDATION_ERROR, message, 400, details),
  
  conflict: (message = 'Resource conflict') => 
    new ApiError(ErrorCode.CONFLICT, message, 409),
  
  rateLimit: (message = 'Too many requests') => 
    new ApiError(ErrorCode.RATE_LIMIT, message, 429),
  
  internal: (message = 'Internal server error') => 
    new ApiError(ErrorCode.INTERNAL_ERROR, message, 500),
  
  database: (message = 'Database operation failed') => 
    new ApiError(ErrorCode.DATABASE_ERROR, message, 500),
  
  externalService: (service: string, message?: string) => 
    new ApiError(
      ErrorCode.EXTERNAL_SERVICE_ERROR, 
      message || `${service} service unavailable`, 
      503
    ),
};

/**
 * Handle errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Handle known ApiError instances
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
      { 
        status: error.statusCode,
        headers: corsHeaders,
      }
    );
  }
  
  // Handle Mongoose validation errors
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: error,
      },
      { 
        status: 400,
        headers: corsHeaders,
      }
    );
  }
  
  // Handle Mongoose cast errors (invalid ObjectId)
  if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
    return NextResponse.json(
      {
        success: false,
        error: ErrorCode.BAD_REQUEST,
        message: 'Invalid ID format',
      },
      { 
        status: 400,
        headers: corsHeaders,
      }
    );
  }
  
  // Handle unknown errors
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  // Don't expose internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      success: false,
      error: ErrorCode.INTERNAL_ERROR,
      message: isProduction ? 'Internal server error' : message,
      ...((!isProduction && error) && { details: error }),
    },
    { 
      status: 500,
      headers: corsHeaders,
    }
  );
}

/**
 * Async wrapper for API route handlers with automatic error handling
 * 
 * Usage:
 * export const GET = withErrorHandling(async (request) => {
 *   // Your handler code
 *   // Throw ApiErrors for known error cases
 *   // Let unknown errors bubble up for automatic handling
 * });
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { 
      status,
      headers: corsHeaders,
    }
  );
}


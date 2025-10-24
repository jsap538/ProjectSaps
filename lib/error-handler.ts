import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { trackError } from './monitoring';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export function withErrorHandling(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      // Log error to Sentry
      trackError(error as Error, {
        url: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
      });

      // Handle different error types
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code,
          },
          { status: error.statusCode }
        );
      }

      // Handle validation errors
      if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.message,
          },
          { status: 400 }
        );
      }

      // Handle database errors
      if (error instanceof Error && error.name === 'MongoError') {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error occurred',
          },
          { status: 500 }
        );
      }

      // Handle unknown errors
      console.error('Unhandled API error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}

// Common error types
export const Errors = {
  UNAUTHORIZED: new AppError('Unauthorized', 401, 'UNAUTHORIZED'),
  FORBIDDEN: new AppError('Forbidden', 403, 'FORBIDDEN'),
  NOT_FOUND: new AppError('Not found', 404, 'NOT_FOUND'),
  VALIDATION_ERROR: new AppError('Validation failed', 400, 'VALIDATION_ERROR'),
  RATE_LIMITED: new AppError('Too many requests', 429, 'RATE_LIMITED'),
  PAYMENT_FAILED: new AppError('Payment failed', 402, 'PAYMENT_FAILED'),
  ITEM_NOT_AVAILABLE: new AppError('Item not available', 409, 'ITEM_NOT_AVAILABLE'),
  INSUFFICIENT_STOCK: new AppError('Insufficient stock', 409, 'INSUFFICIENT_STOCK'),
};


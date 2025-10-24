"use client";

import { useState, ReactNode, useEffect } from 'react';
import LoadingError from './LoadingError';

interface AsyncWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  context?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function AsyncWrapper({ 
  children, 
  fallback, 
  onError,
  context = "Loading content",
  isLoading = false,
  error = null,
  onRetry
}: AsyncWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Handle external error state
  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasError(false);
      onRetry?.();
    } finally {
      setIsRetrying(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-titanium border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-porcelain">Loading...</span>
      </div>
    );
  }

  // Show error state
  if (hasError || error) {
    return (
      <LoadingError
        onRetry={handleRetry}
        context={context}
        isRetrying={isRetrying}
      />
    );
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show children
  return <>{children}</>;
}

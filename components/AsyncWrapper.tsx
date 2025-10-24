"use client";

import { useState, ReactNode } from 'react';
import LoadingError from './LoadingError';

interface AsyncWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  context?: string;
}

export default function AsyncWrapper({ 
  children, 
  fallback, 
  onError,
  context = "Loading content"
}: AsyncWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasError(false);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleError = (error: Error) => {
    setHasError(true);
    onError?.(error);
  };

  // Reset error state when children change
  if (hasError && !isRetrying) {
    return (
      <LoadingError
        onRetry={handleRetry}
        context={context}
        isRetrying={isRetrying}
      />
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div onError={handleError}>
      {children}
    </div>
  );
}

"use client";

import { useState } from 'react';

interface LoadingErrorProps {
  onRetry: () => void;
  context?: string;
  isRetrying?: boolean;
}

export default function LoadingError({ 
  onRetry, 
  context = "Failed to load",
  isRetrying = false 
}: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-porcelain mb-2">
        {context}
      </h3>
      
      <p className="text-nickel mb-4 text-sm">
        Something went wrong while loading this content.
      </p>
      
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="rounded-xl bg-titanium text-ink px-4 py-2 text-sm font-medium transition-colors duration-sap hover:bg-titanium/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRetrying ? (
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-ink border-t-transparent rounded-full animate-spin mr-2"></div>
            Retrying...
          </div>
        ) : (
          'Try again'
        )}
      </button>
    </div>
  );
}

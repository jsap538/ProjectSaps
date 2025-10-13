"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
}

/**
 * Optimized Image Component with automatic fallback and loading states
 * 
 * Features:
 * - Automatic WebP/AVIF conversion
 * - Responsive sizing
 * - Blur placeholder
 * - Error handling with fallback
 * - Loading state management
 * - Optimized for Core Web Vitals
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  quality = 85,
  onLoad,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // Fallback to placeholder
    setImgSrc('https://placehold.co/600x750/0B0C0E/F5F6F7?text=Image+Not+Available');
  };

  // Blur data URL for better perceived performance
  const blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8dPjwfwAHggKqQy8YmgAAAABJRU5ErkJggg==";

  const imageProps = {
    src: imgSrc,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    placeholder: "blur" as const,
    blurDataURL,
    ...(priority ? { priority: true } : { loading: "lazy" as const }),
    ...(sizes && { sizes }),
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
          style={{ objectFit: 'cover' }}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-graphite/60 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-graphite/60 animate-pulse" />
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-graphite/80 text-nickel text-xs">
          Image unavailable
        </div>
      )}
    </div>
  );
}


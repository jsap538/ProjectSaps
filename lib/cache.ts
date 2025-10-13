import { Buffer } from 'buffer';

/**
 * High-performance cache utility optimized for large data structures
 * Uses Buffer-based serialization to avoid webpack cache performance issues
 */
export class OptimizedCache {
  private static instance: OptimizedCache;
  private cache = new Map<string, Buffer>();

  private constructor() {}

  static getInstance(): OptimizedCache {
    if (!OptimizedCache.instance) {
      OptimizedCache.instance = new OptimizedCache();
    }
    return OptimizedCache.instance;
  }

  /**
   * Store data using Buffer serialization for optimal performance
   */
  set<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      const buffer = Buffer.from(serialized, 'utf8');
      this.cache.set(key, buffer);
    } catch (error) {
      console.warn(`Cache set failed for key ${key}:`, error);
    }
  }

  /**
   * Retrieve data from Buffer-based cache
   */
  get<T>(key: string): T | null {
    try {
      const buffer = this.cache.get(key);
      if (!buffer) return null;
      
      const serialized = buffer.toString('utf8');
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.warn(`Cache get failed for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; memoryUsage: number } {
    let totalMemory = 0;
    this.cache.forEach(buffer => {
      totalMemory += buffer.length;
    });

    return {
      size: this.cache.size,
      memoryUsage: totalMemory,
    };
  }
}

/**
 * Optimized API response cache for large datasets
 */
export class ApiCache {
  private cache = OptimizedCache.getInstance();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Cache API response with TTL
   */
  async set<T>(key: string, data: T): Promise<void> {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: this.TTL,
    };
    this.cache.set(key, cacheEntry);
  }

  /**
   * Get cached API response
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get<{ data: T; timestamp: number; ttl: number }>(key);
    
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Generate cache key for API requests
   */
  generateKey(endpoint: string, params?: Record<string, any>): string {
    const sortedParams = params ? Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&') : '';
    
    return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  /**
   * Clear cache for specific endpoint
   */
  clearEndpoint(_endpoint: string): void {
    // This is a simplified implementation
    // In production, you'd want to use a more sophisticated key matching
    this.cache.clear();
  }
}

/**
 * Singleton instance for global use
 */
export const apiCache = new ApiCache();

/**
 * Utility function to debounce cache operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Memory-efficient data transformer for large objects
 */
export class DataTransformer {
  /**
   * Transform large object to minimal representation
   */
  static minimize<T extends Record<string, any>>(data: T): Partial<T> {
    const minimal: Partial<T> = {};
    
    // Only include essential fields
    const essentialFields = ['_id', 'id', 'title', 'name', 'email', 'price_cents', 'images'];
    
    for (const key of essentialFields) {
      if (key in data && data[key] !== undefined) {
        (minimal as any)[key] = (data as any)[key];
      }
    }
    
    return minimal;
  }

  /**
   * Batch process large arrays efficiently
   */
  static batchProcess<T, R>(
    items: T[],
    processor: (item: T) => R,
    batchSize: number = 100
  ): R[] {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = batch.map(processor);
      results.push(...batchResults);
      
      // Yield control to prevent blocking
      if (i + batchSize < items.length) {
        // In a real implementation, you might want to use setImmediate or similar
        continue;
      }
    }
    
    return results;
  }
}

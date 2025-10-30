/**
 * @file Memory management utilities for optimizing performance.
 */

interface MemoryPool<T> {
  pool: T[];
  create: () => T;
  reset: (item: T) => void;
  get: () => T;
  release: (item: T) => void;
  clear: () => void;
}

/**
 * Creates a memory pool for reusing objects to reduce garbage collection.
 */
export function createMemoryPool<T>(
  create: () => T,
  reset: (item: T) => void,
  initialSize: number = 10
): MemoryPool<T> {
  const pool: T[] = [];
  
  // Pre-populate the pool
  for (let i = 0; i < initialSize; i++) {
    pool.push(create());
  }

  return {
    pool,
    create,
    reset,
    get: () => {
      if (pool.length > 0) {
        return pool.pop()!;
      }
      return create();
    },
    release: (item: T) => {
      reset(item);
      pool.push(item);
    },
    clear: () => {
      pool.length = 0;
    },
  };
}

/**
 * Debounce function to limit the rate of function calls.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit the rate of function calls.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Cleanup utility for event listeners and subscriptions.
 */
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = [];

  add(cleanup: () => void): void {
    this.cleanupFunctions.push(cleanup);
  }

  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }
}

/**
 * Memory usage monitoring utility.
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  limit: number;
} | null {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * Check if memory usage is high.
 */
export function isMemoryUsageHigh(threshold: number = 0.8): boolean {
  const memory = getMemoryUsage();
  if (!memory) return false;
  
  return memory.used / memory.limit > threshold;
}

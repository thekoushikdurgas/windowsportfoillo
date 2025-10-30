/**
 * @file Performance monitoring hook for tracking component performance.
 */
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  timestamp: number;
}

interface UsePerformanceOptions {
  componentName: string;
  logMetrics?: boolean;
  threshold?: number; // ms
}

/**
 * Hook for monitoring component performance.
 * Tracks render times and memory usage.
 */
export const usePerformance = (options: UsePerformanceOptions) => {
  const { componentName, logMetrics = false, threshold = 16 } = options;
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  const logPerformance = useCallback((metrics: PerformanceMetrics) => {
    if (logMetrics) {
      console.log(`[Performance] ${componentName}:`, metrics);
    }

    // Log warnings for slow renders
    if (metrics.renderTime > threshold) {
      console.warn(
        `[Performance Warning] ${componentName} render took ${metrics.renderTime}ms (threshold: ${threshold}ms)`
      );
    }
  }, [componentName, logMetrics, threshold]);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;

      const metrics: PerformanceMetrics = {
        renderTime,
        memoryUsage,
        componentName,
        timestamp: Date.now(),
      };

      logPerformance(metrics);
    };
  });

  return {
    renderCount: renderCount.current,
    logPerformance,
  };
};

/**
 * Hook for measuring async operations performance.
 */
export const useAsyncPerformance = (operationName: string) => {
  const startTime = useRef<number>(0);

  const startMeasurement = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endMeasurement = useCallback(() => {
    const duration = performance.now() - startTime.current;
    console.log(`[Async Performance] ${operationName}: ${duration.toFixed(2)}ms`);
    return duration;
  }, [operationName]);

  return { startMeasurement, endMeasurement };
};

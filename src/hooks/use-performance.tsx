'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { performanceMonitor } from '@/lib/performance-monitor';
import { PerformanceReport, PerformanceMetrics } from '@/types/performance';
import { logger } from '../lib/logger';

interface PerformanceOptions {
  enabled?: boolean;
  threshold?: number; // Log only if render time exceeds threshold
  logToConsole?: boolean;
  onMetric?: (metric: PerformanceMetrics) => void;
}

export function usePerformance(
  componentName: string,
  options: PerformanceOptions = {}
) {
  const {
    enabled = process.env['NODE_ENV'] === 'development',
    threshold = 16, // 16ms = 60fps
    logToConsole = true,
    onMetric
  } = options;

  const renderStartTime = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [reports, setReports] = useState<PerformanceReport[]>([]);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;
    
    // Record performance metrics
    performanceMonitor.recordComponentRender(componentName, renderTime);
    
    if (renderTime > threshold) {
      const metric: PerformanceMetrics = {
        renderTime,
        memoryUsage: (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0,
        componentCount: 1,
        reRenderCount: 1,
        lastRenderTime: new Date(),
      };

      setMetrics(prev => [...prev.slice(-9), metric]); // Keep last 10 metrics

      if (logToConsole) {
        logger.warn('Slow render detected', {
          component: componentName,
          renderTime: `${renderTime.toFixed(2)}ms`,
          memoryUsage: metric.memoryUsage ? `${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
          threshold: `${threshold}ms`,
          timestamp: new Date().toISOString()
        });
      }

      onMetric?.(metric);
    }
  }, [enabled, componentName, threshold, logToConsole, onMetric]);

  // Subscribe to performance reports
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = performanceMonitor.subscribe((report) => {
      if (report.componentName === componentName) {
        setReports(prev => [...prev, report]);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [componentName, enabled]);

  const getPerformanceReport = useCallback(() => {
    return performanceMonitor.getReport(componentName);
  }, [componentName]);

  const clearMetrics = useCallback(() => {
    performanceMonitor.resetMetrics();
    setMetrics([]);
    setReports([]);
  }, []);

  return {
    metrics,
    reports,
    clearMetrics,
    getPerformanceReport,
    isSlowRender: metrics.length > 0 && (metrics[metrics.length - 1]?.renderTime ?? 0) > threshold
  };
}

// Hook for measuring specific operations
export function usePerformanceTimer(operationName: string) {
  const startTime = useRef<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const start = () => {
    startTime.current = performance.now();
  };

  const end = () => {
    const endTime = performance.now();
    const operationDuration = endTime - startTime.current;
    setDuration(operationDuration);
    
    // Record operation performance
    performanceMonitor.recordComponentRender(operationName, operationDuration);
    
    if (process.env['NODE_ENV'] === 'development') {
      logger.debug('Performance timer completed', {
        operation: operationName,
        duration: `${operationDuration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
    }
    
    return operationDuration;
  };

  return { start, end, duration };
}

// Hook for monitoring memory usage
export function useMemoryMonitor(intervalMs = 5000) {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(performance as unknown as { memory?: unknown }).memory) return;

    const updateMemoryInfo = () => {
      const memory = (performance as unknown as { memory?: { usedJSHeapSize?: number; totalJSHeapSize?: number; jsHeapSizeLimit?: number } }).memory;
      if (memory) {
        const used = memory.usedJSHeapSize || 0;
        const total = memory.totalJSHeapSize || 0;
        const limit = memory.jsHeapSizeLimit || 0;
        
        setMemoryInfo({
          used,
          total,
          limit
        });
      }

      // Record memory usage in performance monitor
      if (memory) {
        performanceMonitor.recordMemoryUsage('global', memory.usedJSHeapSize || 0);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return memoryInfo;
}



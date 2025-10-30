'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceMetrics {
  memory: number;
  cpu: number;
  loadTime: number;
  renderTime: number;
}

interface PerformanceMonitorOptions {
  updateInterval?: number;
  enableMemoryMonitoring?: boolean;
  enableCPUMonitoring?: boolean;
}

export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const {
    updateInterval = 5000,
    enableMemoryMonitoring = true,
    enableCPUMonitoring = true
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: 0,
    cpu: 0,
    loadTime: 0,
    renderTime: 0
  });

  const [isSupported, setIsSupported] = useState(false);

  // Check if performance monitoring is supported
  useEffect(() => {
    const supported = 
      typeof window !== 'undefined' && 
      'performance' in window &&
      'memory' in ((performance as unknown) as PerformanceMemory);
    
    setIsSupported(supported);
  }, []);

  // Get memory usage
  const getMemoryUsage = useCallback((): number => {
    if (!isSupported || !enableMemoryMonitoring) return 0;
    
    const performanceMemory = performance as unknown as PerformanceMemory;
    if (!performanceMemory || !('usedJSHeapSize' in performanceMemory)) return 0;
    
    const used = performanceMemory.usedJSHeapSize;
    const total = performanceMemory.totalJSHeapSize;
    
    return total > 0 ? Math.round((used / total) * 100) : 0;
  }, [isSupported, enableMemoryMonitoring]);

  // Get CPU usage (simplified estimation)
  const getCPUUsage = useCallback((): number => {
    if (!enableCPUMonitoring) return 0;
    
    // This is a simplified CPU estimation
    // In a real implementation, you might use Web Workers or other techniques
    const start = performance.now();
    
    // Simulate some work to measure CPU usage
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Convert duration to a percentage (this is very simplified)
    return Math.min(Math.round(duration / 10), 100);
  }, [enableCPUMonitoring]);

  // Measure component load time
  const measureLoadTime = useCallback((componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const loadTime = end - start;
      
      logger.debug(`${componentName} loaded in ${loadTime.toFixed(2)}ms`, { componentName, loadTime });
      
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      }));
    };
  }, []);

  // Measure render time
  const measureRenderTime = useCallback((componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const renderTime = end - start;
      
      logger.debug(`${componentName} rendered in ${renderTime.toFixed(2)}ms`, { componentName, renderTime });
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime)
      }));
    };
  }, []);

  // Update metrics periodically
  useEffect(() => {
    if (!isSupported) return;

    const updateMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        memory: getMemoryUsage(),
        cpu: getCPUUsage()
      }));
    };

    // Initial update
    updateMetrics();

    // Set up interval
    const interval = setInterval(updateMetrics, updateInterval);

    return () => clearInterval(interval);
  }, [isSupported, updateInterval, getMemoryUsage, getCPUUsage]);

  // Performance observer for more detailed monitoring
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          logger.debug(`Performance measure: ${entry.name} - ${entry.duration.toFixed(2)}ms`, { name: entry.name, duration: entry.duration });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      logger.warn('Performance Observer not supported', { error });
    }

    return () => observer.disconnect();
  }, [isSupported]);

  return {
    metrics,
    isSupported,
    measureLoadTime,
    measureRenderTime
  };
}

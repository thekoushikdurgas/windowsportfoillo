'use client';

import { useEffect, useState, memo } from 'react';
import { Activity, Zap } from 'lucide-react';
import { logger } from '../../lib/logger';

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  renderTime: number;
  chunkCount: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  logToConsole?: boolean;
}

const PerformanceMonitor = memo(({ 
  enabled = process.env['NODE_ENV'] === 'development',
  logToConsole = false 
}: PerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    bundleSize: 0,
    loadTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    chunkCount: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      // Measure bundle size
      const bundleSize = performance.getEntriesByType('resource')
        .reduce((total, entry) => total + ((entry as PerformanceEntry & { transferSize?: number }).transferSize || 0), 0);

      // Measure load time
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

      // Measure memory usage (if available)
      const memoryUsage = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0;

      // Count chunks
      const chunkCount = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('chunks')).length;

      const newMetrics = {
        bundleSize: Math.round(bundleSize / 1024), // KB
        loadTime: Math.round(loadTime),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // MB
        renderTime: 0, // Will be measured by React Profiler
        chunkCount,
      };

      setMetrics(newMetrics);

      if (logToConsole) {
        logger.debug('Performance metrics collected', {
          component: 'PerformanceMonitor',
          bundleSize: `${newMetrics.bundleSize} KB`,
          loadTime: `${newMetrics.loadTime} ms`,
          memoryUsage: `${newMetrics.memoryUsage} MB`,
          chunkCount: newMetrics.chunkCount,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('load', measurePerformance);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, logToConsole]);

  if (!enabled || !isVisible) return null;

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 min-w-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5" />
        <h3 className="font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Bundle Size:</span>
          <span className={getStatusColor(metrics.bundleSize, { good: 500, warning: 1000 })}>
            {metrics.bundleSize} KB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className={getStatusColor(metrics.loadTime, { good: 2000, warning: 5000 })}>
            {metrics.loadTime} ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Memory Usage:</span>
          <span className={getStatusColor(metrics.memoryUsage, { good: 50, warning: 100 })}>
            {metrics.memoryUsage} MB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Chunk Count:</span>
          <span className={getStatusColor(metrics.chunkCount, { good: 10, warning: 20 })}>
            {metrics.chunkCount}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Zap className="w-3 h-3" />
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export { PerformanceMonitor };

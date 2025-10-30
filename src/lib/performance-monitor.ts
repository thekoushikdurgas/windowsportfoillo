import { PerformanceMetrics, PerformanceThresholds, PerformanceReport, BundleAnalysis } from '@/types/performance';
import { logger, errorToLogContext } from './logger';

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private thresholds: PerformanceThresholds = {
    maxRenderTime: 16, // 60fps
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxReRenderCount: 5,
    warningThreshold: 0.8,
  };
  private observers: Set<(report: PerformanceReport) => void> = new Set();
  private isMonitoring = false;

  startMonitoring() {
    this.isMonitoring = true;
    this.observeMemoryUsage();
    this.observeBundleSize();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  recordComponentRender(componentName: string, renderTime: number) {
    if (!this.isMonitoring) return;

    const existing = this.metrics.get(componentName) || {
      renderTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      reRenderCount: 0,
      lastRenderTime: new Date(),
    };

    const updated: PerformanceMetrics = {
      ...existing,
      renderTime: (existing.renderTime + renderTime) / 2, // Average
      componentCount: existing.componentCount + 1,
      reRenderCount: existing.reRenderCount + 1,
      lastRenderTime: new Date(),
    };

    this.metrics.set(componentName, updated);
    this.checkThresholds(componentName, updated);
  }

  recordMemoryUsage(componentName: string, memoryUsage: number) {
    if (!this.isMonitoring) return;

    const existing = this.metrics.get(componentName) || {
      renderTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      reRenderCount: 0,
      lastRenderTime: new Date(),
    };

    const updated: PerformanceMetrics = {
      ...existing,
      memoryUsage,
    };

    this.metrics.set(componentName, updated);
    this.checkThresholds(componentName, updated);
  }

  private checkThresholds(componentName: string, metrics: PerformanceMetrics) {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check render time
    if (metrics.renderTime > this.thresholds.maxRenderTime) {
      warnings.push(`Render time ${metrics.renderTime}ms exceeds threshold ${this.thresholds.maxRenderTime}ms`);
      recommendations.push('Consider using React.memo() or useMemo() to optimize rendering');
    }

    // Check memory usage
    if (metrics.memoryUsage > this.thresholds.maxMemoryUsage) {
      warnings.push(`Memory usage ${this.formatBytes(metrics.memoryUsage)} exceeds threshold ${this.formatBytes(this.thresholds.maxMemoryUsage)}`);
      recommendations.push('Consider implementing memory cleanup or reducing component complexity');
    }

    // Check re-render count
    if (metrics.reRenderCount > this.thresholds.maxReRenderCount) {
      warnings.push(`Re-render count ${metrics.reRenderCount} exceeds threshold ${this.thresholds.maxReRenderCount}`);
      recommendations.push('Consider using useCallback() or useMemo() to prevent unnecessary re-renders');
    }

    if (warnings.length > 0) {
      const report: PerformanceReport = {
        componentName,
        metrics,
        thresholds: this.thresholds,
        warnings,
        recommendations,
        timestamp: new Date(),
      };

      this.notifyObservers(report);
    }
  }

  private observeMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const checkMemory = () => {
      if (!this.isMonitoring) return;

      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        const usedJSHeapSize = memory.usedJSHeapSize;
        this.recordMemoryUsage('global', usedJSHeapSize);
      }

      setTimeout(checkMemory, 5000); // Check every 5 seconds
    };

    checkMemory();
  }

  private observeBundleSize() {
    if (typeof window === 'undefined') return;

    // This would typically be done at build time, but we can estimate
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        // Estimate size based on script name patterns
        totalSize += 100 * 1024; // Rough estimate
      }
    });

    logger.debug(`Estimated bundle size: ${this.formatBytes(totalSize)}`);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  private notifyObservers(report: PerformanceReport) {
    this.observers.forEach(observer => {
      try {
        observer(report);
      } catch (error) {
        logger.error('Error in performance observer:', errorToLogContext(error));
      }
    });
  }

  subscribe(observer: (report: PerformanceReport) => void) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  getMetrics(componentName?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (componentName) {
      return this.metrics.get(componentName) || {
        renderTime: 0,
        memoryUsage: 0,
        componentCount: 0,
        reRenderCount: 0,
        lastRenderTime: new Date(),
      };
    }
    return new Map(this.metrics);
  }

  getReport(componentName?: string): PerformanceReport[] {
    const reports: PerformanceReport[] = [];
    
    if (componentName) {
      const metrics = this.metrics.get(componentName);
      if (metrics) {
        reports.push({
          componentName,
          metrics,
          thresholds: this.thresholds,
          warnings: [],
          recommendations: [],
          timestamp: new Date(),
        });
      }
    } else {
      this.metrics.forEach((metrics, name) => {
        reports.push({
          componentName: name,
          metrics,
          thresholds: this.thresholds,
          warnings: [],
          recommendations: [],
          timestamp: new Date(),
        });
      });
    }

    return reports;
  }

  setThresholds(thresholds: Partial<PerformanceThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  resetMetrics() {
    this.metrics.clear();
  }

  async analyzeBundle(): Promise<BundleAnalysis> {
    // This would typically be done at build time with webpack-bundle-analyzer
    // For now, we'll return a mock analysis
    return {
      totalSize: 1024 * 1024, // 1MB
      gzippedSize: 256 * 1024, // 256KB
      chunks: [
        {
          name: 'main',
          size: 512 * 1024,
          gzippedSize: 128 * 1024,
          modules: [
            { name: 'react', size: 100 * 1024, gzippedSize: 25 * 1024 },
            { name: 'next', size: 200 * 1024, gzippedSize: 50 * 1024 },
          ],
        },
      ],
      duplicates: [],
      recommendations: [
        'Consider code splitting for better performance',
        'Remove unused dependencies',
        'Optimize images and assets',
      ],
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

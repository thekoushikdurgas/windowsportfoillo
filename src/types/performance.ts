export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  reRenderCount: number;
  lastRenderTime: Date;
}

export interface PerformanceThresholds {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxReRenderCount: number;
  warningThreshold: number;
}

export interface PerformanceReport {
  componentName: string;
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  warnings: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzippedSize: number;
    modules: Array<{
      name: string;
      size: number;
      gzippedSize: number;
    }>;
  }>;
  duplicates: Array<{
    module: string;
    chunks: string[];
    size: number;
  }>;
  recommendations: string[];
}

export interface PerformanceMonitoringConfig {
  monitoring: boolean;
  thresholds: PerformanceThresholds;
  reporting: boolean;
  autoOptimization: boolean;
  bundleAnalysis: boolean;
}

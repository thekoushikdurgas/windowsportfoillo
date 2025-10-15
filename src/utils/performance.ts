/**
 * Performance optimization utilities for Windows 11 Replica
 */

import { lazy, ComponentType, useState } from 'react';

// Lazy load components for better performance
export const LazyWindowManager = lazy(() => import('@/components/system/WindowManager'));
export const LazyStartMenu = lazy(() => import('@/components/system/StartMenu'));
export const LazyQuickSettings = lazy(() => import('@/components/system/QuickSettings'));
export const LazyNotificationCenter = lazy(() => import('@/components/system/NotificationCenter'));
export const LazySnapLayouts = lazy(() => import('@/components/ui/SnapLayouts'));
export const LazyCropOverlay = lazy(() => import('@/components/ui/CropOverlay'));
export const LazyTutorialOverlay = lazy(() => import('@/components/ui/TutorialOverlay'));
export const LazyKeyboardShortcutsHelp = lazy(() => import('@/components/system/KeyboardShortcutsHelp'));
export const LazyToastContainer = lazy(() => import('@/components/system/ToastContainer'));

// Lazy load app components
export const LazyAboutMeApp = lazy(() => import('@/components/apps/AboutMe/AboutMeApp'));
export const LazyCalculatorApp = lazy(() => import('@/components/apps/Calculator/CalculatorApp'));
export const LazyFileExplorerApp = lazy(() => import('@/components/apps/FileExplorer/FileExplorerApp'));
export const LazyNotepadApp = lazy(() => import('@/components/apps/Notepad/NotepadApp'));
export const LazySettingsApp = lazy(() => import('@/components/apps/Settings/SettingsApp'));

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  public endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure ? measure.duration : 0;
    
    // Store metric
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Keep only last 100 measurements
    const measurements = this.metrics.get(name)!;
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    // Clean up marks
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  public getAverageTime(name: string): number {
    const measurements = this.metrics.get(name);
    if (!measurements || measurements.length === 0) return 0;
    
    const sum = measurements.reduce((acc, time) => acc + time, 0);
    return sum / measurements.length;
  }

  public getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [name, measurements] of this.metrics.entries()) {
      if (measurements.length > 0) {
        result[name] = {
          average: this.getAverageTime(name),
          count: measurements.length,
          latest: measurements[measurements.length - 1]
        };
      }
    }
    
    return result;
  }

  public startWebVitalsMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
  }

  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((_list) => {
      // LCP measurement: entries[entries.length - 1].startTime
      // const entries = list.getEntries();
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((_entry: PerformanceEntry) => {
        // FID measurement: entry.processingStart - entry.startTime
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput) {
          // CLS measurement: entry.value (accumulated)
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Virtual scrolling utility for large lists
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    visibleStart,
    visibleEnd,
  };
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }
  
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
  
  if (!memory) {
    return null;
  }
  
  const used = memory.usedJSHeapSize;
  const total = memory.totalJSHeapSize;
  const percentage = (used / total) * 100;
  
  return { used, total, percentage };
}

// Bundle size optimization helpers
export function preloadComponent(componentImport: () => Promise<{ default: ComponentType<Record<string, unknown>> }>): void {
  if (typeof window !== 'undefined') {
    // Preload component when user hovers over related elements
    componentImport();
  }
}

// Image optimization utilities
export function optimizeImageUrl(url: string, _width?: number, _height?: number): string {
  // This would integrate with an image optimization service
  // For now, return the original URL
  return url;
}

// Critical resource hints
export function addResourceHints(): void {
  if (typeof window === 'undefined') return;
  
  const hints = [
    { rel: 'preload', href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/images/wallpapers/windows11-default.svg', as: 'image' },
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.entries(hint).forEach(([key, value]) => {
      link.setAttribute(key, value as string);
    });
    document.head.appendChild(link);
  });
}

// Performance budget monitoring
export const PERFORMANCE_BUDGETS = {
  FCP: 1800, // First Contentful Paint
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  TTI: 3800, // Time to Interactive
};

export function checkPerformanceBudget(metric: keyof typeof PERFORMANCE_BUDGETS, value: number): boolean {
  return value <= PERFORMANCE_BUDGETS[metric];
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startWebVitalsMonitoring();
  addResourceHints();
}

// Export lazy components for easy use
export const LazyComponents = {
  WindowManager: LazyWindowManager,
  StartMenu: LazyStartMenu,
  QuickSettings: LazyQuickSettings,
  NotificationCenter: LazyNotificationCenter,
  SnapLayouts: LazySnapLayouts,
  CropOverlay: LazyCropOverlay,
  TutorialOverlay: LazyTutorialOverlay,
  KeyboardShortcutsHelp: LazyKeyboardShortcutsHelp,
  ToastContainer: LazyToastContainer,
  AboutMeApp: LazyAboutMeApp,
  CalculatorApp: LazyCalculatorApp,
  FileExplorerApp: LazyFileExplorerApp,
  NotepadApp: LazyNotepadApp,
  SettingsApp: LazySettingsApp,
};

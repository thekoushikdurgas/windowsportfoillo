export interface MemoryInfo {
  used: number;
  total: number;
  available: number;
  percentage: number;
}

export interface ComponentMemoryUsage {
  componentName: string;
  memoryUsage: number;
  lastAccessed: Date;
  isActive: boolean;
}

export interface MemoryLeak {
  id: string;
  type: 'eventListener' | 'timer' | 'observer' | 'subscription' | 'cache';
  component: string;
  description: string;
  size: number;
  detectedAt: Date;
}

export class MemoryManagementService {
  private componentMemory: Map<string, ComponentMemoryUsage> = new Map();
  private eventListeners: Map<string, Set<() => void>> = new Map();
  private timers: Map<string, Set<number>> = new Map();
  private observers: Map<string, Set<MutationObserver | IntersectionObserver | ResizeObserver>> = new Map();
  private subscriptions: Map<string, Set<() => void>> = new Map();
  private caches: Map<string, Map<string, unknown>> = new Map();
  private memoryLeaks: MemoryLeak[] = [];
  private cleanupInterval: number | null = null;
  private memoryThreshold = 0.8; // 80% memory usage threshold
  private maxCacheSize = 100; // Maximum number of items per cache
  private maxComponentMemory = 50; // Maximum number of components to track

  constructor() {
    this.startMemoryMonitoring();
  }

  private startMemoryMonitoring() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      this.cleanupInterval = window.setInterval(() => {
        this.performMemoryCleanup();
        this.detectMemoryLeaks();
      }, 30000); // Check every 30 seconds
    }
  }

  private stopMemoryMonitoring() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  getMemoryInfo(): MemoryInfo | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (!memory) return null;
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const available = memory.jsHeapSizeLimit;
      const percentage = (used / available) * 100;

      return {
        used,
        total,
        available,
        percentage,
      };
    }
    return null;
  }

  trackComponent(componentName: string, memoryUsage = 0) {
    const existing = this.componentMemory.get(componentName);
    if (existing) {
      existing.memoryUsage = memoryUsage;
      existing.lastAccessed = new Date();
      existing.isActive = true;
    } else {
      // Limit the number of tracked components
      if (this.componentMemory.size >= this.maxComponentMemory) {
        const oldestComponent = Array.from(this.componentMemory.entries())
          .sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime())[0];
        if (oldestComponent) {
          this.componentMemory.delete(oldestComponent[0]);
        }
      }

      this.componentMemory.set(componentName, {
        componentName,
        memoryUsage,
        lastAccessed: new Date(),
        isActive: true,
      });
    }
  }

  untrackComponent(componentName: string) {
    const component = this.componentMemory.get(componentName);
    if (component) {
      component.isActive = false;
    }
  }

  addEventListener(componentName: string, element: EventTarget, event: string, handler: EventListener) {
    const key = `${componentName}_${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, new Set());
    }
    
    const cleanup = () => {
      element.removeEventListener(event, handler);
      const listeners = this.eventListeners.get(key);
      if (listeners) {
        listeners.delete(cleanup);
        if (listeners.size === 0) {
          this.eventListeners.delete(key);
        }
      }
    };

    const listeners = this.eventListeners.get(key);
    if (listeners) {
      listeners.add(cleanup);
    }
    element.addEventListener(event, handler);
    
    return cleanup;
  }

  addTimer(componentName: string, timerId: number) {
    const key = componentName;
    if (!this.timers.has(key)) {
      this.timers.set(key, new Set());
    }
    const timers = this.timers.get(key);
    if (timers) {
      timers.add(timerId);
    }
  }

  clearTimers(componentName: string) {
    const key = componentName;
    const componentTimers = this.timers.get(key);
    if (componentTimers) {
      componentTimers.forEach(timerId => {
        clearTimeout(timerId);
        clearInterval(timerId);
      });
      this.timers.delete(key);
    }
  }

  addObserver(componentName: string, observer: MutationObserver | IntersectionObserver | ResizeObserver) {
    const key = componentName;
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    const observers = this.observers.get(key);
    if (observers) {
      observers.add(observer);
    }
  }

  clearObservers(componentName: string) {
    const key = componentName;
    const componentObservers = this.observers.get(key);
    if (componentObservers) {
      componentObservers.forEach(observer => {
        observer.disconnect();
      });
      this.observers.delete(key);
    }
  }

  addSubscription(componentName: string, unsubscribe: () => void) {
    const key = componentName;
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    const subscriptions = this.subscriptions.get(key);
    if (subscriptions) {
      subscriptions.add(unsubscribe);
    }
  }

  clearSubscriptions(componentName: string) {
    const key = componentName;
    const componentSubscriptions = this.subscriptions.get(key);
    if (componentSubscriptions) {
      componentSubscriptions.forEach(unsubscribe => unsubscribe());
      this.subscriptions.delete(key);
    }
  }

  createCache(componentName: string, maxSize: number = this.maxCacheSize) {
    const cache = new Map<string, unknown>();
    this.caches.set(componentName, cache);
    
    return {
      get: (key: string) => cache.get(key),
      set: (key: string, value: unknown) => {
        if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          if (firstKey) {
            cache.delete(firstKey);
          }
        }
        cache.set(key, value);
      },
      delete: (key: string) => cache.delete(key),
      clear: () => cache.clear(),
      size: () => cache.size,
    };
  }

  clearCache(componentName: string) {
    this.caches.delete(componentName);
  }

  cleanupComponent(componentName: string) {
    this.clearTimers(componentName);
    this.clearObservers(componentName);
    this.clearSubscriptions(componentName);
    this.clearCache(componentName);
    this.untrackComponent(componentName);
  }

  private performMemoryCleanup() {
    const memoryInfo = this.getMemoryInfo();
    if (!memoryInfo) return;

    // Clean up inactive components
    const inactiveComponents = Array.from(this.componentMemory.entries())
      .filter(([, component]) => !component.isActive)
      .map(([name]) => name);

    inactiveComponents.forEach((componentName) => {
      this.cleanupComponent(componentName);
    });

    // Clean up old caches
    this.caches.forEach((cache) => {
      if (cache.size > this.maxCacheSize) {
        const entries = Array.from(cache.entries());
        const toDelete = entries.slice(0, entries.length - this.maxCacheSize);
        toDelete.forEach(([key]) => cache.delete(key));
      }
    });

    // Force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as unknown as { gc?: () => void }).gc?.();
    }
  }

  private detectMemoryLeaks() {
    const memoryInfo = this.getMemoryInfo();
    if (!memoryInfo) return;

    // Check for memory threshold
    if (memoryInfo.percentage > this.memoryThreshold * 100) {
      this.memoryLeaks.push({
        id: `leak_${Date.now()}`,
        type: 'cache',
        component: 'system',
        description: `Memory usage exceeded ${this.memoryThreshold * 100}%`,
        size: memoryInfo.used,
        detectedAt: new Date(),
      });
    }

    // Check for orphaned event listeners
    this.eventListeners.forEach((listeners, key) => {
      if (listeners.size > 100) {
        this.memoryLeaks.push({
          id: `leak_${Date.now()}`,
          type: 'eventListener',
          component: key,
          description: `Too many event listeners: ${listeners.size}`,
          size: listeners.size * 1000, // Estimate
          detectedAt: new Date(),
        });
      }
    });

    // Check for large caches
    this.caches.forEach((cache, componentName) => {
      if (cache.size > this.maxCacheSize * 2) {
        this.memoryLeaks.push({
          id: `leak_${Date.now()}`,
          type: 'cache',
          component: componentName,
          description: `Cache size exceeded limit: ${cache.size}`,
          size: cache.size * 1000, // Estimate
          detectedAt: new Date(),
        });
      }
    });
  }

  getMemoryLeaks(): MemoryLeak[] {
    return [...this.memoryLeaks];
  }

  clearMemoryLeaks() {
    this.memoryLeaks = [];
  }

  getComponentMemoryUsage(): ComponentMemoryUsage[] {
    return Array.from(this.componentMemory.values());
  }

  getMemoryStats() {
    return {
      components: this.componentMemory.size,
      eventListeners: Array.from(this.eventListeners.values()).reduce((sum, set) => sum + set.size, 0),
      timers: Array.from(this.timers.values()).reduce((sum, set) => sum + set.size, 0),
      observers: Array.from(this.observers.values()).reduce((sum, set) => sum + set.size, 0),
      subscriptions: Array.from(this.subscriptions.values()).reduce((sum, set) => sum + set.size, 0),
      caches: this.caches.size,
      memoryLeaks: this.memoryLeaks.length,
    };
  }

  setMemoryThreshold(threshold: number) {
    this.memoryThreshold = Math.max(0.1, Math.min(1.0, threshold));
  }

  setMaxCacheSize(size: number) {
    this.maxCacheSize = Math.max(10, size);
  }

  setMaxComponentMemory(size: number) {
    this.maxComponentMemory = Math.max(10, size);
  }

  destroy() {
    this.stopMemoryMonitoring();
    
    // Clean up all tracked resources
    this.eventListeners.forEach(listeners => {
      listeners.forEach(cleanup => cleanup());
    });
    this.eventListeners.clear();

    this.timers.forEach(timers => {
      timers.forEach(timerId => {
        clearTimeout(timerId);
        clearInterval(timerId);
      });
    });
    this.timers.clear();

    this.observers.forEach(observers => {
      observers.forEach(observer => observer.disconnect());
    });
    this.observers.clear();

    this.subscriptions.forEach(subscriptions => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    });
    this.subscriptions.clear();

    this.caches.clear();
    this.componentMemory.clear();
    this.memoryLeaks = [];
  }
}

// Singleton instance
export const memoryManagement = new MemoryManagementService();

import { useEffect, useRef, useCallback, useState } from 'react'

// Performance metrics interface
export interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  frameRate: number
  bundleSize: number
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
}

// Performance monitoring class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics
  private observers: ((metrics: PerformanceMetrics) => void)[]
  private frameCount: number
  private lastFrameTime: number
  private rafId: number | null

  private constructor() {
    this.metrics = {
      renderTime: 0,
      memoryUsage: 0,
      frameRate: 0,
      bundleSize: 0,
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0
    }
    this.observers = []
    this.frameCount = 0
    this.lastFrameTime = performance.now()
    this.rafId = null

    this.initializeMetrics()
    this.startFrameRateMonitoring()
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  private initializeMetrics() {
    // Get bundle size from performance entries
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      this.metrics.loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart
    }

    // Get memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
    }

    // Get Core Web Vitals
    this.observeCoreWebVitals()
  }

  private observeCoreWebVitals() {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.largestContentfulPaint = lastEntry.startTime
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.metrics.cumulativeLayoutShift = clsValue
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }

  private startFrameRateMonitoring() {
    const measureFrameRate = () => {
      const currentTime = performance.now()
      this.frameCount++

      if (currentTime - this.lastFrameTime >= 1000) {
        this.metrics.frameRate = this.frameCount
        this.frameCount = 0
        this.lastFrameTime = currentTime
        this.notifyObservers()
      }

      this.rafId = requestAnimationFrame(measureFrameRate)
    }

    this.rafId = requestAnimationFrame(measureFrameRate)
  }

  public measureRender<T>(fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.metrics.renderTime = end - start
    this.notifyObservers()
    
    return result
  }

  public measureAsync<T>(fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().then(result => {
      const end = performance.now()
      this.metrics.renderTime = end - start
      this.notifyObservers()
      return result
    })
  }

  public updateMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      this.notifyObservers()
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.observers.push(callback)
    return () => {
      const index = this.observers.indexOf(callback)
      if (index > -1) {
        this.observers.splice(index, 1)
      }
    }
  }

  private notifyObservers() {
    this.observers.forEach(callback => callback(this.getMetrics()))
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    this.observers = []
  }
}

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

// React performance hooks
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0,
    bundleSize: 0,
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0
  })

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    
    const unsubscribe = monitor.subscribe(setMetrics)
    
    // Update memory usage periodically
    const interval = setInterval(() => {
      monitor.updateMemoryUsage()
    }, 1000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return metrics
}

export const useRenderPerformance = <T>(
  renderFn: () => T,
  deps: React.DependencyList
): T => {
  const monitor = PerformanceMonitor.getInstance()
  const [result, setResult] = useState<T>(() => renderFn())

  useEffect(() => {
    const newResult = monitor.measureRender(renderFn)
    setResult(newResult)
  }, deps)

  return result
}

export const useAsyncPerformance = <T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList
): { data: T | null; loading: boolean; error: Error | null } => {
  const monitor = PerformanceMonitor.getInstance()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    monitor.measureAsync(asyncFn)
      .then(result => {
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, deps)

  return { data, loading, error }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const resources = [...scripts, ...stylesheets].map(link => ({
    url: (link as HTMLScriptElement).src || (link as HTMLLinkElement).href,
    type: link.tagName.toLowerCase()
  }))

  return resources
}

// Memory leak detection
export const detectMemoryLeaks = () => {
  if (!('memory' in performance)) {
    return { hasLeak: false, message: 'Memory API not available' }
  }

  const memory = (performance as any).memory
  const used = memory.usedJSHeapSize
  const total = memory.totalJSHeapSize
  const limit = memory.jsHeapSizeLimit

  const usagePercentage = (used / limit) * 100
  
  if (usagePercentage > 80) {
    return { 
      hasLeak: true, 
      message: `High memory usage: ${usagePercentage.toFixed(2)}%` 
    }
  }

  return { hasLeak: false, message: 'Memory usage normal' }
}

// Performance budget checker
export const checkPerformanceBudget = (metrics: PerformanceMetrics) => {
  const budget = {
    renderTime: 16, // 60fps
    memoryUsage: 100, // 100MB
    frameRate: 30, // 30fps minimum
    loadTime: 3000, // 3 seconds
    firstContentfulPaint: 1800, // 1.8 seconds
    largestContentfulPaint: 2500, // 2.5 seconds
    cumulativeLayoutShift: 0.1 // 0.1
  }

  const violations = []

  if (metrics.renderTime > budget.renderTime) {
    violations.push(`Render time ${metrics.renderTime.toFixed(2)}ms exceeds budget ${budget.renderTime}ms`)
  }

  if (metrics.memoryUsage > budget.memoryUsage) {
    violations.push(`Memory usage ${metrics.memoryUsage.toFixed(2)}MB exceeds budget ${budget.memoryUsage}MB`)
  }

  if (metrics.frameRate < budget.frameRate) {
    violations.push(`Frame rate ${metrics.frameRate}fps below budget ${budget.frameRate}fps`)
  }

  if (metrics.loadTime > budget.loadTime) {
    violations.push(`Load time ${metrics.loadTime.toFixed(2)}ms exceeds budget ${budget.loadTime}ms`)
  }

  if (metrics.firstContentfulPaint > budget.firstContentfulPaint) {
    violations.push(`FCP ${metrics.firstContentfulPaint.toFixed(2)}ms exceeds budget ${budget.firstContentfulPaint}ms`)
  }

  if (metrics.largestContentfulPaint > budget.largestContentfulPaint) {
    violations.push(`LCP ${metrics.largestContentfulPaint.toFixed(2)}ms exceeds budget ${budget.largestContentfulPaint}ms`)
  }

  if (metrics.cumulativeLayoutShift > budget.cumulativeLayoutShift) {
    violations.push(`CLS ${metrics.cumulativeLayoutShift.toFixed(3)} exceeds budget ${budget.cumulativeLayoutShift}`)
  }

  return {
    passed: violations.length === 0,
    violations
  }
}

// Performance optimization recommendations
export const getOptimizationRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations = []

  if (metrics.renderTime > 16) {
    recommendations.push('Consider using React.memo() or useMemo() to reduce re-renders')
  }

  if (metrics.memoryUsage > 50) {
    recommendations.push('Check for memory leaks and optimize component cleanup')
  }

  if (metrics.frameRate < 30) {
    recommendations.push('Optimize animations and reduce DOM manipulations')
  }

  if (metrics.loadTime > 2000) {
    recommendations.push('Implement code splitting and lazy loading')
  }

  if (metrics.firstContentfulPaint > 1500) {
    recommendations.push('Optimize critical rendering path and reduce render-blocking resources')
  }

  if (metrics.largestContentfulPaint > 2000) {
    recommendations.push('Optimize images and reduce layout shifts')
  }

  if (metrics.cumulativeLayoutShift > 0.05) {
    recommendations.push('Fix layout shifts by reserving space for dynamic content')
  }

  return recommendations
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

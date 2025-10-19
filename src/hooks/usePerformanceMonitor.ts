'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentName: string
  timestamp: number
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private maxMetrics = 100

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  recordRender(componentName: string, renderTime: number) {
    this.metrics.push({
      renderTime,
      componentName,
      timestamp: Date.now()
    })

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`)
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageRenderTime(componentName?: string): number {
    const filtered = componentName 
      ? this.metrics.filter(m => m.componentName === componentName)
      : this.metrics

    if (filtered.length === 0) return 0

    const total = filtered.reduce((sum, metric) => sum + metric.renderTime, 0)
    return total / filtered.length
  }

  clearMetrics() {
    this.metrics = []
  }
}

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0)
  const monitor = PerformanceMonitor.getInstance()

  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    monitor.recordRender(componentName, renderTime)
  })

  return {
    recordCustomMetric: (metricName: string, value: number) => {
      monitor.recordRender(`${componentName}:${metricName}`, value)
    },
    getMetrics: () => monitor.getMetrics(),
    getAverageRenderTime: () => monitor.getAverageRenderTime(componentName),
    clearMetrics: () => monitor.clearMetrics()
  }
}

// Hook for measuring specific operations
export function usePerformanceMeasure() {
  const measure = (operation: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operation} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  const measureAsync = async (operation: string, fn: () => Promise<void>) => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operation} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  return { measure, measureAsync }
}

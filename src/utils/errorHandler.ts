import { ERROR_CONSTANTS } from '@/constants'

// Error types
export interface DurgasOSError extends Error {
  code: string
  context?: Record<string, any>
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface ErrorReport {
  error: DurgasOSError
  userAgent: string
  url: string
  timestamp: Date
  stack?: string
}

// Error creation
export const createError = (
  message: string,
  code: string,
  context?: Record<string, any>,
  severity: DurgasOSError['severity'] = 'medium'
): DurgasOSError => {
  const error = new Error(message) as DurgasOSError
  error.code = code
  error.context = context
  error.timestamp = new Date()
  error.severity = severity
  return error
}

// Specific error creators
export const createAppLaunchError = (appId: string, reason?: string): DurgasOSError => {
  return createError(
    `Failed to launch app: ${appId}${reason ? ` - ${reason}` : ''}`,
    ERROR_CONSTANTS.CODES.APP_LAUNCH_FAILED,
    { appId, reason },
    'high'
  )
}

export const createWindowCreateError = (windowId: string, reason?: string): DurgasOSError => {
  return createError(
    `Failed to create window: ${windowId}${reason ? ` - ${reason}` : ''}`,
    ERROR_CONSTANTS.CODES.WINDOW_CREATE_FAILED,
    { windowId, reason },
    'high'
  )
}

export const createStoreUpdateError = (storeName: string, action: string, reason?: string): DurgasOSError => {
  return createError(
    `Failed to update store ${storeName} with action ${action}${reason ? ` - ${reason}` : ''}`,
    ERROR_CONSTANTS.CODES.STORE_UPDATE_FAILED,
    { storeName, action, reason },
    'medium'
  )
}

export const createNotificationError = (notificationId: string, reason?: string): DurgasOSError => {
  return createError(
    `Failed to send notification: ${notificationId}${reason ? ` - ${reason}` : ''}`,
    ERROR_CONSTANTS.CODES.NOTIFICATION_SEND_FAILED,
    { notificationId, reason },
    'low'
  )
}

export const createSettingsError = (settingKey: string, reason?: string): DurgasOSError => {
  return createError(
    `Failed to save setting ${settingKey}${reason ? ` - ${reason}` : ''}`,
    ERROR_CONSTANTS.CODES.SETTINGS_SAVE_FAILED,
    { settingKey, reason },
    'medium'
  )
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: ErrorReport[] = []
  private maxLogSize = 100
  private listeners: ((error: DurgasOSError) => void)[] = []

  private constructor() {
    this.setupGlobalErrorHandlers()
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  private setupGlobalErrorHandlers(): void {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError(createError(
        event.message,
        'UNCAUGHT_ERROR',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        'critical'
      ))
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(createError(
        `Unhandled promise rejection: ${event.reason}`,
        'UNHANDLED_REJECTION',
        { reason: event.reason },
        'high'
      ))
    })
  }

  public handleError(error: DurgasOSError): void {
    // Log the error
    this.logError(error)

    // Notify listeners
    this.notifyListeners(error)

    // Handle based on severity
    this.handleBySeverity(error)
  }

  private logError(error: DurgasOSError): void {
    const report: ErrorReport = {
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      stack: error.stack
    }

    this.errorLog.unshift(report)

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem(
        'durgasos_error_log',
        JSON.stringify(this.errorLog.slice(0, 10)) // Keep only last 10 errors
      )
    } catch (e) {
      console.warn('Failed to store error log:', e)
    }
  }

  private notifyListeners(error: DurgasOSError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error)
      } catch (e) {
        console.error('Error in error listener:', e)
      }
    })
  }

  private handleBySeverity(error: DurgasOSError): void {
    switch (error.severity) {
      case 'critical':
        console.error('CRITICAL ERROR:', error)
        // Could trigger emergency recovery or user notification
        break
      case 'high':
        console.error('HIGH SEVERITY ERROR:', error)
        break
      case 'medium':
        console.warn('MEDIUM SEVERITY ERROR:', error)
        break
      case 'low':
        console.info('LOW SEVERITY ERROR:', error)
        break
    }
  }

  public addListener(listener: (error: DurgasOSError) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public getErrorLog(): ErrorReport[] {
    return [...this.errorLog]
  }

  public clearErrorLog(): void {
    this.errorLog = []
    localStorage.removeItem('durgasos_error_log')
  }

  public getErrorStats(): {
    total: number
    bySeverity: Record<string, number>
    byCode: Record<string, number>
    recent: ErrorReport[]
  } {
    const bySeverity = this.errorLog.reduce((acc, report) => {
      const severity = report.error.severity
      acc[severity] = (acc[severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byCode = this.errorLog.reduce((acc, report) => {
      const code = report.error.code
      acc[code] = (acc[code] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: this.errorLog.length,
      bySeverity,
      byCode,
      recent: this.errorLog.slice(0, 5)
    }
  }
}

// Utility functions
export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  errorContext?: string
): T => {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args)
    } catch (error) {
      const durgasError = createError(
        error instanceof Error ? error.message : 'Unknown error',
        'FUNCTION_ERROR',
        { 
          context: errorContext,
          args: args.length > 0 ? args : undefined
        },
        'medium'
      )
      ErrorHandler.getInstance().handleError(durgasError)
      throw durgasError
    }
  }) as T
}

export const withAsyncErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorContext?: string
): T => {
  return ((...args: Parameters<T>) => {
    return fn(...args).catch((error) => {
      const durgasError = createError(
        error instanceof Error ? error.message : 'Unknown async error',
        'ASYNC_FUNCTION_ERROR',
        { 
          context: errorContext,
          args: args.length > 0 ? args : undefined
        },
        'medium'
      )
      ErrorHandler.getInstance().handleError(durgasError)
      throw durgasError
    })
  }) as T
}

// Safe execution helpers
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  errorContext?: string
): T => {
  try {
    return fn()
  } catch (error) {
    const durgasError = createError(
      error instanceof Error ? error.message : 'Unknown error',
      'SAFE_EXECUTE_ERROR',
      { context: errorContext },
      'low'
    )
    ErrorHandler.getInstance().handleError(durgasError)
    return fallback
  }
}

export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  errorContext?: string
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    const durgasError = createError(
      error instanceof Error ? error.message : 'Unknown async error',
      'SAFE_EXECUTE_ASYNC_ERROR',
      { context: errorContext },
      'low'
    )
    ErrorHandler.getInstance().handleError(durgasError)
    return fallback
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

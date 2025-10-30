'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { AlertTriangle, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDesktop } from '@/context/DesktopContext';
import { logger } from '../../lib/logger';

interface ContextAwareErrorBoundaryProps {
  children: React.ReactNode;
}

export function ContextAwareErrorBoundary({ children }: ContextAwareErrorBoundaryProps) {
  const { openApp } = useDesktop();

  const handleError = (error: Error, errorInfo: unknown) => {
    // Log error with enhanced context
    logger.error('Context-aware error caught', {
      component: 'ContextAwareErrorBoundary',
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo,
      timestamp: new Date().toISOString()
    });
  };

  const fallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          System Error
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          DurgasOS encountered an unexpected error. The system will attempt to recover.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Restart DurgasOS
          </Button>
          <Button 
            onClick={() => openApp('settings')} 
            variant="outline" 
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Open Settings
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

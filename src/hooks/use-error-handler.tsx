'use client';

import { useCallback } from 'react';
import { useToast } from './use-toast';
import { logger } from '../lib/logger';
import { ToastAction } from '@/components/ui/toast';

export type ErrorType = 'network' | 'validation' | 'permission' | 'notFound' | 'server' | 'unknown';

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: Record<string, unknown>;
  retryable?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | ErrorDetails, context?: string) => {
    let errorDetails: ErrorDetails;

    if (error instanceof Error) {
      // Convert Error to ErrorDetails
      errorDetails = {
        type: 'unknown',
        message: error.message,
        details: { stack: error.stack },
        retryable: true,
      };
    } else {
      errorDetails = error;
    }

    // Determine error type based on message or code
    if (!errorDetails.type || errorDetails.type === 'unknown') {
      if (errorDetails.message.includes('network') || errorDetails.message.includes('fetch')) {
        errorDetails.type = 'network';
      } else if (errorDetails.message.includes('permission') || errorDetails.message.includes('unauthorized')) {
        errorDetails.type = 'permission';
      } else if (errorDetails.message.includes('not found') || errorDetails.message.includes('404')) {
        errorDetails.type = 'notFound';
      } else if (errorDetails.message.includes('validation') || errorDetails.message.includes('invalid')) {
        errorDetails.type = 'validation';
      } else if (errorDetails.message.includes('server') || errorDetails.message.includes('500')) {
        errorDetails.type = 'server';
      }
    }

    // Get user-friendly message
    const userMessage = getUserFriendlyMessage(errorDetails, context);

    // Show toast notification
    const getToastAction = () => {
      if (errorDetails.action) {
        return <ToastAction altText={errorDetails.action.label} onClick={errorDetails.action.handler}>
          {errorDetails.action.label}
        </ToastAction>;
      }
      if (errorDetails.retryable) {
        return <ToastAction altText="Retry" onClick={() => window.location.reload()}>
          Retry
        </ToastAction>;
      }
      return undefined;
    };

    const toastProps: Record<string, unknown> = {
      title: getErrorTitle(errorDetails.type),
      description: userMessage,
      variant: 'destructive' as const,
    };
    
    const action = getToastAction();
    if (action !== undefined) {
      toastProps['action'] = action;
    }

    toast(toastProps);

    // Log error for debugging
    logger.error(`Error in ${context || 'unknown context'}:`, errorDetails as unknown as Record<string, unknown>);

    // In production, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { context, extra: errorDetails });
  }, [toast]);

  const handleAsyncError = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    context?: string,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return fallbackValue;
    }
  }, [handleError]);

  const createError = useCallback((
    type: ErrorType,
    message: string,
    options?: Partial<Omit<ErrorDetails, 'type' | 'message'>>
  ): ErrorDetails => {
    return {
      type,
      message,
      ...options,
    };
  }, []);

  return {
    handleError,
    handleAsyncError,
    createError,
  };
}

function getUserFriendlyMessage(errorDetails: ErrorDetails, context?: string): string {
  const { type, message } = errorDetails;

  switch (type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case 'validation':
      return `Invalid input: ${message}`;
    
    case 'permission':
      return 'You don\'t have permission to perform this action.';
    
    case 'notFound':
      return 'The requested resource was not found.';
    
    case 'server':
      return 'Server error occurred. Please try again later.';
    
    default:
      return context ? `${context}: ${message}` : message;
  }
}

function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case 'network':
      return 'Connection Error';
    case 'validation':
      return 'Validation Error';
    case 'permission':
      return 'Permission Denied';
    case 'notFound':
      return 'Not Found';
    case 'server':
      return 'Server Error';
    default:
      return 'Error';
  }
}

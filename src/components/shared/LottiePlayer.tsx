'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle } from 'lucide-react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
  )
});

interface LottiePlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
  onError?: () => void;
}

export function LottiePlayer({
  url,
  className = '',
  autoPlay = true,
  loop = true,
  ariaLabel,
  onError
}: LottiePlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ${className}`}
        aria-label={ariaLabel}
      >
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-sm text-center px-2">Animation failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
      )}
      
      {/* Lottie animation */}
      <Lottie
        animationData={null}
        path={url}
        loop={loop}
        autoplay={autoPlay}
        onComplete={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover"
        aria-label={ariaLabel}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

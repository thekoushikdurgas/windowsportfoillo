'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';
import { logger } from '../../lib/logger';

interface FallbackImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  dataAiHint?: string;
  fallbackText?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function FallbackImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  dataAiHint,
  fallbackText = 'Image failed to load',
  onLoad,
  onError
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    if (process.env['NODE_ENV'] === 'development') {
      logger.debug('FallbackImage - Image error', { component: 'FallbackImage', action: 'imageError', src });
    }
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    if (process.env['NODE_ENV'] === 'development') {
      logger.debug('FallbackImage - Image loaded successfully', { component: 'FallbackImage', action: 'imageLoad', src });
    }
    setImageLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ${className}`}
        // eslint-disable-next-line react/forbid-dom-props
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
      >
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-sm text-center px-2">{fallbackText}</span>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className,
    onError: handleImageError,
    onLoad: handleImageLoad,
    priority,
    quality,
    ...(dataAiHint && { 'data-ai-hint': dataAiHint }),
    ...(fill ? { fill: true } : { width: width || 300, height: height || 200 })
  };

  return (
    <div 
      className="relative" 
      // eslint-disable-next-line react/forbid-dom-props
      style={fill ? { width: '100%', height: '100%' } : { width, height }}
    >
      {imageLoading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}
        >
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      )}
      <Image {...imageProps} alt={alt} />
    </div>
  );
}

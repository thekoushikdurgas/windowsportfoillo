'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FallbackImage } from '@/components/shared/FallbackImage';
import { imageHover, imageLoad, skeletonPulse } from '@/lib/animations';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  dataAiHint?: string;
  fallbackText?: string;
}

export function AnimatedImage({ 
  src, 
  alt, 
  className = '', 
  dataAiHint,
  fallbackText = "Image unavailable" 
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <motion.div
      whileHover={imageHover}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <motion.div
          variants={skeletonPulse}
          animate="animate"
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg"
        />
      )}
      
      {/* Image */}
      <motion.div
        variants={imageLoad}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        className="relative w-full h-full"
      >
        <FallbackImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          {...(dataAiHint ? { dataAiHint } : {})}
          fallbackText={fallbackText}
          onLoad={handleLoad}
          onError={handleError}
        />
      </motion.div>
      
      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      />
    </motion.div>
  );
}

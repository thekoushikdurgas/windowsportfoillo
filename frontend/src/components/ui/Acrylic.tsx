'use client';

import React from 'react';
import { getAcrylicStyles, ACRYLIC_PRESETS } from '@/lib/windows11';
import { cn } from '@/lib/utils/cn';

export interface AcrylicProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Dark mode variant
   */
  isDark?: boolean;
  /**
   * Acrylic preset: 'light', 'dark', 'ultra', 'subtle'
   */
  preset?: keyof typeof ACRYLIC_PRESETS;
  /**
   * Custom opacity (overrides preset)
   */
  opacity?: number;
  /**
   * Custom blur amount (overrides preset)
   */
  blur?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Acrylic/Glassmorphism component for Windows 11 UI
 * Provides backdrop blur and transparency effects
 */
export const Acrylic: React.FC<AcrylicProps> = ({
  isDark = false,
  preset,
  opacity,
  blur,
  className,
  children,
  style,
  ...props
}) => {
  const effectivePreset = preset || (isDark ? 'dark' : 'light');
  
  // Use custom values if provided, otherwise use preset
  const acrylicStyles = opacity !== undefined || blur !== undefined
    ? {
        backgroundColor: isDark
          ? `rgba(32, 32, 32, ${opacity ?? 0.85})`
          : `rgba(243, 243, 243, ${opacity ?? 0.85})`,
        backdropFilter: `blur(${blur ?? 30}px) saturate(1.2) brightness(${isDark ? 0.9 : 1.1})`,
        WebkitBackdropFilter: `blur(${blur ?? 30}px) saturate(1.2) brightness(${isDark ? 0.9 : 1.1})`,
      }
    : getAcrylicStyles(isDark, effectivePreset);

  return (
    <div
      className={cn(
        'win11-acrylic',
        isDark ? 'win11-acrylic-dark' : 'win11-acrylic-light',
        className
      )}
      style={{
        ...acrylicStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Acrylic;


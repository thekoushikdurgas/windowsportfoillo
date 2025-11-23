'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DurgasLogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon' | 'minimal';
  color?: string;
}

/**
 * DurgasOS Logo Component
 * Reusable logo component based on the orange 'K' design
 */
export const DurgasLogo: React.FC<DurgasLogoProps> = ({
  size = 100,
  className,
  variant = 'full',
  color = '#ea580c', // Orange color matching the logo
}) => {
  const viewBox = '0 0 100 100';
  
  if (variant === 'minimal') {
    // Minimal version - just the K shape
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('durgas-logo', 'durgas-logo-minimal', className)}
        aria-label="DurgasOS Logo"
      >
        <path
          d="M20 20 L20 80 M20 50 L50 20 M20 50 L50 80"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'icon') {
    // Icon version - stylized K with modern design
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('durgas-logo', 'durgas-logo-icon', className)}
        aria-label="DurgasOS Logo"
      >
        {/* Stylized K design - inspired by the orange logo */}
        <path
          d="M15 15 L15 85 M15 50 L45 20 M15 50 L45 80 M45 20 L75 50 M45 80 L75 50"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="2" fill="none" opacity="0.2" />
      </svg>
    );
  }

  // Full version - complete logo with text
  return (
    <div className={cn('durgas-logo-container', className)}>
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('durgas-logo', 'durgas-logo-full')}
        aria-label="DurgasOS Logo"
      >
        {/* Main K shape - stylized modern design */}
        <g transform="translate(50, 50)">
          {/* Vertical stem */}
          <path
            d="M -25 -35 L -25 35"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Top diagonal */}
          <path
            d="M -25 -15 L 5 -35 L 25 -20"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Bottom diagonal */}
          <path
            d="M -25 15 L 5 35 L 25 20"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Accent curve */}
          <path
            d="M 25 -20 Q 35 -10 35 0 Q 35 10 25 20"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
};

export default DurgasLogo;


/**
 * Windows 11 Animation Utilities
 * Animation helpers and constants for smooth transitions
 */

import { ANIMATION, BORDER_RADIUS } from './windows11';

/**
 * Window animation variants
 */
export const windowAnimations = {
  open: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.normal) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  close: {
    initial: { opacity: 1, scale: 1, y: 0 },
    animate: { opacity: 0, scale: 0.95, y: 10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  minimize: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.8 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  maximize: {
    borderRadius: {
      from: BORDER_RADIUS.window,
      to: BORDER_RADIUS.windowMaximized,
    },
    transition: {
      duration: parseFloat(ANIMATION.duration.normal) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  restore: {
    borderRadius: {
      from: BORDER_RADIUS.windowMaximized,
      to: BORDER_RADIUS.window,
    },
    transition: {
      duration: parseFloat(ANIMATION.duration.normal) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
} as const;

/**
 * Menu animation variants
 */
export const menuAnimations = {
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  slideLeft: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
  slideRight: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
} as const;

/**
 * Snap layout animation variants
 */
export const snapAnimations = {
  indicator: {
    keyframes: [
      { opacity: 0.6, scale: 1 },
      { opacity: 1, scale: 1.05 },
      { opacity: 0.6, scale: 1 },
    ],
    duration: '1s',
    easing: 'ease-in-out',
    iterationCount: 'infinite',
  },
  preview: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: parseFloat(ANIMATION.duration.fast) / 1000,
      ease: ANIMATION.easing.windows,
    },
  },
} as const;

/**
 * Get CSS transition string
 */
export function getTransition(
  properties: string[] = ['all'],
  duration: string = ANIMATION.duration.normal,
  easing: string = ANIMATION.easing.windows
): string {
  return properties
    .map(prop => `${prop} ${duration} ${easing}`)
    .join(', ');
}

/**
 * Get animation duration in seconds
 */
export function getDurationSeconds(duration: string): number {
  return parseFloat(duration) / 1000;
}

/**
 * Create CSS keyframe animation
 */
export function createKeyframeAnimation(
  name: string,
  keyframes: Record<string, React.CSSProperties>
): string {
  const keyframeString = Object.entries(keyframes)
    .map(([key, styles]) => {
      const percentage = key === 'from' ? '0%' : key === 'to' ? '100%' : key;
      const styleString = Object.entries(styles)
        .map(([prop, value]) => {
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `  ${cssProp}: ${value};`;
        })
        .join('\n');
      return `${percentage} {\n${styleString}\n}`;
    })
    .join('\n');

  return `@keyframes ${name} {\n${keyframeString}\n}`;
}


'use client';

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { skeletonPulse } from '@/lib/animations';

// Type imports
import type { SystemInfoProps } from './SystemInfo';
import type { RecentActivityProps } from './RecentActivity';
import type { OnboardingTourProps } from './OnboardingTour';

// Lazy load heavy components
const SystemInfo = lazy(() => import('./SystemInfo').then(module => ({ default: module.SystemInfo })));
const RecentActivity = lazy(() => import('./RecentActivity').then(module => ({ default: module.RecentActivity })));
const OnboardingTour = lazy(() => import('./OnboardingTour').then(module => ({ default: module.OnboardingTour })));

// Loading skeleton components
function SystemInfoSkeleton() {
  return (
    <motion.div
      variants={skeletonPulse}
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 h-16"
        />
      ))}
    </motion.div>
  );
}

function RecentActivitySkeleton() {
  return (
    <motion.div
      variants={skeletonPulse}
      animate="animate"
      className="mt-6 space-y-3"
    >
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-6 w-32" />
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 h-12"
        />
      ))}
    </motion.div>
  );
}

// Wrapped components with loading states
export function LazySystemInfo(props: SystemInfoProps) {
  return (
    <Suspense fallback={<SystemInfoSkeleton />}>
      <SystemInfo {...props} />
    </Suspense>
  );
}

export function LazyRecentActivity(props: RecentActivityProps) {
  return (
    <Suspense fallback={<RecentActivitySkeleton />}>
      <RecentActivity {...props} />
    </Suspense>
  );
}

export function LazyOnboardingTour(props: OnboardingTourProps) {
  return (
    <Suspense fallback={null}>
      <OnboardingTour {...props} />
    </Suspense>
  );
}

/**
 * @file Lazy loading wrapper for application components.
 * This improves initial bundle size by loading app components on demand.
 */
import React, { Suspense, lazy } from 'react';
import { AppDefinition } from '../types';

/**
 * Lazy loading wrapper for app components.
 * Shows a loading state while the component is being loaded.
 */
const LazyApp: React.FC<{ app: AppDefinition; data?: Record<string, any> }> = ({ app, data }) => {
  // Dynamically import the app component
  const LazyComponent = lazy(() => 
    import(`../apps/components`).then(module => ({
      default: module[`${app.name.replace(/\s+/g, '')}App` as keyof typeof module] as React.ComponentType<any>
    }))
  );

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
      </div>
    }>
      <LazyComponent {...data} />
    </Suspense>
  );
};

export default LazyApp;

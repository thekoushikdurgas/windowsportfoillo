'use client';

import { Suspense, lazy, ComponentType, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LazyAppProps {
  appId: string;
  data?: Record<string, unknown>;
}

// Loading component
function AppLoading() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card variant="glass" className="p-8 hover:scale-105 transition-all duration-200">
        <CardContent className="p-0 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-white/20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Loading Application
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we prepare your experience...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Error fallback for individual apps
function AppError({ appId, onRetry }: { appId: string; onRetry: () => void }) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-8">
      <Card variant="glass" className="p-8 hover:scale-105 transition-all duration-200 border-red-200/50 dark:border-red-800/50">
        <CardContent className="p-0 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto border border-red-200/50 dark:border-red-800/50">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to load {appId}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              The application encountered an error while loading. Please try again.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Preload function for better performance
const preloadApp = (appId: string) => {
  const appImportMap: Record<string, () => Promise<unknown>> = {
    'welcome': () => import('@/components/apps/Welcome'),
    'about': () => import('@/components/apps/AboutMe'),
    'portfolio': () => import('@/components/apps/Portfolio'),
    'explorer': () => import('@/components/apps/FileExplorer'),
    'browser': () => import('@/components/apps/Browser'),
    'store': () => import('@/components/apps/AppStore'),
    'settings': () => import('@/components/apps/Settings'),
    'notepad': () => import('@/components/apps/Notepad'),
    'terminal': () => import('@/components/apps/Terminal'),
    'video': () => import('@/components/apps/VideoPlayer'),
    'creator-studio': () => import('@/components/apps/CreatorStudio'),
    'gemini-chat': () => import('@/components/apps/GeminiChat'),
    'live-assistant': () => import('@/components/apps/LiveAssistant'),
  };
  
  const importFn = appImportMap[appId];
  if (importFn) {
    importFn();
  }
};

// Lazy load app components with chunk optimization
const appComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  'welcome': lazy(() => import(/* webpackChunkName: "welcome" */ '@/components/apps/Welcome')),
  'about': lazy(() => import(/* webpackChunkName: "about" */ '@/components/apps/AboutMe')),
  'portfolio': lazy(() => import(/* webpackChunkName: "portfolio" */ '@/components/apps/Portfolio')),
  'explorer': lazy(() => import(/* webpackChunkName: "explorer" */ '@/components/apps/FileExplorer')),
  'browser': lazy(() => import(/* webpackChunkName: "browser" */ '@/components/apps/Browser')),
  'store': lazy(() => import(/* webpackChunkName: "store" */ '@/components/apps/AppStore')),
  'settings': lazy(() => import(/* webpackChunkName: "settings" */ '@/components/apps/Settings')),
  'notepad': lazy(() => import(/* webpackChunkName: "notepad" */ '@/components/apps/Notepad')),
  'terminal': lazy(() => import(/* webpackChunkName: "terminal" */ '@/components/apps/Terminal')),
  'video': lazy(() => import(/* webpackChunkName: "video" */ '@/components/apps/VideoPlayer')),
  'creator-studio': lazy(() => import(/* webpackChunkName: "creator-studio" */ '@/components/apps/CreatorStudio')),
  'gemini-chat': lazy(() => import(/* webpackChunkName: "gemini-chat" */ '@/components/apps/GeminiChat')),
  'live-assistant': lazy(() => import(/* webpackChunkName: "live-assistant" */ '@/components/apps/LiveAssistant')),
};

export function LazyApp({ appId, data }: LazyAppProps) {
  const AppComponent = appComponents[appId] as ComponentType<{ data?: unknown }> | undefined;

  // Preload related apps for better UX
  useEffect(() => {
    const preloadRelatedApps = () => {
      // Preload commonly used apps
      const commonApps = ['settings', 'explorer', 'notepad'];
      commonApps.forEach(app => {
        if (app !== appId) {
          preloadApp(app);
        }
      });
    };

    // Delay preloading to not interfere with current app loading
    const timeoutId = setTimeout(preloadRelatedApps, 1000);
    return () => clearTimeout(timeoutId);
  }, [appId]);

  if (!AppComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card variant="glass" className="p-8 hover:scale-105 transition-all duration-200">
          <CardContent className="p-0 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto border border-white/20">
              <HelpCircle className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                App not found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The application &quot;{appId}&quot; could not be found in the system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<AppError appId={appId} onRetry={() => window.location.reload()} />}
    >
      <Suspense fallback={<AppLoading />}>
        <AppComponent data={data} />
      </Suspense>
    </ErrorBoundary>
  );
}

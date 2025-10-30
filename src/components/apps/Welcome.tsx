'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useDesktop } from '@/context/DesktopContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { AnimatedButton } from './welcome/AnimatedButton';
import { AnimatedImage } from './welcome/AnimatedImage';
import { LazySystemInfo, LazyRecentActivity, LazyOnboardingTour } from './welcome/LazyComponents';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  type: 'app' | 'file' | 'project';
  name: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Welcome() {
  const { openApp } = useDesktop();
  const { theme } = useTheme();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  // Performance monitoring
  const { metrics, measureLoadTime, measureRenderTime } = usePerformanceMonitor({
    updateInterval: 10000, // Update every 10 seconds
    enableMemoryMonitoring: true,
    enableCPUMonitoring: true
  });
  
  const heroImage = PlaceHolderImages.find(p => p.id === 'welcome-hero');
  
  // Mock app count - in real implementation, this would come from apps config
  const appCount = 12;

  // Initialize recent activity and first-time user detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Check if this is first time user
    const hasVisited = localStorage.getItem('durgasos-visited');
    if (!hasVisited) {
      setIsFirstTime(true);
      setShowTour(true);
      localStorage.setItem('durgasos-visited', 'true');
    }

    // Mock recent activity - in real implementation, this would come from app state
    const mockActivity: ActivityItem[] = [
      {
        id: '1',
        type: 'app',
        name: 'Portfolio App',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        icon: () => null
      },
      {
        id: '2',
        type: 'file',
        name: 'Project Documentation',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        icon: () => null
      },
      {
        id: '3',
        type: 'app',
        name: 'About Me',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        icon: () => null
      }
    ];
    setRecentActivity(mockActivity);

    // Performance monitoring setup
    const endLoadTime = measureLoadTime('Welcome Component');
    const endRenderTime = measureRenderTime('Welcome Component');
    
    // Cleanup functions
    return () => {
      endLoadTime();
      endRenderTime();
    };
  }, [measureLoadTime, measureRenderTime]);

  const handlePortfolioClick = () => {
    openApp('portfolio');
  };

  const handleAboutClick = () => {
    openApp('about');
  };

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleTourComplete = () => {
    setShowTour(false);
    setIsFirstTime(false);
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto"
        role="main"
        aria-label="Welcome to DurgasOS"
      >
      <div className="text-center space-y-6 max-w-4xl w-full">
        {/* Header Section */}
        <motion.div variants={staggerItem} className="space-y-4">
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            id="welcome-title"
          >
            Welcome to DurgasOS
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            aria-describedby="welcome-title"
          >
            A modern Windows 11 desktop simulator built with Next.js and React
          </motion.p>
          {isFirstTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
            >
              🎉 First time here? Welcome!
            </motion.div>
          )}
        </motion.div>

        {/* Hero Image */}
        {heroImage && (
          <motion.div variants={staggerItem} className="relative w-full max-w-2xl mx-auto">
            <AnimatedImage
              src={heroImage.imageUrl}
              alt={heroImage.description}
              className="w-full h-48 md:h-64 shadow-lg"
              dataAiHint={heroImage.imageHint}
              fallbackText="Welcome image unavailable"
            />
          </motion.div>
        )}

        {/* Description */}
        <motion.div variants={staggerItem} className="space-y-6">
          <motion.p 
            variants={fadeInUp}
            className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Explore the desktop environment, try out the built-in applications, and experience the power of AI integration. 
            Click on desktop icons or use the Start Menu to explore applications.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            role="group"
            aria-label="Quick actions"
          >
            <AnimatedButton 
              onClick={handlePortfolioClick}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
              aria-label="Open Portfolio application"
            >
              View Portfolio
            </AnimatedButton>
            <AnimatedButton 
              onClick={handleAboutClick}
              variant="outline"
              className="px-8 py-3 text-lg font-semibold"
              aria-label="Open About Me application"
            >
              About Me
            </AnimatedButton>
            {!isFirstTime && (
              <AnimatedButton 
                onClick={handleStartTour}
                variant="ghost"
                className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="Start guided tour"
              >
                Take a Tour
              </AnimatedButton>
            )}
          </motion.div>
        </motion.div>

        {/* System Information */}
        <motion.div variants={staggerItem}>
          <LazySystemInfo 
            theme={theme || 'light'} 
            appCount={appCount} 
            performance={metrics} 
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={staggerItem}>
          <LazyRecentActivity activities={recentActivity} maxItems={3} />
        </motion.div>

        {/* User Guidance */}
        <motion.div 
          variants={staggerItem}
          className="text-sm text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50"
          role="region"
          aria-label="Quick tips and guidance"
        >
          <p className="font-medium mb-2" id="tips-heading">💡 Quick Tips:</p>
          <ul className="text-left space-y-1 max-w-md mx-auto" aria-labelledby="tips-heading">
            <li>• Click on desktop icons to open applications</li>
            <li>• Use the Start Menu (Windows key) to access all apps</li>
            <li>• Drag windows around to organize your workspace</li>
            <li>• Right-click for context menus and options</li>
          </ul>
        </motion.div>
      </div>
      </motion.div>

      {/* Onboarding Tour */}
      <LazyOnboardingTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={handleTourComplete}
      />
    </>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

export interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DurgasOS!',
    description: 'This is your desktop simulator. Let me show you around and help you get started.',
    position: 'top'
  },
  {
    id: 'desktop-icons',
    title: 'Desktop Icons',
    description: 'Click on these icons to open applications. Try clicking on any app to see it in action!',
    target: '.desktop-icon',
    position: 'bottom'
  },
  {
    id: 'start-menu',
    title: 'Start Menu',
    description: 'Press the Windows key or click the Start button to access all your applications.',
    target: '.start-menu-button',
    position: 'top'
  },
  {
    id: 'taskbar',
    title: 'Taskbar',
    description: 'The taskbar shows your open applications. You can switch between them or close them here.',
    target: '.taskbar',
    position: 'top'
  },
  {
    id: 'windows',
    title: 'Window Management',
    description: 'You can drag windows around, resize them, and minimize/maximize them just like in real Windows.',
    position: 'top'
  },
  {
    id: 'complete',
    title: 'You\'re all set!',
    description: 'You now know the basics of DurgasOS. Feel free to explore and discover all the features!',
    position: 'top'
  }
];

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];
  if (!currentTourStep) return null;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="max-w-md w-full mx-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {currentStep + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentTourStep.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="h-8 w-8 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
                  aria-label="Skip tour"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-6">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  {currentTourStep.description}
                </motion.p>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Step {currentStep + 1} of {tourSteps.length}</span>
                    <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex space-x-2">
                  {tourSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        step.id === tourSteps[currentStep]?.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : tourSteps.findIndex(s => s.id === step.id) < currentStep
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="gradient"
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span>{isLastStep ? 'Complete' : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearn } from '@/contexts/LearnContext';

export default function TutorialOverlay() {
  const {
    activeTutorial,
    currentStep,
    isTutorialActive,
    nextStep,
    prevStep,
    completeTutorial,
    closeTutorial,
  } = useLearn();

  if (!isTutorialActive || !activeTutorial) {
    return null;
  }

  const currentStepData = activeTutorial.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === activeTutorial.steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" />
        
        {/* Tutorial Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="absolute pointer-events-auto"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg mx-4 p-8 border border-gray-200/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {activeTutorial.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Step {currentStep + 1} of {activeTutorial.steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={closeTutorial}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                {currentStepData.title}
              </h4>
              <p className="text-gray-600 leading-relaxed text-base">
                {currentStepData.description}
              </p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / activeTutorial.steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / activeTutorial.steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isFirstStep
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  ← Previous
                </button>
                <button
                  onClick={closeTutorial}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transition-all duration-200"
                >
                  Skip Tutorial
                </button>
              </div>

              <button
                onClick={isLastStep ? completeTutorial : nextStep}
                className="px-8 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isLastStep ? '🎉 Complete' : 'Next →'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

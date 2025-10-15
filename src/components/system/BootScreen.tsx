'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';

interface BootScreenProps {
  onBootComplete: () => void;
}

interface BootStage {
  id: string;
  message: string;
  progress: number;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { bootSystem } = useSystemStore();

  const bootStages: BootStage[] = useMemo(() => [
    { id: 'bios', message: 'Initializing system BIOS...', progress: 10 },
    { id: 'hardware', message: 'Detecting hardware components...', progress: 25 },
    { id: 'kernel', message: 'Loading Windows kernel...', progress: 40 },
    { id: 'services', message: 'Starting Windows services...', progress: 60 },
    { id: 'drivers', message: 'Loading device drivers...', progress: 75 },
    { id: 'shell', message: 'Starting Windows shell...', progress: 90 },
    { id: 'complete', message: 'Windows is ready', progress: 100 },
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < bootStages.length - 1) {
          const nextStage = prev + 1;
          const stageProgress = bootStages[nextStage].progress;
          setProgress(stageProgress);
          return nextStage;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            bootSystem();
            onBootComplete();
          }, 1500);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [bootSystem, onBootComplete, bootStages]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="windows-boot-screen"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-8 relative z-10">
          {/* Windows 11 Logo with authentic styling */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="windows-boot-logo"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 w-32 h-32 border-4 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner glow ring */}
              <motion.div
                className="absolute inset-2 w-28 h-28 border-2 border-white/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Windows logo */}
              <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-white text-3xl font-light tracking-wide"
          >
            Windows 11
          </motion.div>

          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white/80 text-lg text-center min-h-[1.5rem]"
          >
            {bootStages[currentStage]?.message || 'Loading...'}
          </motion.div>

          {/* Progress bar with Windows 11 styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-96 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-white/80 text-sm font-light tracking-wide"
          >
            {Math.round(progress)}%
          </motion.div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-white/95 text-lg font-light"
            >
              <motion.div
                className="w-4 h-4 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Welcome to Windows 11
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

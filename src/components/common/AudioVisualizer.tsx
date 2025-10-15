'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
  volume: number;
  frequency?: number;
  className?: string;
}

export default function AudioVisualizer({ 
  isPlaying, 
  volume, 
  frequency = 1000, 
  className = '' 
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  // const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barCount = 32;
    const barWidth = canvas.width / barCount;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate bars based on volume and frequency
      const newBars = Array.from({ length: barCount }, (_, i) => {
        if (isPlaying) {
          const baseHeight = (volume * canvas.height * 0.8);
          const frequencyFactor = Math.sin((i * 0.3) + (Date.now() * 0.01)) * 0.3 + 0.7;
          const randomFactor = Math.random() * 0.4 + 0.6;
          return baseHeight * frequencyFactor * randomFactor;
        }
        return 0;
      });

      // setBars(newBars);

      // Draw bars
      newBars.forEach((height, i) => {
        const x = i * barWidth;
        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#60a5fa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, canvas.height - height, barWidth - 2, height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, volume, frequency]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="w-full h-full rounded-lg bg-gray-100 dark:bg-gray-800"
      />
      {isPlaying && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </motion.div>
      )}
    </div>
  );
}

// Simple volume indicator component
interface VolumeIndicatorProps {
  volume: number;
  maxVolume?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VolumeIndicator({ 
  volume, 
  maxVolume = 1, 
  size = 'md',
  className = '' 
}: VolumeIndicatorProps) {
  const percentage = (volume / maxVolume) * 100;
  
  const sizeClasses = {
    sm: 'w-16 h-2',
    md: 'w-24 h-3',
    lg: 'w-32 h-4'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// Audio waveform component
interface AudioWaveformProps {
  isActive: boolean;
  frequency: number;
  amplitude: number;
  className?: string;
}

export function AudioWaveform({ 
  isActive, 
  frequency, 
  amplitude, 
  className = '' 
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isActive) {
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x += 2) {
          const y = canvas.height / 2 + 
            Math.sin((x * frequency * 0.01) + (Date.now() * 0.005)) * amplitude * 20;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, frequency, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={40}
      className={`w-full h-full ${className}`}
    />
  );
}

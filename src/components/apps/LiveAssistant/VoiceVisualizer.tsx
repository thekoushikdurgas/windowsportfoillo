'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface VoiceVisualizerProps {
  audioLevel: number;
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'connecting' | 'error';
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  audioLevel,
  status,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [animationPhase, setAnimationPhase] = useState(0);

  const drawThinkingAnimation = useCallback((
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    maxRadius: number, 
    primaryColor: string, 
    secondaryColor: string
  ) => {
    const dots = 3;
    const dotRadius = maxRadius * 0.1;
    const spacing = maxRadius * 0.3;
    
    for (let i = 0; i < dots; i++) {
      const dotX = x + (i - 1) * spacing;
      const dotY = y + Math.sin(animationPhase + i * Math.PI / 3) * 10;
      const alpha = (Math.sin(animationPhase + i * Math.PI / 3) + 1) / 2;
      
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [animationPhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 20;

      // Set colors based on status
      let primaryColor = '#10b981'; // green
      let secondaryColor = '#34d399'; // light green
      const backgroundColor = '#f8fafc'; // light gray

      switch (status) {
        case 'listening':
          primaryColor = '#3b82f6'; // blue
          secondaryColor = '#60a5fa'; // light blue
          break;
        case 'thinking':
          primaryColor = '#f59e0b'; // amber
          secondaryColor = '#fbbf24'; // light amber
          break;
        case 'speaking':
          primaryColor = '#8b5cf6'; // purple
          secondaryColor = '#a78bfa'; // light purple
          break;
        case 'connecting':
          primaryColor = '#6b7280'; // gray
          secondaryColor = '#9ca3af'; // light gray
          break;
        case 'error':
          primaryColor = '#ef4444'; // red
          secondaryColor = '#f87171'; // light red
          break;
        case 'idle':
        default:
          primaryColor = '#10b981'; // green
          secondaryColor = '#34d399'; // light green
          break;
      }

      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (status === 'idle') {
        // Draw microphone icon for idle state
        drawMicrophoneIcon(ctx, centerX, centerY, maxRadius * 0.4, primaryColor);
      } else if (status === 'connecting') {
        // Draw loading spinner
        drawLoadingSpinner(ctx, centerX, centerY, maxRadius * 0.6, primaryColor);
      } else if (status === 'error') {
        // Draw error icon
        drawErrorIcon(ctx, centerX, centerY, maxRadius * 0.4, primaryColor);
      } else {
        // Draw animated visualizer based on audio level and status
        if (status === 'listening' || status === 'speaking') {
          drawAudioVisualizer(ctx, centerX, centerY, maxRadius, audioLevel, primaryColor, secondaryColor);
        } else if (status === 'thinking') {
          drawThinkingAnimation(ctx, centerX, centerY, maxRadius, primaryColor, secondaryColor);
        }
      }

      // Draw status text
      drawStatusText(ctx, centerX, centerY + maxRadius + 30, status);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioLevel, status, drawThinkingAnimation]);

  // Animation phase for thinking state
  useEffect(() => {
    if (status === 'thinking') {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 0.1) % (2 * Math.PI));
      }, 50);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [status]);

  const drawMicrophoneIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Microphone body
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.6);
    ctx.lineTo(x, y + size * 0.2);
    ctx.stroke();

    // Microphone head
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.3, 0, 2 * Math.PI);
    ctx.stroke();

    // Microphone stand
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y + size * 0.2);
    ctx.lineTo(x + size * 0.2, y + size * 0.2);
    ctx.stroke();
  };

  const drawErrorIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // X shape
    ctx.beginPath();
    ctx.moveTo(x - size * 0.4, y - size * 0.4);
    ctx.lineTo(x + size * 0.4, y + size * 0.4);
    ctx.moveTo(x + size * 0.4, y - size * 0.4);
    ctx.lineTo(x - size * 0.4, y + size * 0.4);
    ctx.stroke();
  };

  const drawLoadingSpinner = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    const time = Date.now() * 0.005;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    for (let i = 0; i < 8; i++) {
      const angle = (time + i * Math.PI / 4) % (2 * Math.PI);
      const alpha = (Math.sin(angle) + 1) / 2;
      ctx.globalAlpha = alpha;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, i * Math.PI / 4, (i + 0.5) * Math.PI / 4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const drawAudioVisualizer = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    maxRadius: number, 
    level: number, 
    primaryColor: string, 
    secondaryColor: string
  ) => {
    const bars = 12;
    const barWidth = 4;
    const maxBarHeight = maxRadius * 0.8;
    
    for (let i = 0; i < bars; i++) {
      const angle = (i * 2 * Math.PI) / bars;
      const barHeight = Math.max(4, level * maxBarHeight * (0.5 + Math.random() * 0.5));
      
      const startX = x + Math.cos(angle) * (maxRadius * 0.3);
      const startY = y + Math.sin(angle) * (maxRadius * 0.3);
      const endX = x + Math.cos(angle) * (maxRadius * 0.3 + barHeight);
      const endY = y + Math.sin(angle) * (maxRadius * 0.3 + barHeight);
      
      ctx.strokeStyle = i % 2 === 0 ? primaryColor : secondaryColor;
      ctx.lineWidth = barWidth;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(x, y, maxRadius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = primaryColor;
    ctx.fill();
  };

  const drawStatusText = (ctx: CanvasRenderingContext2D, x: number, y: number, status: string) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    const statusText = {
      'idle': 'Ready to listen',
      'listening': 'Listening...',
      'thinking': 'Thinking...',
      'speaking': 'Speaking...',
      'connecting': 'Connecting...',
      'error': 'Connection error'
    }[status] || 'Unknown';
    
    ctx.fillText(statusText, x, y);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="rounded-full shadow-lg max-w-full h-auto"
      />
    </div>
  );
};

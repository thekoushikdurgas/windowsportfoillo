'use client';

import { motion } from 'framer-motion';

interface AppIconProps {
  icon: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AppIcon({ 
  icon, 
  name, 
  size = 'medium', 
  isActive = false, 
  onClick,
  className = ''
}: AppIconProps) {
  const sizeClasses = {
    small: 'w-6 h-6 text-lg',
    medium: 'w-8 h-8 text-xl',
    large: 'w-12 h-12 text-2xl',
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-150 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-lg ${
        isActive ? 'bg-windows-blue text-white' : 'bg-windows-surface hover:bg-windows-surface-hover'
      }`}>
        {icon}
      </div>
      {size !== 'small' && (
        <span className="text-xs text-center mt-1 font-medium text-windows-text">
          {name}
        </span>
      )}
    </motion.div>
  );
}

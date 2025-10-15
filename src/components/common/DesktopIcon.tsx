'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DesktopIcon as DesktopIconType } from '@/types/system';

interface DesktopIconProps {
  icon: DesktopIconType;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ icon, onDoubleClick }: DesktopIconProps) {

  return (
      <motion.div
      className={`windows-desktop-icon ${icon.isSelected ? 'selected' : ''}`}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      onDoubleClick={onDoubleClick}
      whileHover={{ 
        scale: 1.1, 
        y: -5,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300
        }
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: icon.isSelected ? -2 : 0,
        scale: icon.isSelected ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      style={{ width: 80, height: 80 }}
    >
      <div className="text-4xl mb-1">
        {icon.icon}
      </div>
      <div className="text-xs text-center font-medium leading-tight max-w-16 break-words">
        {icon.name}
      </div>
      
      {/* Selection indicator */}
      {icon.isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-windows-blue/20 rounded-lg border-2 border-windows-blue"
        />
      )}
    </motion.div>
  );
}

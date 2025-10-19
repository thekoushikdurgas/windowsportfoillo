'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { DesktopIcon as DesktopIconType } from '@/types/desktop'

interface DesktopIconProps {
  icon: DesktopIconType
  onClick: () => void
  onDoubleClick: () => void
}

export default function DesktopIcon({ icon, onClick, onDoubleClick }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
    onClick()
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDoubleClick()
  }

  return (
    <motion.div
      className={`desktop-icon ${isSelected ? 'bg-white bg-opacity-20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      <div className="desktop-icon-icon flex items-center justify-center">
        {icon.icon.startsWith('data:') || icon.icon.startsWith('/') ? (
          <img
            src={icon.icon}
            alt={icon.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <div className="w-12 h-12 bg-windows-blue rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {icon.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="desktop-icon-label max-w-20">
        <motion.span
          animate={{
            color: isHovered ? '#ffffff' : '#ffffff',
          }}
          className="text-shadow-sm"
        >
          {icon.name}
        </motion.span>
      </div>

      {/* Selection highlight */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-white border-opacity-50 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  )
}

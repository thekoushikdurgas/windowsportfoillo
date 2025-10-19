'use client'

import { motion } from 'framer-motion'
import { useDesktopState } from '@/store/desktopStore'

interface StartButtonProps {
  onClick: () => void
}

export default function StartButton({ onClick }: StartButtonProps) {
  const { startMenuOpen } = useDesktopState()

  return (
    <motion.button
      className={`
        taskbar-icon flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200
        ${startMenuOpen ? 'bg-white bg-opacity-30' : 'hover:bg-white hover:bg-opacity-20'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: startMenuOpen ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
      }}
    >
      {/* Windows Logo */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="text-white"
      >
        <path d="M9.5 3L2.5 3L2.5 9L9.5 9L9.5 3Z" fill="currentColor" />
        <path d="M17.5 3L10.5 3L10.5 9L17.5 9L17.5 3Z" fill="currentColor" />
        <path d="M9.5 10L2.5 10L2.5 16L9.5 16L9.5 10Z" fill="currentColor" />
        <path d="M17.5 10L10.5 10L10.5 16L17.5 16L17.5 10Z" fill="currentColor" />
      </svg>
    </motion.button>
  )
}

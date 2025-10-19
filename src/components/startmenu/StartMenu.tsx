'use client'

import { motion } from 'framer-motion'
import { useDesktopActions } from '@/store/desktopStore'
import StartMenuGrid from './StartMenuGrid'
import StartMenuSearch from './StartMenuSearch'
import StartMenuUser from './StartMenuUser'

export default function StartMenu() {
  const { closeStartMenu } = useDesktopActions()

  return (
    <motion.div
      className="start-menu absolute bottom-12 left-2 w-96 h-96 p-4 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] max-w-[calc(100vw-1rem)] max-h-[calc(100vh-6rem)]"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
    >
      {/* Start Menu Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Start</h2>
        <button
          onClick={closeStartMenu}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Search Bar */}
      <StartMenuSearch />

      {/* User Profile */}
      <StartMenuUser />

      {/* Application Grid */}
      <StartMenuGrid />

      {/* Power Options */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="text-white hover:text-gray-300 transition-colors">
              Settings
            </button>
            <span className="text-gray-500">|</span>
            <button className="text-white hover:text-gray-300 transition-colors">
              Power
            </button>
          </div>
          <button className="text-white hover:text-gray-300 transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </motion.div>
  )
}

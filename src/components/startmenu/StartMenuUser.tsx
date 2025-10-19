'use client'

import { motion } from 'framer-motion'
import { User, Settings, Power } from 'lucide-react'

export default function StartMenuUser() {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer">
        {/* User Avatar */}
        <motion.div
          className="w-10 h-10 bg-windows-blue rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <User className="w-6 h-6 text-white" />
        </motion.div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-white text-sm font-medium">Durgas User</h3>
          <p className="text-gray-400 text-xs">Administrator</p>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </motion.button>
          
          <motion.button
            className="p-1 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Power Options"
          >
            <Power className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

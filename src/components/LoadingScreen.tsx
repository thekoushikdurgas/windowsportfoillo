'use client'

import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50"
    >
      {/* Loading Screen Component */}
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-4 bg-windows-blue rounded-full flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">D</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">DurgasOS</h1>
          <p className="text-gray-300">Loading your desktop experience...</p>
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="w-80 bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="bg-windows-blue h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    </motion.div>
  )
}

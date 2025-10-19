'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="boot-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="boot-logo"
      >
        {/* DurgasOS Logo */}
        <div className="text-center mb-8">
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
        </div>

        {/* Loading Progress Bar */}
        <div className="w-80 bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="bg-windows-blue h-2 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          key={Math.floor(progress / 20)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300 text-sm"
        >
          {progress < 20 && "Initializing system..."}
          {progress >= 20 && progress < 40 && "Loading applications..."}
          {progress >= 40 && progress < 60 && "Preparing desktop..."}
          {progress >= 60 && progress < 80 && "Loading user preferences..."}
          {progress >= 80 && progress < 100 && "Almost ready..."}
          {progress >= 100 && "Welcome to DurgasOS!"}
        </motion.p>

        {/* Loading Spinner */}
        {!isComplete && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto mt-4"
          />
        )}
      </motion.div>
    </div>
  )
}

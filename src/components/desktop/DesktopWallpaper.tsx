'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DesktopWallpaperProps {
  wallpaper: string
}

export default function DesktopWallpaper({ wallpaper }: DesktopWallpaperProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [wallpaper])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // Default Windows 11 wallpaper gradient
  const defaultGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!imageError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <img
            src={wallpaper}
            alt="Desktop Wallpaper"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </motion.div>
      ) : (
        <div 
          className="w-full h-full" 
          style={{ background: defaultGradient }}
        />
      )}
      
      {/* Overlay for better contrast with desktop icons */}
      <div className="absolute inset-0 bg-black bg-opacity-10" />
    </div>
  )
}

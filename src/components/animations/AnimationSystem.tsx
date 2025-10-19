'use client'

import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Animation variants
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
}

export const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
}

export const rotateVariants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: { rotate: 0, opacity: 1 },
  exit: { rotate: 180, opacity: 0 }
}

export const bounceVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { y: -50, opacity: 0 }
}

export const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

// Micro-interaction components
export const HoverScale = ({ 
  children, 
  scale = 1.05, 
  duration = 0.2 
}: { 
  children: React.ReactNode
  scale?: number
  duration?: number
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

export const TapScale = ({ 
  children, 
  scale = 0.95, 
  duration = 0.1 
}: { 
  children: React.ReactNode
  scale?: number
  duration?: number
}) => {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

export const HoverLift = ({ 
  children, 
  y = -5, 
  shadow = '0 10px 25px rgba(0,0,0,0.2)' 
}: { 
  children: React.ReactNode
  y?: number
  shadow?: string
}) => {
  return (
    <motion.div
      whileHover={{ 
        y, 
        boxShadow: shadow,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}

export const RippleEffect = ({ 
  children, 
  color = 'rgba(255,255,255,0.3)' 
}: { 
  children: React.ReactNode
  color?: string
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export const ShakeAnimation = ({ 
  children, 
  trigger = false 
}: { 
  children: React.ReactNode
  trigger?: boolean
}) => {
  const controls = useAnimation()

  useEffect(() => {
    if (trigger) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      })
    }
  }, [trigger, controls])

  return (
    <motion.div animate={controls}>
      {children}
    </motion.div>
  )
}

export const PulseAnimation = ({ 
  children, 
  scale = 1.1, 
  duration = 1 
}: { 
  children: React.ReactNode
  scale?: number
  duration?: number
}) => {
  return (
    <motion.div
      animate={{ scale: [1, scale, 1] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
    >
      {children}
    </motion.div>
  )
}

export const FloatingAnimation = ({ 
  children, 
  y = 10, 
  duration = 2 
}: { 
  children: React.ReactNode
  y?: number
  duration?: number
}) => {
  return (
    <motion.div
      animate={{ y: [0, -y, 0] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
    >
      {children}
    </motion.div>
  )
}

// Page transition components
export const PageTransition = ({ 
  children, 
  direction = 'right' 
}: { 
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'left': return { x: -100, opacity: 0 }
      case 'right': return { x: 100, opacity: 0 }
      case 'up': return { y: -100, opacity: 0 }
      case 'down': return { y: 100, opacity: 0 }
      default: return { x: 100, opacity: 0 }
    }
  }

  const getAnimate = () => {
    switch (direction) {
      case 'left': return { x: 0, opacity: 1 }
      case 'right': return { x: 0, opacity: 1 }
      case 'up': return { y: 0, opacity: 1 }
      case 'down': return { y: 0, opacity: 1 }
      default: return { x: 0, opacity: 1 }
    }
  }

  const getExit = () => {
    switch (direction) {
      case 'left': return { x: 100, opacity: 0 }
      case 'right': return { x: -100, opacity: 0 }
      case 'up': return { y: 100, opacity: 0 }
      case 'down': return { y: -100, opacity: 0 }
      default: return { x: -100, opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      animate={getAnimate()}
      exit={getExit()}
      transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Loading animations
export const LoadingSpinner = ({ 
  size = 24, 
  color = '#3B82F6' 
}: { 
  size?: number
  color?: string
}) => {
  return (
    <motion.div
      className="border-2 border-gray-300 border-t-blue-500 rounded-full"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export const LoadingDots = ({ 
  color = '#3B82F6' 
}: { 
  color?: string
}) => {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map(index => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            delay: index * 0.2 
          }}
        />
      ))}
    </div>
  )
}

export const LoadingBar = ({ 
  progress = 0, 
  color = '#3B82F6' 
}: { 
  progress?: number
  color?: string
}) => {
  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

// Gesture-based animations
export const SwipeAnimation = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown 
}: { 
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const controls = useAnimation()

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100
    const velocity = info.velocity

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (info.offset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (Math.abs(info.offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (info.offset.y > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    } else {
      controls.start({ x: 0, y: 0 })
    }
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  )
}

// Parallax scrolling
export const ParallaxScroll = ({ 
  children, 
  offset = 50 
}: { 
  children: React.ReactNode
  offset?: number
}) => {
  const y = useMotionValue(0)
  const yTransform = useTransform(y, [-300, 300], [-offset, offset])

  return (
    <motion.div
      style={{ y: yTransform }}
      onViewportEnter={() => y.set(0)}
      onViewportLeave={() => y.set(100)}
    >
      {children}
    </motion.div>
  )
}

// Morphing animations
export const MorphingIcon = ({ 
  variants, 
  currentVariant 
}: { 
  variants: Record<string, any>
  currentVariant: string
}) => {
  return (
    <motion.div
      variants={variants}
      animate={currentVariant}
      transition={{ duration: 0.3 }}
    />
  )
}

// Stagger animations
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode
  staggerDelay?: number
}) => {
  return (
    <motion.div
      variants={staggerVariants}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: staggerDelay }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ 
  children 
}: { 
  children: React.ReactNode
}) => {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}

// Animation presets
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  },
  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  },
  slideInFromTop: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  },
  slideInFromBottom: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  },
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  },
  rotateIn: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 },
    transition: { duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }
  }
}

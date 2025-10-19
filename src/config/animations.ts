// Optimized animation configurations for better performance

export const windowAnimations = {
  open: {
    opacity: [0, 1],
    scale: [0.8, 1],
    y: [-20, 0],
    transition: {
      duration: 0.2,
      ease: [0.1, 0.9, 0.2, 1]
    }
  },
  close: {
    opacity: [1, 0],
    scale: [1, 0.8],
    y: [0, -20],
    transition: {
      duration: 0.15,
      ease: [0.1, 0.9, 0.2, 1]
    }
  },
  minimize: {
    scale: [1, 0.8],
    opacity: [1, 0.7],
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  maximize: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.2,
      ease: [0.1, 0.9, 0.2, 1]
    }
  }
}

export const startMenuAnimations = {
  open: {
    opacity: [0, 1],
    y: [20, 0],
    scale: [0.95, 1],
    transition: {
      duration: 0.3,
      ease: [0.1, 0.9, 0.2, 1]
    }
  },
  close: {
    opacity: [1, 0],
    y: [0, 20],
    scale: [1, 0.95],
    transition: {
      duration: 0.2,
      ease: [0.1, 0.9, 0.2, 1]
    }
  }
}

export const taskbarAnimations = {
  iconHover: {
    scale: [1, 1.1],
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  iconClick: {
    scale: [1, 0.95, 1],
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
}

export const desktopAnimations = {
  iconHover: {
    scale: [1, 1.05],
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  iconClick: {
    scale: [1, 0.95, 1],
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  }
}

export const contextMenuAnimations = {
  open: {
    opacity: [0, 1],
    scale: [0.95, 1],
    y: [-10, 0],
    transition: {
      duration: 0.15,
      ease: [0.1, 0.9, 0.2, 1]
    }
  },
  close: {
    opacity: [1, 0],
    scale: [1, 0.95],
    y: [0, -10],
    transition: {
      duration: 0.1,
      ease: [0.1, 0.9, 0.2, 1]
    }
  }
}

// Reduced motion preferences
export const reducedMotionAnimations = {
  window: {
    open: { opacity: [0, 1] },
    close: { opacity: [1, 0] }
  },
  startMenu: {
    open: { opacity: [0, 1] },
    close: { opacity: [1, 0] }
  },
  taskbar: {
    iconHover: {},
    iconClick: {}
  },
  desktop: {
    iconHover: {},
    iconClick: {}
  },
  contextMenu: {
    open: { opacity: [0, 1] },
    close: { opacity: [1, 0] }
  }
}

// Check for reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get appropriate animations based on user preference
export const getAnimations = () => {
  return shouldReduceMotion() ? reducedMotionAnimations : {
    window: windowAnimations,
    startMenu: startMenuAnimations,
    taskbar: taskbarAnimations,
    desktop: desktopAnimations,
    contextMenu: contextMenuAnimations
  }
}

import { Variants } from 'framer-motion';

// Animation variants for Welcome app
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  },
  transition: { 
    duration: 0.6, 
      ease: "easeOut" as const
  }
};

export const fadeInLeft = {
  initial: { 
    opacity: 0, 
    x: -20 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: 0.5, 
      ease: "easeOut" as const
  }
};

export const fadeInRight = {
  initial: { 
    opacity: 0, 
    x: 20 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: 0.5, 
      ease: "easeOut" as const
  }
};

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1 
  },
  transition: { 
    duration: 0.4, 
      ease: "easeOut" as const
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  }
};

// Button animations
export const buttonHover = {
  scale: 1.05,
  transition: { 
    duration: 0.2, 
    ease: "easeInOut" as const
  }
};

export const buttonTap = {
  scale: 0.95,
  transition: { 
    duration: 0.1 
  }
};

// Image animations
export const imageHover = {
  scale: 1.02,
  transition: { 
    duration: 0.3, 
    ease: "easeInOut" as const
  }
};

export const imageLoad = {
  initial: { 
    opacity: 0, 
    scale: 0.8 
  },
  animate: { 
    opacity: 1, 
    scale: 1 
  },
  transition: { 
    duration: 0.5, 
      ease: "easeOut" as const
  }
};

// Ripple effect animation
export const rippleEffect = {
  initial: { 
    scale: 0, 
    opacity: 0.6 
  },
  animate: { 
    scale: 4, 
    opacity: 0 
  },
  transition: { 
    duration: 0.6, 
      ease: "easeOut" as const
  }
};

// Loading skeleton animation
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// System info card animations
export const cardHover = {
  y: -4,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { 
    duration: 0.2, 
    ease: "easeInOut" as const
  }
};

// Activity timeline animations
export const timelineItem = {
  initial: { 
    opacity: 0, 
    x: -20 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: 0.3, 
      ease: "easeOut" as const
  }
};

// Tooltip animations
export const tooltipFade = {
  initial: { 
    opacity: 0, 
    y: 10 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  },
  exit: { 
    opacity: 0, 
    y: 10 
  },
  transition: { 
    duration: 0.2, 
      ease: "easeOut" as const
  }
};

// Page transition animations
export const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0 
  },
  exit: { 
    opacity: 0, 
    y: -20 
  },
  transition: { 
    duration: 0.3, 
    ease: "easeInOut" 
  }
};

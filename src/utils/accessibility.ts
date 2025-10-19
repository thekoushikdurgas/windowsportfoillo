import { useEffect, useRef, useCallback } from 'react'

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus management
export const focusElement = (element: HTMLElement | null) => {
  if (element) {
    element.focus()
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export const focusNextElement = (currentElement: HTMLElement) => {
  const focusableElements = getFocusableElements()
  const currentIndex = focusableElements.indexOf(currentElement)
  const nextElement = focusableElements[currentIndex + 1]
  
  if (nextElement) {
    focusElement(nextElement)
  }
}

export const focusPreviousElement = (currentElement: HTMLElement) => {
  const focusableElements = getFocusableElements()
  const currentIndex = focusableElements.indexOf(currentElement)
  const previousElement = focusableElements[currentIndex - 1]
  
  if (previousElement) {
    focusElement(previousElement)
  }
}

export const getFocusableElements = (): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '[role="option"]',
    '[role="tab"]',
    '[role="treeitem"]'
  ].join(', ')

  return Array.from(document.querySelectorAll(focusableSelectors)) as HTMLElement[]
}

// Keyboard navigation
export const createKeyboardNavigation = (
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void,
  onEnter?: () => void,
  onEscape?: () => void,
  onTab?: () => void,
  onShiftTab?: () => void
) => {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        event.preventDefault()
        onArrowDown?.()
        break
      case 'ArrowLeft':
        event.preventDefault()
        onArrowLeft?.()
        break
      case 'ArrowRight':
        event.preventDefault()
        onArrowRight?.()
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        onEnter?.()
        break
      case 'Escape':
        event.preventDefault()
        onEscape?.()
        break
      case 'Tab':
        if (event.shiftKey) {
        event.preventDefault()
          onShiftTab?.()
        } else {
          onTab?.()
        }
        break
    }
  }
}

// ARIA attributes helpers
export const createAriaProps = (props: {
  label?: string
  description?: string
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
  hidden?: boolean
  live?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  controls?: string
  describedBy?: string
  labelledBy?: string
  owns?: string
  role?: string
}) => {
  const ariaProps: Record<string, string | boolean> = {}

  if (props.label) ariaProps['aria-label'] = props.label
  if (props.description) ariaProps['aria-description'] = props.description
  if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded
  if (props.selected !== undefined) ariaProps['aria-selected'] = props.selected
  if (props.disabled !== undefined) ariaProps['aria-disabled'] = props.disabled
  if (props.hidden !== undefined) ariaProps['aria-hidden'] = props.hidden
  if (props.live) ariaProps['aria-live'] = props.live
  if (props.atomic !== undefined) ariaProps['aria-atomic'] = props.atomic
  if (props.controls) ariaProps['aria-controls'] = props.controls
  if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy
  if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy
  if (props.owns) ariaProps['aria-owns'] = props.owns
  if (props.role) ariaProps['role'] = props.role

  return ariaProps
}

// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  const trapRef = useRef<HTMLDivElement>(null)

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!isActive || !trapRef.current) return

    const focusableElements = getFocusableElements().filter(el => 
      trapRef.current?.contains(el)
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
          if (document.activeElement === firstElement) {
          event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
          event.preventDefault()
            firstElement.focus()
        }
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', trapFocus)
      return () => document.removeEventListener('keydown', trapFocus)
    }
  }, [isActive, trapFocus])

  return trapRef
}

// High contrast mode detection
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for Windows high contrast mode
      if (window.matchMedia('(-ms-high-contrast: active)').matches) {
        setIsHighContrast(true)
        return
      }

      // Check for forced colors
      if (window.matchMedia('(forced-colors: active)').matches) {
        setIsHighContrast(true)
        return
      }

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsHighContrast(true)
        return
      }

      setIsHighContrast(false)
    }

    checkHighContrast()

    const mediaQuery = window.matchMedia('(-ms-high-contrast: active), (forced-colors: active), (prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkHighContrast)

    return () => {
      mediaQuery.removeEventListener('change', checkHighContrast)
    }
  }, [])

  return isHighContrast
}

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Color contrast ratio calculation
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color)
    if (!rgb) return 0

    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Accessibility hook for components
export const useAccessibility = (props: {
  label?: string
  description?: string
  role?: string
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const ariaProps = createAriaProps({
    ...props,
    label: props.label,
    description: props.description,
    role: props.role,
    expanded: props.expanded,
    selected: props.selected,
    disabled: props.disabled
  })

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return {
    ariaProps,
    isFocused,
    isHovered,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave
  }
}

// Skip links for keyboard navigation
export const SkipLinks = () => {
  const skipLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#search', label: 'Skip to search' }
  ]

  return (
    <div className="sr-only focus-within:not-sr-only">
      {skipLinks.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="block p-2 bg-blue-600 text-white focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

// Screen reader only text
export const ScreenReaderOnly = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Announcement component
export const Announcement = ({ 
  message, 
  priority = 'polite' 
}: { 
  message: string
  priority?: 'polite' | 'assertive' 
}) => {
  useEffect(() => {
    announceToScreenReader(message, priority)
  }, [message, priority])

  return null
}
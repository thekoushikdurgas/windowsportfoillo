import { WINDOW_CONSTANTS, DESKTOP_CONSTANTS, TASKBAR_CONSTANTS } from '@/constants'

// Type definitions
export type Position = { x: number; y: number }
export type Size = { width: number; height: number }
export type Bounds = { x: number; y: number; width: number; height: number }

// Math utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

export const distance = (p1: Position, p2: Position): number => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const angle = (p1: Position, p2: Position): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

// Position utilities
export const constrainToBounds = (
  position: Position,
  size: Size,
  bounds: Bounds
): Position => {
  return {
    x: clamp(position.x, bounds.x, bounds.x + bounds.width - size.width),
    y: clamp(position.y, bounds.y, bounds.y + bounds.height - size.height)
  }
}

export const centerInBounds = (size: Size, bounds: Bounds): Position => {
  return {
    x: bounds.x + (bounds.width - size.width) / 2,
    y: bounds.y + (bounds.height - size.height) / 2
  }
}

export const snapToGrid = (position: Position, gridSize: number): Position => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  }
}

// Size utilities
export const constrainSize = (size: Size, minSize: Size, maxSize: Size): Size => {
  return {
    width: clamp(size.width, minSize.width, maxSize.width),
    height: clamp(size.height, minSize.height, maxSize.height)
  }
}

export const aspectRatio = (size: Size): number => {
  return size.width / size.height
}

export const scaleToFit = (size: Size, targetSize: Size): Size => {
  const scale = Math.min(targetSize.width / size.width, targetSize.height / size.height)
  return {
    width: size.width * scale,
    height: size.height * scale
  }
}

// Window utilities
export const getWindowBounds = (position: Position, size: Size): Bounds => {
  return {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height
  }
}

export const isWindowInBounds = (windowBounds: Bounds, screenBounds: Bounds): boolean => {
  return (
    windowBounds.x >= screenBounds.x &&
    windowBounds.y >= screenBounds.y &&
    windowBounds.x + windowBounds.width <= screenBounds.x + screenBounds.width &&
    windowBounds.y + windowBounds.height <= screenBounds.y + screenBounds.height
  )
}

export const getWindowSnapPosition = (
  position: Position,
  size: Size,
  screenSize: Size
): { position: Position; size: Size; snapped: boolean } => {
  const snapThreshold = 50
  const halfScreen = screenSize.width / 2
  const quarterScreen = screenSize.width / 4
  const threeQuarterScreen = (screenSize.width * 3) / 4

  // Left snap
  if (position.x < snapThreshold) {
    return {
      position: { x: 0, y: position.y },
      size: { width: halfScreen, height: size.height },
      snapped: true
    }
  }

  // Right snap
  if (position.x + size.width > screenSize.width - snapThreshold) {
    return {
      position: { x: halfScreen, y: position.y },
      size: { width: halfScreen, height: size.height },
      snapped: true
    }
  }

  // Left quarter snap
  if (position.x < quarterScreen + snapThreshold && position.x > quarterScreen - snapThreshold) {
    return {
      position: { x: 0, y: position.y },
      size: { width: quarterScreen, height: size.height },
      snapped: true
    }
  }

  // Right quarter snap
  if (position.x + size.width > threeQuarterScreen - snapThreshold && position.x + size.width < threeQuarterScreen + snapThreshold) {
    return {
      position: { x: threeQuarterScreen, y: position.y },
      size: { width: quarterScreen, height: size.height },
      snapped: true
    }
  }

  return { position, size, snapped: false }
}

// Desktop utilities
export const getDesktopIconPosition = (index: number, columns: number = 6): Position => {
  const row = Math.floor(index / columns)
  const col = index % columns
  return {
    x: col * DESKTOP_CONSTANTS.ICON_GRID_SIZE + DESKTOP_CONSTANTS.ICON_SPACING,
    y: row * DESKTOP_CONSTANTS.ICON_GRID_SIZE + DESKTOP_CONSTANTS.ICON_SPACING
  }
}

export const getDesktopIconIndex = (position: Position, columns: number = 6): number => {
  const col = Math.round(position.x / DESKTOP_CONSTANTS.ICON_GRID_SIZE)
  const row = Math.round(position.y / DESKTOP_CONSTANTS.ICON_GRID_SIZE)
  return row * columns + col
}

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str
}

// Array utilities
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const groupBy = <T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export const sortBy = <T>(array: T[], keyFn: (item: T) => number | string): T[] => {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)
    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0
  })
}

// Object utilities
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

// Validation utilities
export const isValidPosition = (position: Position): boolean => {
  return typeof position.x === 'number' && typeof position.y === 'number' && 
         !isNaN(position.x) && !isNaN(position.y)
}

export const isValidSize = (size: Size): boolean => {
  return typeof size.width === 'number' && typeof size.height === 'number' &&
         size.width > 0 && size.height > 0 &&
         !isNaN(size.width) && !isNaN(size.height)
}

export const isValidBounds = (bounds: Bounds): boolean => {
  return isValidPosition({ x: bounds.x, y: bounds.y }) &&
         isValidSize({ width: bounds.width, height: bounds.height })
}

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Event utilities
export const preventDefault = (e: Event) => {
  e.preventDefault()
}

export const stopPropagation = (e: Event) => {
  e.stopPropagation()
}

export const isKeyPressed = (e: KeyboardEvent, key: string, modifiers: string[] = []): boolean => {
  const keyMatch = e.key === key || e.code === key
  const modifiersMatch = modifiers.every(mod => {
    switch (mod) {
      case 'ctrl': return e.ctrlKey
      case 'alt': return e.altKey
      case 'shift': return e.shiftKey
      case 'meta': return e.metaKey
      default: return false
    }
  })
  return keyMatch && modifiersMatch
}

// Storage utilities
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj)
  } catch {
    return '{}'
  }
}

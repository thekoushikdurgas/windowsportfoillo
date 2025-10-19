import { renderHook, act } from '@testing-library/react'
import { useWindowStore } from '@/store/windowStore'
import { WindowState } from '@/types/window'

// Mock window state
const mockWindow: WindowState = {
  id: 'test-window',
  title: 'Test Window',
  appId: 'test-app',
  position: { x: 100, y: 100 },
  size: { width: 800, height: 600 },
  isMinimized: false,
  isMaximized: false,
  isFocused: true,
  zIndex: 1,
  isDragging: false,
  isResizing: false,
}

describe('WindowStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useWindowStore.getState().actions.closeWindow('test-window')
    })
  })

  describe('Window Management', () => {
    it('should open a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      expect(result.current.windows['test-window']).toEqual(mockWindow)
      expect(result.current.focusedWindow).toBe('test-window')
    })

    it('should close a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      // First open a window
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      // Then close it
      act(() => {
        result.current.actions.closeWindow('test-window')
      })

      expect(result.current.windows['test-window']).toBeUndefined()
      expect(result.current.focusedWindow).toBeNull()
    })

    it('should minimize a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.minimizeWindow('test-window')
      })

      expect(result.current.windows['test-window'].isMinimized).toBe(true)
      expect(result.current.focusedWindow).toBeNull()
    })

    it('should maximize a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.maximizeWindow('test-window')
      })

      expect(result.current.windows['test-window'].isMaximized).toBe(true)
      expect(result.current.windows['test-window'].isFocused).toBe(true)
    })

    it('should restore a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      // First minimize it
      act(() => {
        result.current.actions.minimizeWindow('test-window')
      })

      // Then restore it
      act(() => {
        result.current.actions.restoreWindow('test-window')
      })

      expect(result.current.windows['test-window'].isMinimized).toBe(false)
      expect(result.current.windows['test-window'].isMaximized).toBe(false)
      expect(result.current.windows['test-window'].isFocused).toBe(true)
    })
  })

  describe('Window Focus', () => {
    it('should focus a window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.focusWindow('test-window')
      })

      expect(result.current.windows['test-window'].isFocused).toBe(true)
      expect(result.current.focusedWindow).toBe('test-window')
    })

    it('should minimize window when focusing already focused window', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      // Focus the already focused window
      act(() => {
        result.current.actions.focusWindow('test-window')
      })

      expect(result.current.windows['test-window'].isMinimized).toBe(true)
      expect(result.current.focusedWindow).toBeNull()
    })
  })

  describe('Window Position and Size', () => {
    it('should update window position', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      const newPosition = { x: 200, y: 200 }
      act(() => {
        result.current.actions.updateWindowPosition('test-window', newPosition)
      })

      expect(result.current.windows['test-window'].position).toEqual(newPosition)
    })

    it('should update window size', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      const newSize = { width: 1000, height: 800 }
      act(() => {
        result.current.actions.updateWindowSize('test-window', newSize)
      })

      expect(result.current.windows['test-window'].size).toEqual(newSize)
    })
  })

  describe('Window State', () => {
    it('should set window dragging state', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.setWindowDragging('test-window', true)
      })

      expect(result.current.windows['test-window'].isDragging).toBe(true)
    })

    it('should set window resizing state', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.setWindowResizing('test-window', true)
      })

      expect(result.current.windows['test-window'].isResizing).toBe(true)
    })
  })

  describe('Z-Index Management', () => {
    it('should bring window to front', () => {
      const { result } = renderHook(() => useWindowStore())
      
      // Open first window
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      const firstZIndex = result.current.windows['test-window'].zIndex

      // Open second window
      const secondWindow = { ...mockWindow, id: 'test-window-2' }
      act(() => {
        result.current.actions.openWindow(secondWindow)
      })

      // Bring first window to front
      act(() => {
        result.current.actions.bringToFront('test-window')
      })

      expect(result.current.windows['test-window'].zIndex).toBeGreaterThan(firstZIndex)
      expect(result.current.windows['test-window'].isFocused).toBe(true)
    })
  })

  describe('Desktop Assignment', () => {
    it('should move window to desktop', () => {
      const { result } = renderHook(() => useWindowStore())
      
      act(() => {
        result.current.actions.openWindow(mockWindow)
      })

      act(() => {
        result.current.actions.moveWindowToDesktop('test-window', 'desktop-2')
      })

      expect(result.current.windows['test-window'].desktopId).toBe('desktop-2')
    })
  })

  describe('Multiple Windows', () => {
    it('should handle multiple windows correctly', () => {
      const { result } = renderHook(() => useWindowStore())
      
      const window1 = { ...mockWindow, id: 'window-1' }
      const window2 = { ...mockWindow, id: 'window-2' }
      const window3 = { ...mockWindow, id: 'window-3' }

      act(() => {
        result.current.actions.openWindow(window1)
        result.current.actions.openWindow(window2)
        result.current.actions.openWindow(window3)
      })

      expect(Object.keys(result.current.windows)).toHaveLength(3)
      expect(result.current.focusedWindow).toBe('window-3') // Last opened window
    })

    it('should maintain correct z-index order', () => {
      const { result } = renderHook(() => useWindowStore())
      
      const window1 = { ...mockWindow, id: 'window-1' }
      const window2 = { ...mockWindow, id: 'window-2' }
      const window3 = { ...mockWindow, id: 'window-3' }

      act(() => {
        result.current.actions.openWindow(window1)
        result.current.actions.openWindow(window2)
        result.current.actions.openWindow(window3)
      })

      expect(result.current.windows['window-1'].zIndex).toBe(1)
      expect(result.current.windows['window-2'].zIndex).toBe(2)
      expect(result.current.windows['window-3'].zIndex).toBe(3)
    })
  })
})

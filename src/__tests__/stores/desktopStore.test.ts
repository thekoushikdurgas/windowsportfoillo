import { renderHook, act } from '@testing-library/react'
import { useDesktopStore } from '@/store/desktopStore'
import { DesktopIcon, VirtualDesktop } from '@/types/desktop'

// Mock desktop icon
const mockDesktopIcon: DesktopIcon = {
  id: 'test-icon',
  appId: 'test-app',
  position: { x: 100, y: 100 },
  name: 'Test App',
  icon: '🧪',
  isSelected: false,
}

// Mock virtual desktop
const mockVirtualDesktop: VirtualDesktop = {
  id: 'desktop-2',
  name: 'Desktop 2',
  wallpaper: '/wallpapers/test.jpg',
  isActive: false,
  windowCount: 0,
  createdAt: new Date(),
}

describe('DesktopStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useDesktopStore.getState().actions.deselectAllDesktopIcons()
    })
  })

  describe('Desktop Icons', () => {
    it('should add a desktop icon', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.addDesktopIcon(mockDesktopIcon)
      })

      expect(result.current.desktopIcons).toContain(mockDesktopIcon)
    })

    it('should remove a desktop icon', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First add an icon
      act(() => {
        result.current.actions.addDesktopIcon(mockDesktopIcon)
      })

      // Then remove it
      act(() => {
        result.current.actions.removeDesktopIcon('test-icon')
      })

      expect(result.current.desktopIcons).not.toContain(mockDesktopIcon)
    })

    it('should update desktop icon position', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.addDesktopIcon(mockDesktopIcon)
      })

      const newPosition = { x: 200, y: 200 }
      act(() => {
        result.current.actions.updateDesktopIconPosition('test-icon', newPosition)
      })

      const updatedIcon = result.current.desktopIcons.find(icon => icon.id === 'test-icon')
      expect(updatedIcon?.position).toEqual(newPosition)
    })

    it('should select a desktop icon', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.addDesktopIcon(mockDesktopIcon)
      })

      act(() => {
        result.current.actions.selectDesktopIcon('test-icon')
      })

      const selectedIcon = result.current.desktopIcons.find(icon => icon.id === 'test-icon')
      expect(selectedIcon?.isSelected).toBe(true)
    })

    it('should deselect all desktop icons', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // Add multiple icons
      const icon1 = { ...mockDesktopIcon, id: 'icon-1' }
      const icon2 = { ...mockDesktopIcon, id: 'icon-2' }
      
      act(() => {
        result.current.actions.addDesktopIcon(icon1)
        result.current.actions.addDesktopIcon(icon2)
        result.current.actions.selectDesktopIcon('icon-1')
      })

      act(() => {
        result.current.actions.deselectAllDesktopIcons()
      })

      expect(result.current.desktopIcons.every(icon => !icon.isSelected)).toBe(true)
    })
  })

  describe('Start Menu', () => {
    it('should toggle start menu', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      expect(result.current.startMenuOpen).toBe(false)

      act(() => {
        result.current.actions.toggleStartMenu()
      })

      expect(result.current.startMenuOpen).toBe(true)

      act(() => {
        result.current.actions.toggleStartMenu()
      })

      expect(result.current.startMenuOpen).toBe(false)
    })

    it('should close start menu', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First open it
      act(() => {
        result.current.actions.toggleStartMenu()
      })

      // Then close it
      act(() => {
        result.current.actions.closeStartMenu()
      })

      expect(result.current.startMenuOpen).toBe(false)
    })
  })

  describe('System Tray', () => {
    it('should toggle system tray', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      expect(result.current.systemTrayExpanded).toBe(false)

      act(() => {
        result.current.actions.toggleSystemTray()
      })

      expect(result.current.systemTrayExpanded).toBe(true)

      act(() => {
        result.current.actions.toggleSystemTray()
      })

      expect(result.current.systemTrayExpanded).toBe(false)
    })

    it('should close system tray', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First open it
      act(() => {
        result.current.actions.toggleSystemTray()
      })

      // Then close it
      act(() => {
        result.current.actions.closeSystemTray()
      })

      expect(result.current.systemTrayExpanded).toBe(false)
    })
  })

  describe('Theme and Wallpaper', () => {
    it('should set wallpaper', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      const newWallpaper = '/wallpapers/new-wallpaper.jpg'
      act(() => {
        result.current.actions.setWallpaper(newWallpaper)
      })

      expect(result.current.wallpaper).toBe(newWallpaper)
    })

    it('should set theme', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
    })
  })

  describe('Taskbar Position', () => {
    it('should set taskbar position', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.setTaskbarPosition('top')
      })

      expect(result.current.taskbarPosition).toBe('top')
    })
  })

  describe('Focused Window', () => {
    it('should set focused window', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.setFocusedWindow('test-window')
      })

      expect(result.current.focusedWindow).toBe('test-window')
    })

    it('should clear focused window', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First set a focused window
      act(() => {
        result.current.actions.setFocusedWindow('test-window')
      })

      // Then clear it
      act(() => {
        result.current.actions.setFocusedWindow(null)
      })

      expect(result.current.focusedWindow).toBeNull()
    })
  })

  describe('Virtual Desktops', () => {
    it('should create a virtual desktop', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      act(() => {
        result.current.actions.createDesktop('desktop-2', 'Desktop 2')
      })

      expect(result.current.desktops['desktop-2']).toBeDefined()
      expect(result.current.desktops['desktop-2'].name).toBe('Desktop 2')
    })

    it('should delete a virtual desktop', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First create a desktop
      act(() => {
        result.current.actions.createDesktop('desktop-2', 'Desktop 2')
      })

      // Then delete it
      act(() => {
        result.current.actions.deleteDesktop('desktop-2')
      })

      expect(result.current.desktops['desktop-2']).toBeUndefined()
    })

    it('should rename a virtual desktop', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First create a desktop
      act(() => {
        result.current.actions.createDesktop('desktop-2', 'Desktop 2')
      })

      // Then rename it
      act(() => {
        result.current.actions.renameDesktop('desktop-2', 'Renamed Desktop')
      })

      expect(result.current.desktops['desktop-2'].name).toBe('Renamed Desktop')
    })

    it('should switch to a virtual desktop', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      // First create a desktop
      act(() => {
        result.current.actions.createDesktop('desktop-2', 'Desktop 2')
      })

      // Then switch to it
      act(() => {
        result.current.actions.switchDesktop('desktop-2')
      })

      expect(result.current.currentDesktop).toBe('desktop-2')
      expect(result.current.desktops['desktop-2'].isActive).toBe(true)
      expect(result.current.desktops['desktop-1'].isActive).toBe(false)
    })

    it('should set screen size', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      const newSize = { width: 1920, height: 1080 }
      act(() => {
        result.current.actions.setScreenSize(newSize)
      })

      expect(result.current.screenSize).toEqual(newSize)
    })
  })

  describe('Settings', () => {
    it('should update desktop settings', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      const newSettings = {
        showDesktopIcons: false,
        showTaskbar: false,
        autoHideTaskbar: true,
      }

      act(() => {
        result.current.actions.updateSettings(newSettings)
      })

      expect(result.current.settings.showDesktopIcons).toBe(false)
      expect(result.current.settings.showTaskbar).toBe(false)
      expect(result.current.settings.autoHideTaskbar).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useDesktopStore())
      
      expect(result.current.wallpaper).toBe('/wallpapers/windows-11-default.svg')
      expect(result.current.theme).toBe('dark')
      expect(result.current.desktopIcons).toEqual([])
      expect(result.current.startMenuOpen).toBe(false)
      expect(result.current.systemTrayExpanded).toBe(false)
      expect(result.current.taskbarPosition).toBe('bottom')
      expect(result.current.currentDesktop).toBe('desktop-1')
      expect(result.current.desktops['desktop-1']).toBeDefined()
      expect(result.current.screenSize).toEqual({ width: 1920, height: 1080 })
    })
  })
})

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { motion } from 'framer-motion'
import Window from '@/components/windows/Window'
import { useWindowActions } from '@/store/windowStore'
import { WindowState } from '@/types/window'

// Mock the window store
jest.mock('@/store/windowStore', () => ({
  useWindowActions: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

const mockWindowActions = {
  updateWindowPosition: jest.fn(),
  updateWindowSize: jest.fn(),
  setWindowDragging: jest.fn(),
  setWindowResizing: jest.fn(),
  focusWindow: jest.fn(),
  minimizeWindow: jest.fn(),
  maximizeWindow: jest.fn(),
  closeWindow: jest.fn(),
  bringToFront: jest.fn(),
}

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

describe('Window Component', () => {
  beforeEach(() => {
    (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions)
    jest.clearAllMocks()
  })

  it('should render window with correct title', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    expect(screen.getByText('Test Window')).toBeInTheDocument()
    expect(screen.getByText('Window Content')).toBeInTheDocument()
  })

  it('should render window controls', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    // Check for window control buttons
    expect(screen.getByRole('button', { name: /minimize/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /maximize/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('should call minimizeWindow when minimize button is clicked', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const minimizeButton = screen.getByRole('button', { name: /minimize/i })
    fireEvent.click(minimizeButton)

    expect(mockWindowActions.minimizeWindow).toHaveBeenCalledWith('test-window')
  })

  it('should call maximizeWindow when maximize button is clicked', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const maximizeButton = screen.getByRole('button', { name: /maximize/i })
    fireEvent.click(maximizeButton)

    expect(mockWindowActions.maximizeWindow).toHaveBeenCalledWith('test-window')
  })

  it('should call closeWindow when close button is clicked', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockWindowActions.closeWindow).toHaveBeenCalledWith('test-window')
  })

  it('should call focusWindow when window is clicked', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    fireEvent.click(windowElement!)

    expect(mockWindowActions.focusWindow).toHaveBeenCalledWith('test-window')
  })

  it('should apply correct styles for focused window', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={true}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveClass('window-focused')
  })

  it('should apply correct styles for minimized window', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={true}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveClass('window-minimized')
  })

  it('should apply correct styles for maximized window', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={true}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveClass('window-maximized')
  })

  it('should apply correct z-index', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={5}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveStyle({ zIndex: 5 })
  })

  it('should handle window dragging', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={true}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveClass('window-dragging')
  })

  it('should handle window resizing', () => {
    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={mockWindow.position}
        size={mockWindow.size}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={true}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveClass('window-resizing')
  })

  it('should render with custom position and size', () => {
    const customPosition = { x: 200, y: 300 }
    const customSize = { width: 1000, height: 800 }

    render(
      <Window
        id={mockWindow.id}
        title={mockWindow.title}
        position={customPosition}
        size={customSize}
        isMinimized={mockWindow.isMinimized}
        isMaximized={mockWindow.isMaximized}
        isFocused={mockWindow.isFocused}
        zIndex={mockWindow.zIndex}
        isDragging={mockWindow.isDragging}
        isResizing={mockWindow.isResizing}
      >
        <div>Window Content</div>
      </Window>
    )

    const windowElement = screen.getByText('Window Content').closest('div')
    expect(windowElement).toHaveStyle({
      left: '200px',
      top: '300px',
      width: '1000px',
      height: '800px',
    })
  })
})

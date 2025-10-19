'use client'

import { WindowState } from '@/types/window'
import { useWindowActions } from '@/store/windowStore'
import { Minus, Square, X } from 'lucide-react'

interface WindowControlsProps {
  window: WindowState
}

export default function WindowControls({ window }: WindowControlsProps) {
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowActions()

  const handleMinimize = () => {
    minimizeWindow(window.id)
  }

  const handleMaximize = () => {
    if (window.isMaximized) {
      // Restore window
      // TODO: Implement restore functionality
    } else {
      maximizeWindow(window.id)
    }
  }

  const handleClose = () => {
    closeWindow(window.id)
  }

  return (
    <div className="window-controls">
      {/* Minimize Button */}
      <button
        className="window-control-btn minimize"
        onClick={handleMinimize}
        title="Minimize"
      >
        <Minus className="w-3 h-3" />
      </button>

      {/* Maximize/Restore Button */}
      <button
        className="window-control-btn maximize"
        onClick={handleMaximize}
        title={window.isMaximized ? "Restore" : "Maximize"}
      >
        <Square className="w-3 h-3" />
      </button>

      {/* Close Button */}
      <button
        className="window-control-btn close"
        onClick={handleClose}
        title="Close"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

'use client'

import React from 'react'
import { useDesktopState, useDesktopActions } from '@/store/desktopStore'
import { useWindows } from '@/store/windowStore'
import StartButton from './StartButton'
import TaskbarIcons from './TaskbarIcons'
import SystemTray from './SystemTray'

export default function MobileTaskbar() {
  const { showTaskbar } = useDesktopState()
  const { toggleStartMenu } = useDesktopActions()
  const windows = useWindows()

  if (!showTaskbar) {
    return null
  }

  return (
    <div className="taskbar fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-2 py-2 bg-taskbar dark:bg-taskbar-dark backdrop-blur-md border-t border-gray-600 dark:border-gray-700">
      {/* Start Button - Larger for mobile */}
      <div className="flex-shrink-0">
        <StartButton onClick={toggleStartMenu} />
      </div>

      {/* Taskbar Icons - Scrollable on mobile */}
      <div className="flex-1 overflow-x-auto scrollbar-hide px-2">
        <div className="flex items-center space-x-1 min-w-max">
          <TaskbarIcons windows={Object.values(windows)} />
        </div>
      </div>

      {/* System Tray - Compact for mobile */}
      <div className="flex-shrink-0">
        <SystemTray />
      </div>
    </div>
  )
}

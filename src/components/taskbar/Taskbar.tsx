'use client'

import { useDesktopState, useDesktopActions } from '@/store/desktopStore'
import { useWindows } from '@/store/windowStore'
import { useResponsive } from '@/hooks/useResponsive'
import StartButton from './StartButton'
import TaskbarIcons from './TaskbarIcons'
import SystemTray from './SystemTray'
import MobileTaskbar from './MobileTaskbar'

export default function Taskbar() {
  const { showTaskbar, taskbarPosition } = useDesktopState()
  const { toggleStartMenu } = useDesktopActions()
  const windows = useWindows()
  const { isMobile } = useResponsive()

  if (!showTaskbar) {
    return null
  }

  // Use mobile taskbar for small screens
  if (isMobile) {
    return <MobileTaskbar />
  }

  const taskbarClasses = `
    taskbar fixed z-50 flex items-center justify-between px-2 py-1
    ${taskbarPosition === 'bottom' ? 'bottom-0 left-0 right-0 h-12 sm:h-10 md:h-12' : ''}
    ${taskbarPosition === 'top' ? 'top-0 left-0 right-0 h-12 sm:h-10 md:h-12' : ''}
    ${taskbarPosition === 'left' ? 'left-0 top-0 bottom-0 w-12 sm:w-10 md:w-12 flex-col' : ''}
    ${taskbarPosition === 'right' ? 'right-0 top-0 bottom-0 w-12 sm:w-10 md:w-12 flex-col' : ''}
  `

  return (
    <div className={taskbarClasses}>
      {/* Start Button */}
      <StartButton onClick={toggleStartMenu} />

      {/* Taskbar Icons */}
      <TaskbarIcons windows={Object.values(windows)} />

      {/* System Tray */}
      <SystemTray />
    </div>
  )
}

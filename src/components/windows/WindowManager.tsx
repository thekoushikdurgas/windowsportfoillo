'use client'

import { useWindows, useFocusedWindow } from '@/store/windowStore'
import Window from './Window'

export default function WindowManager() {
  const windows = useWindows()
  const focusedWindow = useFocusedWindow()

  return (
    <>
      {Object.values(windows).map((window) => (
        <Window
          key={window.id}
          window={window}
          isFocused={focusedWindow === window.id}
        />
      ))}
    </>
  )
}

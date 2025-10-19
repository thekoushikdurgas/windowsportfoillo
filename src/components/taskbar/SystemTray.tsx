'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopState, useDesktopActions } from '@/store/desktopStore'
import { useNotificationCenter, useNotificationActions } from '@/store/notificationStore'
import { 
  Volume2, 
  Wifi, 
  Battery, 
  Settings, 
  ChevronUp,
  Clock,
  Bell,
  WifiOff,
  VolumeX,
  BatteryLow
} from 'lucide-react'
import NotificationCenter from '../ui/NotificationCenter'

export default function SystemTray() {
  const { systemTrayExpanded } = useDesktopState()
  const { toggleSystemTray, closeSystemTray } = useDesktopActions()
  const { unreadCount } = useNotificationCenter()
  const { openNotificationCenter } = useNotificationActions()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [volumeLevel, setVolumeLevel] = useState(75)
  const [wifiConnected, setWifiConnected] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getBatteryIcon = (level: number) => {
    if (level > 75) return <Battery className="w-5 h-5 text-green-400" />
    if (level > 50) return <Battery className="w-5 h-5 text-yellow-400" />
    if (level > 25) return <Battery className="w-5 h-5 text-orange-400" />
    return <BatteryLow className="w-5 h-5 text-red-400" />
  }

  const getWifiIcon = () => {
    return wifiConnected ? 
      <Wifi className="w-5 h-5 text-green-400" /> : 
      <WifiOff className="w-5 h-5 text-red-400" />
  }

  const getVolumeIcon = (level: number) => {
    if (isMuted || level === 0) return <VolumeX className="w-5 h-5 text-red-400" />
    if (level < 30) return <Volume2 className="w-5 h-5 text-yellow-400" />
    return <Volume2 className="w-5 h-5 text-green-400" />
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="flex items-center space-x-1">
      {/* System Icons */}
      <div className="flex items-center space-x-1">
        {/* Volume Icon */}
        <motion.button
          className="taskbar-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {getVolumeIcon(volumeLevel)}
        </motion.button>

        {/* WiFi Icon */}
        <motion.button
          className="taskbar-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={wifiConnected ? "Connected" : "Disconnected"}
        >
          {getWifiIcon()}
        </motion.button>

        {/* Battery Icon */}
        <motion.button
          className="taskbar-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`Battery: ${batteryLevel}%`}
        >
          {getBatteryIcon(batteryLevel)}
        </motion.button>

        {/* Notifications Icon */}
        <motion.button
          className="taskbar-icon relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openNotificationCenter}
          title={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </motion.button>

        {/* Settings Icon */}
        <motion.button
          className="taskbar-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Time and Date */}
      <div className="flex items-center space-x-1 px-2">
        <motion.button
          className="taskbar-icon flex flex-col items-center py-1"
          onClick={toggleSystemTray}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Click to show notifications"
        >
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              {formatTime()}
            </span>
          </div>
          <span className="text-white text-xs">
            {formatDate()}
          </span>
        </motion.button>

        {/* Expand Button */}
        <motion.button
          className="taskbar-icon"
          onClick={toggleSystemTray}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className={`w-4 h-4 text-white transition-transform ${systemTrayExpanded ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* System Tray Panel */}
      <AnimatePresence>
        {systemTrayExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-2 w-80 bg-gray-800 bg-opacity-95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl p-4"
          >
            <div className="space-y-4">
              {/* Quick Settings */}
              <div>
                <h3 className="text-white text-sm font-medium mb-2">Quick Settings</h3>
                <div className="grid grid-cols-4 gap-2">
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Wifi className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white text-xs">WiFi</span>
                  </button>
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Volume2 className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white text-xs">Volume</span>
                  </button>
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Battery className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white text-xs">Battery</span>
                  </button>
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Settings className="w-6 h-6 text-white mx-auto mb-1" />
                    <span className="text-white text-xs">Settings</span>
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-white text-sm font-medium mb-2">Notifications</h3>
                <div className="text-gray-400 text-sm">
                  {unreadCount > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
                      <button
                        onClick={openNotificationCenter}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        View all
                      </button>
                    </div>
                  ) : (
                    'No new notifications'
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <NotificationCenter />
    </div>
  )
}

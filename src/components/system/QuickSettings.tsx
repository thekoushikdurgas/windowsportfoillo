'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  BluetoothOff,
  Moon,
  Sun,
  Battery,
  BatteryLow,
  BatteryCharging,
  Plane,
  Focus,
  MapPin,
  Camera,
  Mic,
  Settings
} from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';
import { useTheme } from '@/contexts/ThemeContext';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';

interface QuickSettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  type: 'toggle' | 'slider' | 'action';
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export default function QuickSettings({ isVisible, onClose }: QuickSettingsProps) {
  const { volume, brightness, setVolume, setBrightness } = useSystemStore();
  const { theme, toggleTheme } = useTheme();
  
  // Mock battery status
  const isCharging = true;
  const batteryLevel = 85;
  
  const [settings, setSettings] = useState({
    wifi: true,
    bluetooth: false,
    airplaneMode: false,
    nightlight: false,
    focus: false,
    location: true,
    camera: true,
    microphone: true,
  });


  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, onClose]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const quickActions: QuickAction[] = [
    {
      id: 'wifi',
      label: 'Wi-Fi',
      icon: settings.wifi ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />,
      active: settings.wifi,
      onClick: () => toggleSetting('wifi'),
      type: 'toggle',
    },
    {
      id: 'bluetooth',
      label: 'Bluetooth',
      icon: settings.bluetooth ? <Bluetooth className="w-5 h-5" /> : <BluetoothOff className="w-5 h-5" />,
      active: settings.bluetooth,
      onClick: () => toggleSetting('bluetooth'),
      type: 'toggle',
    },
    {
      id: 'airplane-mode',
      label: 'Airplane mode',
      icon: <Plane className="w-5 h-5" />,
      active: settings.airplaneMode,
      onClick: () => toggleSetting('airplaneMode'),
      type: 'toggle',
    },
    {
      id: 'nightlight',
      label: 'Night light',
      icon: <Moon className="w-5 h-5" />,
      active: settings.nightlight,
      onClick: () => toggleSetting('nightlight'),
      type: 'toggle',
    },
    {
      id: 'focus',
      label: 'Focus assist',
      icon: <Focus className="w-5 h-5" />,
      active: settings.focus,
      onClick: () => toggleSetting('focus'),
      type: 'toggle',
    },
    {
      id: 'location',
      label: 'Location',
      icon: <MapPin className="w-5 h-5" />,
      active: settings.location,
      onClick: () => toggleSetting('location'),
      type: 'toggle',
    },
    {
      id: 'camera',
      label: 'Camera access',
      icon: <Camera className="w-5 h-5" />,
      active: settings.camera,
      onClick: () => toggleSetting('camera'),
      type: 'toggle',
    },
    {
      id: 'microphone',
      label: 'Microphone',
      icon: <Mic className="w-5 h-5" />,
      active: settings.microphone,
      onClick: () => toggleSetting('microphone'),
      type: 'toggle',
    },
  ];

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="w-5 h-5" />;
    if (batteryLevel < 20) return <BatteryLow className="w-5 h-5" />;
    return <Battery className="w-5 h-5" />;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed bottom-20 right-4 w-80 z-[10000] pointer-events-auto"
        style={getMicaStyles(MICA_VARIANTS.panel)}
      >
        <div className="rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-800">Quick settings</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <span className="text-lg">×</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Volume and Brightness Sliders */}
            <div className="space-y-4">
              {/* Volume */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {volume > 0 ? (
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Volume</span>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="Volume control"
                    title="Adjust volume"
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{volume}%</span>
              </div>

              {/* Brightness */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Brightness</span>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="Brightness control"
                    title="Adjust brightness"
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{brightness}%</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                    ${action.active 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                    }
                  `}
                >
                  <span className={action.active ? 'text-blue-600' : 'text-gray-500'}>
                    {action.icon}
                  </span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Battery and Theme */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
              <div className="flex items-center gap-2">
                <span className={batteryLevel < 20 ? 'text-red-500' : 'text-gray-600'}>
                  {getBatteryIcon()}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {batteryLevel}% {isCharging && '(Charging)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {theme.type === 'light' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {theme.type === 'light' ? 'Light' : 'Dark'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    // Open Settings app
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom slider styles */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

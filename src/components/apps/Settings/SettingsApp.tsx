'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Palette,
  Volume2,
  Shield,
  Globe,
  Smartphone,
  Gamepad2,
  Bell,
  Database,
  Accessibility
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import AudioSettings from './AudioSettings';
import ThemeToggle from '@/components/common/ThemeToggle';
import './SettingsApp.css';

interface SettingsCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const settingsCategories: SettingsCategory[] = [
  {
    id: 'system',
    name: 'System',
    icon: <SettingsIcon className="w-5 h-5" />,
    description: 'Display, sound, notifications'
  },
  {
    id: 'personalization',
    name: 'Personalization',
    icon: <Palette className="w-5 h-5" />,
    description: 'Background, colors, themes'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: <Volume2 className="w-5 h-5" />,
    description: 'Sound effects and audio feedback'
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: <Accessibility className="w-5 h-5" />,
    description: 'Display, hearing, interaction'
  },
  {
    id: 'accounts',
    name: 'Accounts',
    icon: <User className="w-5 h-5" />,
    description: 'Your account, sync settings'
  },
  {
    id: 'privacy',
    name: 'Privacy & security',
    icon: <Shield className="w-5 h-5" />,
    description: 'Privacy controls, Windows security'
  },
  {
    id: 'network',
    name: 'Network & internet',
    icon: <Globe className="w-5 h-5" />,
    description: 'Wi-Fi, Ethernet, mobile hotspot'
  },
  {
    id: 'devices',
    name: 'Devices',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Bluetooth, printers, mouse'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: <Gamepad2 className="w-5 h-5" />,
    description: 'Xbox Game Bar, Game Mode'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    description: 'Notifications, quick actions'
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: <Database className="w-5 h-5" />,
    description: 'Storage sense, disk cleanup'
  }
];

export default function SettingsApp() {
  const [selectedCategory, setSelectedCategory] = useState('system');
  const { accessibility, setAccessibility } = useTheme();

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-windows-text mb-4">Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-windows-text">Brightness</div>
              <div className="text-sm text-windows-text-light">Adjust display brightness</div>
            </div>
            <div className="w-48">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                aria-label="Adjust display brightness"
                className="w-full h-2 bg-windows-gray rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-windows-text">Resolution</div>
              <div className="text-sm text-windows-text-light">1920 x 1080 (Recommended)</div>
            </div>
            <select className="windows-input" aria-label="Select screen resolution">
              <option>1920 x 1080</option>
              <option>1366 x 768</option>
              <option>1440 x 900</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-windows-text mb-4">Sound</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-windows-text">Master volume</div>
              <div className="text-sm text-windows-text-light">Adjust system volume</div>
            </div>
            <div className="w-48">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                aria-label="Adjust master volume"
                className="w-full h-2 bg-windows-gray rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalizationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 settings-background-section">Background</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Picture', 'Solid color', 'Slideshow'].map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="settings-option-button"
            >
              <div className="text-sm font-medium settings-background-section">
                {option}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 settings-theme-section">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium settings-theme-section">Theme</div>
              <div className="text-sm settings-theme-section-light">Choose your theme preference</div>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium settings-theme-section">Accent color</div>
              <div className="text-sm settings-theme-section-light">Choose an accent color</div>
            </div>
            <div className="flex gap-2">
              {['#0078d4', '#107c10', '#d13438', '#ffb900', '#8764b8', '#00bcf2'].map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 settings-accessibility-section">Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium settings-accessibility-section">High contrast</div>
              <div className="text-sm settings-accessibility-section-light">Increase contrast for better visibility</div>
            </div>
            <button
              onClick={() => setAccessibility({
                ...accessibility,
                highContrast: !accessibility.highContrast
              })}
              aria-label={`${accessibility.highContrast ? 'Disable' : 'Enable'} high contrast mode`}
              aria-pressed={accessibility.highContrast}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.highContrast ? 'bg-primary-500' : 'bg-surface-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium settings-accessibility-section">Reduced motion</div>
              <div className="text-sm settings-accessibility-section-light">Minimize animations and motion</div>
            </div>
            <button
              onClick={() => setAccessibility({
                ...accessibility,
                reducedMotion: !accessibility.reducedMotion
              })}
              aria-label={`${accessibility.reducedMotion ? 'Disable' : 'Enable'} reduced motion mode`}
              aria-pressed={accessibility.reducedMotion}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.reducedMotion ? 'bg-primary-500' : 'bg-surface-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 settings-accessibility-section">Interaction</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium settings-accessibility-section">Focus indicators</div>
              <div className="text-sm settings-accessibility-section-light">Show focus indicators for keyboard navigation</div>
            </div>
            <button
              onClick={() => setAccessibility({
                ...accessibility,
                focusIndicators: !accessibility.focusIndicators
              })}
              aria-label={`${accessibility.focusIndicators ? 'Disable' : 'Enable'} focus indicators`}
              aria-pressed={accessibility.focusIndicators}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.focusIndicators ? 'bg-primary-500' : 'bg-surface-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                accessibility.focusIndicators ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-windows-text mb-4">Your info</h3>
        <div className="flex items-center gap-4 p-4 border border-windows-border rounded-lg">
          <div className="w-16 h-16 bg-windows-blue rounded-full flex items-center justify-center text-white text-xl font-semibold">
            U
          </div>
          <div>
            <div className="font-medium text-windows-text">User Account</div>
            <div className="text-sm text-windows-text-light">user@example.com</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-windows-text mb-4">Sign-in options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-windows-border rounded-lg">
            <div>
              <div className="font-medium text-windows-text">Password</div>
              <div className="text-sm text-windows-text-light">Change your password</div>
            </div>
            <button className="windows-button-secondary">Change</button>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-windows-border rounded-lg">
            <div>
              <div className="font-medium text-windows-text">Windows Hello</div>
              <div className="text-sm text-windows-text-light">Set up facial recognition</div>
            </div>
            <button className="windows-button-secondary">Set up</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'system':
        return renderSystemSettings();
      case 'personalization':
        return renderPersonalizationSettings();
      case 'audio':
        return <AudioSettings />;
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'accounts':
        return renderAccountsSettings();
      default:
        return (
          <div className="text-center py-12">
            <div className="mb-2 settings-privacy-section-light">
              {settingsCategories.find(cat => cat.id === selectedCategory)?.icon}
            </div>
            <div className="settings-privacy-section-light">
              {settingsCategories.find(cat => cat.id === selectedCategory)?.name} settings coming soon
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex settings-main-container"
    >
      {/* Sidebar */}
      <div 
        className="w-64 border-r p-4 settings-sidebar"
      >
        <h2 
          className="text-lg font-semibold mb-6 settings-system-section"
        >
          Settings
        </h2>
        <div className="space-y-1">
          {settingsCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'text-white bg-primary-500'
                  : 'bg-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{category.icon}</span>
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div 
                    className={`text-xs ${
                      selectedCategory === category.id 
                        ? 'text-white/80' 
                        : 'text-surface-600'
                    }`}
                  >
                    {category.description}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 
            className="text-2xl font-semibold mb-2 settings-system-section"
          >
            {settingsCategories.find(cat => cat.id === selectedCategory)?.name}
          </h1>
          <p 
            className="mb-8 settings-system-section-light"
          >
            {settingsCategories.find(cat => cat.id === selectedCategory)?.description}
          </p>
          
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderCategoryContent()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

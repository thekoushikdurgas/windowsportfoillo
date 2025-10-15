'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, Keyboard, Lightbulb, HelpCircle } from 'lucide-react';
import { useLearn } from '@/contexts/LearnContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface HelpSystemProps {
  isVisible: boolean;
  onClose: () => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function HelpSystem({ isVisible, onClose }: HelpSystemProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { startTutorial } = useLearn();
  const shortcuts = useKeyboardShortcuts();

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Welcome to Windows 11 Clone</h3>
            <p className="text-gray-600 leading-relaxed">
              This is a comprehensive recreation of the Windows 11 operating system experience in your browser. 
              Explore all the features and learn how to use them effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Quick Start</h4>
              <p className="text-blue-700 text-sm">
                Click the Learn button (💡) in any app window to get contextual help and tutorials.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">⌨️ Keyboard Shortcuts</h4>
              <p className="text-green-700 text-sm">
                Use keyboard shortcuts for faster navigation and app management.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'apps',
      title: 'Applications',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'about-me', name: 'About Me', description: 'Personal portfolio and information' },
                { id: 'file-explorer', name: 'File Explorer', description: 'Browse and manage files' },
                { id: 'settings', name: 'Settings', description: 'System preferences and customization' },
                { id: 'calculator', name: 'Calculator', description: 'Mathematical calculations' },
                { id: 'notepad', name: 'Notepad', description: 'Text editing and note-taking' }
              ].map((app) => (
                <div key={app.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.name}</h4>
                      <p className="text-gray-600 text-sm">{app.description}</p>
                    </div>
                    <button
                      onClick={() => startTutorial(app.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Learn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <Keyboard className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Keyboard Shortcuts Reference</h3>
            <div className="space-y-4">
              {Object.entries(
                shortcuts.reduce((groups, shortcut) => {
                  const category = getShortcutCategory(shortcut);
                  if (!groups[category]) groups[category] = [];
                  groups[category].push(shortcut);
                  return groups;
                }, {} as Record<string, typeof shortcuts>)
              ).map(([category, categoryShortcuts]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-700">{shortcut.description}</span>
                        <div className="flex gap-1">
                          {shortcut.ctrl && <kbd className="px-2 py-1 bg-gray-200 text-xs rounded">Ctrl</kbd>}
                          {shortcut.alt && <kbd className="px-2 py-1 bg-gray-200 text-xs rounded">Alt</kbd>}
                          {shortcut.shift && <kbd className="px-2 py-1 bg-gray-200 text-xs rounded">Shift</kbd>}
                          {shortcut.meta && <kbd className="px-2 py-1 bg-gray-200 text-xs rounded">Win</kbd>}
                          <kbd className="px-2 py-1 bg-gray-200 text-xs rounded">{shortcut.key}</kbd>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Tips & Tricks',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips & Tricks</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Learn Button</h4>
                <p className="text-blue-700 text-sm">
                  Every app window has a Learn button (💡) in the title bar. Click it to get step-by-step tutorials for that specific app.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🖱️ Right-Click Menus</h4>
                <p className="text-green-700 text-sm">
                  Right-click on desktop icons, taskbar items, or in apps to access context menus with additional options.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">⌨️ Window Snapping</h4>
                <p className="text-purple-700 text-sm">
                  Use Win + Arrow keys to snap windows to different parts of the screen for better multitasking.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🔍 Search Everything</h4>
                <p className="text-orange-700 text-sm">
                  Press Win + S to open the Start Menu search, or click the search icon in the taskbar to find apps and files quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Help & Support</h2>
                <p className="text-gray-500">Get help with Windows 11 Clone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[60vh]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <nav className="space-y-1">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {helpSections.find(s => s.id === activeSection)?.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getShortcutCategory(shortcut: { description: string }): string {
  const description = shortcut.description.toLowerCase();
  
  if (description.includes('window') || description.includes('snap')) {
    return 'Window Management';
  }
  if (description.includes('volume') || description.includes('brightness') || description.includes('media')) {
    return 'Media & System';
  }
  if (description.includes('open') || description.includes('calculator') || description.includes('explorer')) {
    return 'Applications';
  }
  if (description.includes('start menu') || description.includes('settings') || description.includes('notification')) {
    return 'System';
  }
  if (description.includes('theme') || description.includes('developer')) {
    return 'Advanced';
  }
  
  return 'General';
}

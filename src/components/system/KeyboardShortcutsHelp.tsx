'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Keyboard, 
  X, 
  Search,
  Monitor,
  MousePointer,
  Volume2,
  Settings,
  Zap,
  Code
} from 'lucide-react';
import { useAvailableShortcuts } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';

interface KeyboardShortcutsHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

const categoryIcons = {
  'Window Management': Monitor,
  'Media & System': Volume2,
  'Applications': MousePointer,
  'System': Settings,
  'Advanced': Code,
  'General': Zap,
};

export default function KeyboardShortcutsHelp({ isVisible, onClose }: KeyboardShortcutsHelpProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const shortcuts = useAvailableShortcuts();

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

  const categories = ['All', ...Object.keys(shortcuts)];

  const filteredShortcuts = Object.entries(shortcuts).reduce((acc, [category, shortcuts]) => {
    if (selectedCategory !== 'All' && selectedCategory !== category) {
      return acc;
    }

    const filtered = shortcuts.filter(shortcut =>
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 0) {
      acc[category] = filtered;
    }

    return acc;
  }, {} as Record<string, typeof shortcuts[string]>);

  const formatKeyCombo = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('Win');
    
    // Format the key nicely
    let key = shortcut.key;
    if (key === ' ') key = 'Space';
    if (key === 'ArrowUp') key = '↑';
    if (key === 'ArrowDown') key = '↓';
    if (key === 'ArrowLeft') key = '←';
    if (key === 'ArrowRight') key = '→';
    
    parts.push(key);
    return parts.join(' + ');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-8"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden"
          style={getMicaStyles(MICA_VARIANTS.panel)}
        >
          <div className="rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close keyboard shortcuts help"
                title="Close keyboard shortcuts help"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex h-[60vh]">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search shortcuts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category === 'All' ? Zap : categoryIcons[category as keyof typeof categoryIcons] || Zap;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {Object.keys(filteredShortcuts).length === 0 ? (
                  <div className="text-center py-12">
                    <Keyboard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No shortcuts found matching your search.' : 'No shortcuts available in this category.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(filteredShortcuts).map(([category, shortcuts]) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          {(() => {
                            const Icon = categoryIcons[category as keyof typeof categoryIcons] || Zap;
                            return <Icon className="w-5 h-5 text-blue-600" />;
                          })()}
                          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                        </div>

                        <div className="grid gap-3">
                          {shortcuts.map((shortcut, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium">{shortcut.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <kbd 
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded border border-gray-300 shadow-sm"
                                  title={`Keyboard shortcut: ${formatKeyCombo(shortcut)}`}
                                >
                                  {formatKeyCombo(shortcut)}
                                </kbd>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200/50 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Press <kbd className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-mono rounded border">Esc</kbd> to close
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>•</span>
                  <span>Shortcuts work globally</span>
                  <span>•</span>
                  <span>Some may not work in input fields</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

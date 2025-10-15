'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SnapLayout {
  id: string;
  name: string;
  slots: SnapSlot[];
  description: string;
}

interface SnapSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

interface SnapLayoutsProps {
  isVisible: boolean;
  onSnap: (layoutId: string, slotId: string) => void;
  onClose: () => void;
  mousePosition: { x: number; y: number };
}

const snapLayouts: SnapLayout[] = [
  {
    id: 'half-left',
    name: 'Left Half',
    description: 'Snap window to left half of screen',
    slots: [
      {
        id: 'left',
        x: 0,
        y: 0,
        width: 50,
        height: 100,
        label: 'Left'
      }
    ]
  },
  {
    id: 'half-right',
    name: 'Right Half',
    description: 'Snap window to right half of screen',
    slots: [
      {
        id: 'right',
        x: 50,
        y: 0,
        width: 50,
        height: 100,
        label: 'Right'
      }
    ]
  },
  {
    id: 'quarter-top-left',
    name: 'Top Left Quarter',
    description: 'Snap window to top left quarter',
    slots: [
      {
        id: 'top-left',
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        label: 'Top Left'
      }
    ]
  },
  {
    id: 'quarter-top-right',
    name: 'Top Right Quarter',
    description: 'Snap window to top right quarter',
    slots: [
      {
        id: 'top-right',
        x: 50,
        y: 0,
        width: 50,
        height: 50,
        label: 'Top Right'
      }
    ]
  },
  {
    id: 'quarter-bottom-left',
    name: 'Bottom Left Quarter',
    description: 'Snap window to bottom left quarter',
    slots: [
      {
        id: 'bottom-left',
        x: 0,
        y: 50,
        width: 50,
        height: 50,
        label: 'Bottom Left'
      }
    ]
  },
  {
    id: 'quarter-bottom-right',
    name: 'Bottom Right Quarter',
    description: 'Snap window to bottom right quarter',
    slots: [
      {
        id: 'bottom-right',
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        label: 'Bottom Right'
      }
    ]
  },
  {
    id: 'three-column-left',
    name: 'Left Third',
    description: 'Snap window to left third of screen',
    slots: [
      {
        id: 'left-third',
        x: 0,
        y: 0,
        width: 33.33,
        height: 100,
        label: 'Left'
      }
    ]
  },
  {
    id: 'three-column-center',
    name: 'Center Third',
    description: 'Snap window to center third of screen',
    slots: [
      {
        id: 'center-third',
        x: 33.33,
        y: 0,
        width: 33.33,
        height: 100,
        label: 'Center'
      }
    ]
  },
  {
    id: 'three-column-right',
    name: 'Right Third',
    description: 'Snap window to right third of screen',
    slots: [
      {
        id: 'right-third',
        x: 66.66,
        y: 0,
        width: 33.33,
        height: 100,
        label: 'Right'
      }
    ]
  },
  {
    id: 'maximize',
    name: 'Maximize',
    description: 'Maximize window to full screen',
    slots: [
      {
        id: 'full',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        label: 'Full'
      }
    ]
  }
];

export default function SnapLayouts({ isVisible, onSnap, onClose, mousePosition }: SnapLayoutsProps) {
  const [hoveredLayout, setHoveredLayout] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

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

  if (!isVisible) return null;

  const handleLayoutClick = (layoutId: string, slotId: string) => {
    onSnap(layoutId, slotId);
    onClose();
  };

  const handleLayoutHover = (layoutId: string, slotId: string) => {
    setHoveredLayout(layoutId);
    setHoveredSlot(slotId);
  };

  const handleLayoutLeave = () => {
    setHoveredLayout(null);
    setHoveredSlot(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] pointer-events-none"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />

        {/* Snap Layouts Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute pointer-events-auto"
          style={{
            left: Math.max(20, Math.min(window.innerWidth - 320, mousePosition.x - 160)),
            top: Math.max(20, Math.min(window.innerHeight - 400, mousePosition.y - 200)),
          }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-6 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Snap Layouts</h3>
                <p className="text-sm text-gray-600">Choose how to arrange your windows</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-2 gap-3">
              {snapLayouts.map((layout) => (
                <motion.div
                  key={layout.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <button
                    onClick={() => handleLayoutClick(layout.id, layout.slots[0].id)}
                    onMouseEnter={() => handleLayoutHover(layout.id, layout.slots[0].id)}
                    onMouseLeave={handleLayoutLeave}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group"
                  >
                    {/* Layout Preview */}
                    <div className="relative w-full h-16 mb-3 bg-gray-200 rounded border overflow-hidden">
                      {layout.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`absolute border-2 transition-all duration-200 ${
                            hoveredLayout === layout.id && hoveredSlot === slot.id
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-gray-400 bg-blue-200'
                          }`}
                          style={{
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            width: `${slot.width}%`,
                            height: `${slot.height}%`,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {slot.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layout Info */}
                    <div>
                      <div className="font-medium text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                        {layout.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {layout.description}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Esc to cancel</span>
                <span>Click to snap window</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Preview Overlay */}
        {hoveredLayout && hoveredSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {snapLayouts
              .find(layout => layout.id === hoveredLayout)
              ?.slots.filter(slot => slot.id === hoveredSlot)
              .map((slot) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute border-2 border-blue-500 bg-blue-100/20 backdrop-blur-sm"
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.width}%`,
                    height: `${slot.height}%`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      {slot.label}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

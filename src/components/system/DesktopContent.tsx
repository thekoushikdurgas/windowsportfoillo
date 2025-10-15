'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { useAppStore } from '@/store/appStore';
import { useLearn } from '@/contexts/LearnContext';
import DesktopIcon from '@/components/common/DesktopIcon';

export default function DesktopContent() {
  const { desktopIcons } = useSystemStore();
  const { openApp } = useAppStore();
  const { startTutorial } = useLearn();
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleIconDoubleClick = (appId: string) => {
    openApp(appId);
    useSystemStore.getState().addToRecent(appId);
  };

  const handleDesktopDoubleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking on the desktop background, not on icons
    if (e.target === e.currentTarget) {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < 300) {
        // Double click detected - start desktop tutorial
        startTutorial('desktop');
      }
      setLastClickTime(currentTime);
    }
  };

  return (
    <div
      className="absolute inset-0 z-10 p-4"
      onDoubleClick={handleDesktopDoubleClick}
    >
      <div className="relative w-full h-full">
        {desktopIcons.map((icon, index) => (
          <motion.div
            key={icon.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              position: 'absolute',
              left: icon.position.x,
              top: icon.position.y,
            }}
          >
            <DesktopIcon
              icon={icon}
              onDoubleClick={() => handleIconDoubleClick(icon.appId)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

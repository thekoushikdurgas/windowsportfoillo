'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={cn('boot-screen', visible && 'boot-screen-visible')}>
       <div className="boot-screen-logo">
          <Image 
            src="/icon.png" 
            alt="DurgasOS Logo" 
            className="boot-screen-logo-image"
            width={100}
            height={100}
            priority
          />
       </div>
       <div className="boot-screen-spinner"></div>
    </div>
  );
};

export default BootScreen;


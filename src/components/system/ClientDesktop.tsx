'use client';

import { useState, useEffect } from 'react';
import { BootScreen } from '@/components/system/BootScreen';
import { Desktop } from '@/components/system/Desktop';
import { MobileDesktop } from '@/components/system/MobileDesktop';
import { Taskbar } from '@/components/system/Taskbar';
import { useIsMobile } from '@/hooks/use-mobile';

export function ClientDesktop() {
  const [booting, setBooting] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 3000); // Simulate a 3-second boot time

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) {
    return <BootScreen />;
  }

  if (booting) {
    return <BootScreen />;
  }

  if (isMobile) {
    return <MobileDesktop />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black select-none">
      <Desktop />
      <Taskbar />
    </div>
  );
}

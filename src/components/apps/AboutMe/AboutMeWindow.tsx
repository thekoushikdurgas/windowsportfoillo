'use client';

import Window from '@/components/ui/Window';
import AboutMeApp from './AboutMeApp';

interface AboutMeWindowProps {
  id: string;
  title: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
}

export default function AboutMeWindow(props: AboutMeWindowProps) {
  return (
    <Window {...props}>
      <AboutMeApp />
    </Window>
  );
}

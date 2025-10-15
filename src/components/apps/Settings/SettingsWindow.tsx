'use client';

import Window from '@/components/ui/Window';
import SettingsApp from './SettingsApp';

interface SettingsWindowProps {
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

export default function SettingsWindow(props: SettingsWindowProps) {
  return (
    <Window {...props}>
      <SettingsApp />
    </Window>
  );
}

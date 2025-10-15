'use client';

import Window from '@/components/ui/Window';
import NotepadApp from './NotepadApp';

interface NotepadWindowProps {
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

export default function NotepadWindow(props: NotepadWindowProps) {
  return (
    <Window {...props}>
      <NotepadApp />
    </Window>
  );
}

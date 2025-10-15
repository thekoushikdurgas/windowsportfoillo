'use client';

import Window from '@/components/ui/Window';
import FileExplorerApp from './FileExplorerApp';

interface FileExplorerWindowProps {
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

export default function FileExplorerWindow(props: FileExplorerWindowProps) {
  return (
    <Window {...props}>
      <FileExplorerApp />
    </Window>
  );
}

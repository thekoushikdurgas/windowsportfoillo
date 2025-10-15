'use client';

import Window from '@/components/ui/Window';
import CalculatorApp from './CalculatorApp';

interface CalculatorWindowProps {
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

export default function CalculatorWindow(props: CalculatorWindowProps) {
  return (
    <Window {...props}>
      <CalculatorApp />
    </Window>
  );
}

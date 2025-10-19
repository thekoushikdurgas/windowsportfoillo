import React from 'react';

export interface AppData {
  id: string;
  title: string;
  // FIX: Specified props for icon to allow passing className.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  taskbarIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  component: React.FC<{ onClose: () => void }>;
  defaultSize: { width: number; height: number };
}

export interface WindowState {
  id: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  title: string;
  // FIX: Specified props for icon to allow passing className.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  taskbarIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  isClosing?: boolean;
}

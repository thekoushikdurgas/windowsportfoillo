'use client';

import type { App } from '@/lib/apps.config';
import { useDesktop } from '@/context/DesktopContext';

interface DesktopIconProps {
  app: App;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { openApp } = useDesktop();

  return (
    <button
      onDoubleClick={() => openApp(app.id)}
      className="group flex flex-col items-center justify-center w-24 h-24 p-3 rounded-xl hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
      aria-label={`Open ${app.title}`}
      data-testid="desktop-icon"
      data-app-id={app.id}
    >
      <div className="relative">
        <app.Icon className="w-10 h-10 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-200" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <span className="mt-2 text-xs text-white text-center truncate w-full font-medium shadow-black [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] group-hover:[text-shadow:0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-200">
        {app.title}
      </span>
    </button>
  );
}

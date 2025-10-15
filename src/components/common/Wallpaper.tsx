'use client';

import Image from 'next/image';

interface WallpaperProps {
  wallpaper: string;
}

export default function Wallpaper({ wallpaper }: WallpaperProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src={wallpaper}
        alt="Windows 11 Wallpaper"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

// Wallpaper Configuration
// All local wallpapers available in /public/wallpapers/

export interface Wallpaper {
  id: string;
  url: string;
  name: string;
  category?: 'abstract' | 'nature' | 'city' | 'space' | 'gradient' | 'other';
  description?: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'wallpaper-1',
    url: '/wallpapers/wallpaper (1).jpg',
    name: 'Abstract Blue',
    category: 'abstract',
    description: 'Vibrant abstract blue gradient',
  },
  {
    id: 'wallpaper-2',
    url: '/wallpapers/wallpaper (2).jpg',
    name: 'Nature Landscape',
    category: 'nature',
    description: 'Serene nature landscape',
  },
  {
    id: 'wallpaper-3',
    url: '/wallpapers/wallpaper (3).jpg',
    name: 'Mountain Vista',
    category: 'nature',
    description: 'Majestic mountain vista',
  },
  {
    id: 'wallpaper-4',
    url: '/wallpapers/wallpaper (4).jpg',
    name: 'City Lights',
    category: 'city',
    description: 'Urban city lights at night',
  },
  {
    id: 'wallpaper-5',
    url: '/wallpapers/wallpaper (5).jpg',
    name: 'Minimalist',
    category: 'abstract',
    description: 'Clean minimalist design',
  },
  {
    id: 'wallpaper-6',
    url: '/wallpapers/wallpaper (6).jpg',
    name: 'Ocean View',
    category: 'nature',
    description: 'Peaceful ocean view',
  },
  {
    id: 'wallpaper-7',
    url: '/wallpapers/wallpaper (7).jpg',
    name: 'Cosmic',
    category: 'space',
    description: 'Cosmic space scene',
  },
  {
    id: 'wallpaper-8',
    url: '/wallpapers/wallpaper (8).jpg',
    name: 'Sunset',
    category: 'nature',
    description: 'Beautiful sunset scene',
  },
  {
    id: 'wallpaper-9',
    url: '/wallpapers/wallpaper (9).jpg',
    name: 'Abstract Gradient',
    category: 'gradient',
    description: 'Colorful abstract gradient',
  },
  {
    id: 'wallpaper-10',
    url: '/wallpapers/wallpaper (10).jpg',
    name: 'Forest Path',
    category: 'nature',
    description: 'Mysterious forest path',
  },
  {
    id: 'wallpaper-11',
    url: '/wallpapers/wallpaper (11).jpg',
    name: 'Urban Skyline',
    category: 'city',
    description: 'Modern urban skyline',
  },
  {
    id: 'wallpaper-12',
    url: '/wallpapers/wallpaper (12).jpg',
    name: 'Epic Landscape',
    category: 'nature',
    description: 'Epic natural landscape',
  },
  {
    id: 'wallpaper-13',
    url: '/wallpapers/wallpaper (13).jpg',
    name: 'Abstract Art',
    category: 'abstract',
    description: 'Modern abstract art',
  },
  {
    id: 'wallpaper-14',
    url: '/wallpapers/wallpaper (14).jpg',
    name: 'Scenic View',
    category: 'nature',
    description: 'Breathtaking scenic view',
  },
  {
    id: 'wallpaper-15',
    url: '/wallpapers/wallpaper (15).jpg',
    name: 'Cityscape',
    category: 'city',
    description: 'Dynamic cityscape',
  },
  {
    id: 'wallpaper-16',
    url: '/wallpapers/wallpaper (16).jpg',
    name: 'Natural Beauty',
    category: 'nature',
    description: 'Natural beauty scene',
  },
  {
    id: 'wallpaper-17',
    url: '/wallpapers/wallpaper (17).jpg',
    name: 'Abstract Design',
    category: 'abstract',
    description: 'Contemporary abstract design',
  },
  {
    id: 'wallpaper-18',
    url: '/wallpapers/wallpaper (18).jpg',
    name: 'Landscape',
    category: 'nature',
    description: 'Stunning landscape view',
  },
];

// Default wallpaper (first one)
export const DEFAULT_WALLPAPER = WALLPAPERS[0];

// Helper functions
export const getWallpaperById = (id: string): Wallpaper | undefined => {
  return WALLPAPERS.find(wp => wp.id === id);
};

export const getWallpapersByCategory = (category: Wallpaper['category']): Wallpaper[] => {
  if (!category) return WALLPAPERS;
  return WALLPAPERS.filter(wp => wp.category === category);
};

export const getWallpaperUrl = (id: string): string => {
  const wallpaper = getWallpaperById(id);
  return wallpaper?.url || DEFAULT_WALLPAPER.url;
};


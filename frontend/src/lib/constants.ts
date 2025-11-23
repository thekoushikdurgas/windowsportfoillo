export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Import wallpapers from dedicated utility file
export { WALLPAPERS, DEFAULT_WALLPAPER, getWallpaperById, getWallpapersByCategory, getWallpaperUrl } from './wallpapers';

// Deprecated: Use WALLPAPERS from wallpapers.ts instead
// Kept for backward compatibility
export const WALLPAPER_URL = '/wallpapers/wallpaper (1).jpg';

export const ACCENT_COLORS = [
  { id: 'blue', name: 'Sapphire Blue', hex: '#2563eb', tailwind: 'blue-600' },
  { id: 'purple', name: 'Neon Purple', hex: '#9333ea', tailwind: 'purple-600' },
  { id: 'green', name: 'Emerald', hex: '#059669', tailwind: 'green-600' },
  { id: 'red', name: 'Crimson', hex: '#dc2626', tailwind: 'red-600' },
  { id: 'orange', name: 'Sunset', hex: '#ea580c', tailwind: 'orange-600' },
  { id: 'pink', name: 'Rose', hex: '#db2777', tailwind: 'pink-600' },
];

export const MODELS = {
  CHAT_COMPLEX: 'gemini-3-pro-preview',
  CHAT_FAST: 'gemini-2.5-flash-lite',
  IMAGE_GEN_HQ: 'gemini-3-pro-image-preview',
  IMAGE_GEN_FAST: 'gemini-2.5-flash-image',
  IMAGE_EDIT: 'gemini-2.5-flash-image',
  VIDEO_VEO_FAST: 'veo-3.1-fast-generate-preview',
  VIDEO_VEO_HQ: 'veo-3.1-generate-preview',
  AUDIO_LIVE: 'gemini-2.5-flash-native-audio-preview-09-2025',
  AUDIO_TTS: 'gemini-2.5-flash-preview-tts',
  SEARCH_MAPS: 'gemini-2.5-flash',
};


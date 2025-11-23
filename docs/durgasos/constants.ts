export const GEMINI_API_KEY = process.env.API_KEY || '';

export const WALLPAPER_URL = "https://images.unsplash.com/photo-1633205719979-e47958b730a5?q=80&w=2832&auto=format&fit=crop"; // Windows 11 Abstract Dark

export const WALLPAPERS = [
  { id: 'dark-abstract', url: 'https://images.unsplash.com/photo-1633205719979-e47958b730a5?q=80&w=2832&auto=format&fit=crop', name: 'Abstract Dark' },
  { id: 'light-abstract', url: 'https://images.unsplash.com/photo-1633205719932-d1286395e54d?q=80&w=2832&auto=format&fit=crop', name: 'Abstract Light' },
  { id: 'nature-mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3000&auto=format&fit=crop', name: 'Mountains' },
  { id: 'nature-lake', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=3000&auto=format&fit=crop', name: 'Lake' },
  { id: 'neon-city', url: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=3000&auto=format&fit=crop', name: 'Neon City' },
];

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
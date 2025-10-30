import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WindowInstance } from '@/store/windowStore';

interface WindowSliceState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  zIndex: number;
}

const initialState: WindowSliceState = {
  windows: [],
  activeWindowId: null,
  zIndex: 1000,
};

export const windowSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    openWindow: (state, action: PayloadAction<WindowInstance>) => {
      const newWindow = {
        ...action.payload,
        zIndex: state.zIndex + 1,
      };
      state.windows.push(newWindow);
      state.activeWindowId = newWindow.id;
      state.zIndex = newWindow.zIndex;
    },
    closeWindow: (state, action: PayloadAction<string>) => {
      state.windows = state.windows.filter(w => w.id !== action.payload);
      if (state.activeWindowId === action.payload) {
        const lastWindow = state.windows[state.windows.length - 1];
        state.activeWindowId = lastWindow ? lastWindow.id : null;
      }
    },
    minimizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        window.isMinimized = true;
      }
    },
    maximizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        window.isMaximized = !window.isMaximized;
        if (window.isMaximized) {
          window.position.x = 0;
          window.position.y = 0;
          window.size.width = 1920;
          window.size.height = 1080;
        }
      }
    },
    focusWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        window.zIndex = state.zIndex + 1;
        state.zIndex = window.zIndex;
        state.activeWindowId = action.payload;
      }
    },
    updateWindowPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const window = state.windows.find(w => w.id === action.payload.id);
      if (window) {
        window.position.x = action.payload.x;
        window.position.y = action.payload.y;
      }
    },
    updateWindowSize: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const window = state.windows.find(w => w.id === action.payload.id);
      if (window) {
        window.size.width = action.payload.width;
        window.size.height = action.payload.height;
      }
    },
    setStartMenuOpen: () => {
      // This would be handled by a separate slice or context
    },
  },
});

export const {
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
  updateWindowPosition,
  updateWindowSize,
  setStartMenuOpen,
} = windowSlice.actions;

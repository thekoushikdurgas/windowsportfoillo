import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileSystemItem } from '@/types/filesystem';

interface FileSystemState {
  items: FileSystemItem[];
  currentPath: string[];
  expandedFolders: Set<string>;
  clipboard: {
    items: FileSystemItem[];
    operation: 'copy' | 'cut' | null;
  };
  history: {
    past: FileSystemItem[][];
    present: FileSystemItem[];
    future: FileSystemItem[][];
  };
  loading: boolean;
  error: string | null;
}

const initialState: FileSystemState = {
  items: [
    {
      id: 'root',
      name: 'This PC',
      type: 'folder',
      children: [
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          children: [
            {
              id: 'readme',
              name: 'README.txt',
              type: 'file',
              content: 'Welcome to DurgasOS!',
            },
          ],
        },
        {
          id: 'pictures',
          name: 'Pictures',
          type: 'folder',
          children: [],
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          children: [],
        },
      ],
    },
  ],
  currentPath: [],
  expandedFolders: new Set(),
  clipboard: {
    items: [],
    operation: null,
  },
  history: {
    past: [],
    present: [],
    future: [],
  },
  loading: false,
  error: null,
};

export const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string[]>) => {
      state.currentPath = action.payload;
    },
    navigateToFolder: (state, action: PayloadAction<string>) => {
      state.currentPath.push(action.payload);
    },
    navigateUp: (state) => {
      if (state.currentPath.length > 0) {
        state.currentPath.pop();
      }
    },
    toggleFolder: (state, action: PayloadAction<string>) => {
      if (state.expandedFolders.has(action.payload)) {
        state.expandedFolders.delete(action.payload);
      } else {
        state.expandedFolders.add(action.payload);
      }
    },
    createItem: (state, action: PayloadAction<{ name: string; type: 'file' | 'folder'; content?: string }>) => {
      const { name, type, content } = action.payload;
      const newItem: FileSystemItem = {
        id: `${type}_${Date.now()}`,
        name,
        type,
        ...(content && { content }),
        ...(type === 'folder' && { children: [] }),
      };
      
      // Add to current folder
      const currentFolder = state.items.find(item => item.id === state.currentPath[state.currentPath.length - 1]);
      if (currentFolder && currentFolder.children) {
        currentFolder.children.push(newItem);
      } else {
        state.items.push(newItem);
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      const deleteFromArray = (items: FileSystemItem[], id: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && item.id === id) {
            items.splice(i, 1);
            return true;
          }
          if (item?.children && deleteFromArray(item.children, id)) {
            return true;
          }
        }
        return false;
      };
      
      deleteFromArray(state.items, action.payload);
    },
    renameItem: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const { id, newName } = action.payload;
      const renameInArray = (items: FileSystemItem[]): boolean => {
        for (const item of items) {
          if (item.id === id) {
            item.name = newName;
            return true;
          }
          if (item.children && renameInArray(item.children)) {
            return true;
          }
        }
        return false;
      };
      
      renameInArray(state.items);
    },
    copyItems: (state, action: PayloadAction<FileSystemItem[]>) => {
      state.clipboard = {
        items: action.payload,
        operation: 'copy',
      };
    },
    cutItems: (state, action: PayloadAction<FileSystemItem[]>) => {
      state.clipboard = {
        items: action.payload,
        operation: 'cut',
      };
    },
    pasteItems: (state) => {
      if (state.clipboard.operation === 'cut') {
        // Remove items from their current location
        state.clipboard.items.forEach(item => {
          state.items = state.items.filter(i => i.id !== item.id);
        });
      }
      
      // Add items to current folder
      const currentFolder = state.items.find(item => item.id === state.currentPath[state.currentPath.length - 1]);
      if (currentFolder && currentFolder.children) {
        currentFolder.children.push(...state.clipboard.items);
      } else {
        state.items.push(...state.clipboard.items);
      }
      
      state.clipboard = { items: [], operation: null };
    },
    clearClipboard: (state) => {
      state.clipboard = { items: [], operation: null };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        if (previous) {
          state.history.future.unshift(state.history.present);
          state.history.past.pop();
          state.history.present = previous;
          state.items = previous;
        }
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        if (next) {
          state.history.past.push(state.history.present);
          state.history.future.shift();
          state.history.present = next;
          state.items = next;
        }
      }
    },
  },
});

export const {
  setCurrentPath,
  navigateToFolder,
  navigateUp,
  toggleFolder,
  createItem,
  deleteItem,
  renameItem,
  copyItems,
  cutItems,
  pasteItems,
  clearClipboard,
  setLoading,
  setError,
  undo,
  redo,
} = fileSystemSlice.actions;

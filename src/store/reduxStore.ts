import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import { windowSlice } from './slices/windowSlice';
import { settingsSlice } from './slices/settingsSlice';
import { fileSystemSlice } from './slices/fileSystemSlice';
import { aiSlice } from './slices/aiSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings', 'fileSystem'], // Only persist these slices
};

// Root reducer
const rootReducer = combineReducers({
  windows: windowSlice.reducer,
  settings: settingsSlice.reducer,
  fileSystem: fileSystemSlice.reducer,
  ai: aiSlice.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env['NODE_ENV'] !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

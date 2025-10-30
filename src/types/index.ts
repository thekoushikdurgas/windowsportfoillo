// Desktop types
export * from './desktop';

// File system types
export * from './filesystem';

// Settings types
export * from './settings';

// AI types
export * from './ai';

// Performance types
export * from './performance';

// Common utility types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: ValidationError[];
  timestamp: Date;
}

// Event types
export interface BaseEvent {
  type: string;
  timestamp: Date;
  source: string;
}

export interface WindowEvent extends BaseEvent {
  type: 'window:open' | 'window:close' | 'window:minimize' | 'window:maximize' | 'window:focus' | 'window:blur';
  windowId: string;
  appId: string;
}

export interface FileSystemEvent extends BaseEvent {
  type: 'filesystem:create' | 'filesystem:delete' | 'filesystem:rename' | 'filesystem:move' | 'filesystem:copy';
  path: string[];
  itemType: 'file' | 'folder';
}

export interface SettingsEvent extends BaseEvent {
  type: 'settings:change';
  setting: string;
  oldValue: unknown;
  newValue: unknown;
}

export type AppEvent = WindowEvent | FileSystemEvent | SettingsEvent;

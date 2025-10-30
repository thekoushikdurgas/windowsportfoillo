export interface NotepadProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onFileSave?: (content: string, filename: string) => void;
  onFileOpen?: (content: string, filename: string) => void;
}

export interface DocumentState {
  content: string;
  filename: string;
  isModified: boolean;
  cursorPosition: { line: number; column: number };
  selection: { start: number; end: number };
  history: HistoryItem[];
  historyIndex: number;
  lastSaved?: Date;
  fileHandle?: FileSystemFileHandle;
}

export interface HistoryItem {
  content: string;
  cursorPosition: { line: number; column: number };
  timestamp: Date;
  action: string;
  selection?: { start: number; end: number };
}

export interface NotepadSettings {
  showLineNumbers: boolean;
  wordWrap: boolean;
  fontSize: number;
  fontFamily: string;
  zoom: number;
  theme: 'light' | 'dark' | 'auto';
  tabSize: number;
  insertSpaces: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
}

export interface DocumentStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingTime: number; // in minutes
  lastCalculated: Date;
}

export interface SearchOptions {
  query: string;
  replaceText: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  wrapAround: boolean;
}

export interface SearchResult {
  start: number;
  end: number;
  line: number;
  column: number;
  text: string;
}

export interface PrintOptions {
  fontSize: number;
  fontFamily: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'Legal';
  header: string;
  footer: string;
  showLineNumbers: boolean;
  showPageNumbers: boolean;
}

export interface MenuAction {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuAction[];
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export interface StatusBarItem {
  id: string;
  content: string;
  position: 'left' | 'center' | 'right';
  priority: number;
}

export interface FileDialogOptions {
  title: string;
  defaultPath?: string;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  multiple?: boolean;
}

export interface RecentFile {
  filename: string;
  path: string;
  lastOpened: Date;
  content?: string;
}

export interface NotepadState {
  document: DocumentState;
  settings: NotepadSettings;
  statistics: DocumentStatistics;
  searchOptions: SearchOptions;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  recentFiles: RecentFile[];
  isFullscreen: boolean;
  isPrintPreview: boolean;
  printOptions: PrintOptions;
  showFindDialog: boolean;
  showReplaceDialog: boolean;
  showSettingsDialog: boolean;
  showAboutDialog: boolean;
  error?: string;
  isLoading: boolean;
}

export interface NotepadActions {
  // Document operations
  newDocument: () => void;
  openDocument: () => Promise<void>;
  saveDocument: () => Promise<void>;
  saveAsDocument: () => Promise<void>;
  closeDocument: () => void;
  
  // Content operations
  setContent: (content: string) => void;
  insertText: (text: string, position?: number) => void;
  deleteText: (start: number, end: number) => void;
  selectText: (start: number, end: number) => void;
  selectAll: () => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Clipboard operations
  cut: () => void;
  copy: () => void;
  paste: () => void;
  
  // Search operations
  find: (query: string, options?: Partial<SearchOptions>) => void;
  findNext: () => void;
  findPrevious: () => void;
  replace: (query: string, replaceText: string, options?: Partial<SearchOptions>) => void;
  replaceAll: (query: string, replaceText: string, options?: Partial<SearchOptions>) => void;
  
  // View operations
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  toggleFullscreen: () => void;
  
  // Settings operations
  updateSettings: (settings: Partial<NotepadSettings>) => void;
  resetSettings: () => void;
  
  // Print operations
  print: () => void;
  printPreview: () => void;
  updatePrintOptions: (options: Partial<PrintOptions>) => void;
  
  // Dialog operations
  showFindDialog: () => void;
  hideFindDialog: () => void;
  showReplaceDialog: () => void;
  hideReplaceDialog: () => void;
  showSettingsDialog: () => void;
  hideSettingsDialog: () => void;
  showAboutDialog: () => void;
  hideAboutDialog: () => void;
  
  // Utility operations
  calculateStatistics: () => void;
  goToLine: (line: number) => void;
  clearError: () => void;
  addRecentFile: (file: RecentFile) => void;
  removeRecentFile: (filename: string) => void;
  clearRecentFiles: () => void;
}

export interface NotepadHookReturn {
  state: NotepadState;
  actions: NotepadActions;
  refs: {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    lineNumbersRef: React.RefObject<HTMLDivElement>;
  };
}

// Keyboard shortcut types
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: 'file' | 'edit' | 'view' | 'format' | 'search' | 'navigation';
}

// Theme types
export interface NotepadTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    selection: string;
    lineNumbers: string;
    lineNumbersBackground: string;
    cursor: string;
    searchHighlight: string;
    border: string;
    toolbar: string;
    menu: string;
    statusBar: string;
  };
}

// All types are already exported above

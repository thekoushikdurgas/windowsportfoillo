'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Folder, FileText, Image as ImageIcon, Music, Video, ChevronLeft, ChevronRight, Search, Home } from 'lucide-react';

type FileType = 'folder' | 'text' | 'image' | 'video' | 'audio' | 'unknown' | 'drive';

interface FileSystemItem {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  size?: string;
  dateModified: string;
}

const fsItems: FileSystemItem[] = [
  { id: 'root', parentId: null, name: 'This PC', type: 'folder', dateModified: '', size: '' },
  { id: 'c_drive', parentId: 'root', name: 'Local Disk (C:)', type: 'drive', dateModified: '', size: '800 GB free' },
  { id: 'desktop', parentId: 'c_drive', name: 'Desktop', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'documents', parentId: 'c_drive', name: 'Documents', type: 'folder', dateModified: 'Yesterday', size: '' },
  { id: 'downloads', parentId: 'c_drive', name: 'Downloads', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'f1', parentId: 'desktop', name: 'Project Alpha', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'f2', parentId: 'desktop', name: 'todo.txt', type: 'text', dateModified: 'Today', size: '1 KB' },
  { id: 'f3', parentId: 'documents', name: 'Resume.pdf', type: 'text', dateModified: 'Last Month', size: '450 KB' },
];

const FileExplorerApp: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();
  
  const [currentPath, setCurrentPath] = useState<string>('c_drive');
  const [history, setHistory] = useState<string[]>(['c_drive']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const items = fsItems.filter(i => i.parentId === currentPath);

  const getIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return <Folder className="file-explorer-icon-folder" size={24} />;
      case 'text': return <FileText className="file-explorer-icon-text" size={24} />;
      case 'image': return <ImageIcon className="file-explorer-icon-image" size={24} />;
      case 'video': return <Video className="file-explorer-icon-video" size={24} />;
      case 'audio': return <Music className="file-explorer-icon-audio" size={24} />;
      default: return <FileText className="file-explorer-icon-default" size={24} />;
    }
  };

  const navigateTo = (id: string) => {
    if (id === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(id);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  return (
    <div className="file-explorer-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="file-explorer-toolbar" data-theme={isDarkMode ? 'dark' : 'light'}>
        <button onClick={goBack} disabled={historyIndex === 0} className="file-explorer-toolbar-button" aria-label="Go back" title="Go back">
          <ChevronLeft size={20} />
        </button>
        <button onClick={goForward} disabled={historyIndex === history.length - 1} className="file-explorer-toolbar-button" aria-label="Go forward" title="Go forward">
          <ChevronRight size={20} />
        </button>
        <button onClick={() => navigateTo('c_drive')} className="file-explorer-toolbar-button" aria-label="Go to home" title="Go to home">
          <Home size={20} />
        </button>
        <div className="file-explorer-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="file-explorer-search-input"
          />
        </div>
      </div>

      <div className="file-explorer-content">
        {viewMode === 'grid' ? (
          <div className="file-explorer-grid">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => item.type === 'folder' || item.type === 'drive' ? navigateTo(item.id) : null}
                className="file-explorer-item file-explorer-item-grid"
              >
                {getIcon(item.type)}
                <span className="file-explorer-item-name">{item.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="file-explorer-list">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => item.type === 'folder' || item.type === 'drive' ? navigateTo(item.id) : null}
                className="file-explorer-item file-explorer-item-list"
              >
                {getIcon(item.type)}
                <span className="file-explorer-item-name">{item.name}</span>
                <span className="file-explorer-item-size">{item.size}</span>
                <span className="file-explorer-item-date">{item.dateModified}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorerApp;


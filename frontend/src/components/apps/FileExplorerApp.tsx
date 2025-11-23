'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Folder, FileText, Image as ImageIcon, Music, Video, ChevronLeft, ChevronRight, ArrowUp, Search, Home } from 'lucide-react';

type FileType = 'folder' | 'text' | 'image' | 'video' | 'audio' | 'unknown' | 'drive';

interface FileSystemItem {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  size?: string;
  dateModified: string;
}

let fsItems: FileSystemItem[] = [
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
  const { isDarkMode, accentColor } = useTheme();
  
  const [currentPath, setCurrentPath] = useState<string>('c_drive');
  const [history, setHistory] = useState<string[]>(['c_drive']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const bg = isDarkMode ? 'bg-[#191919]' : 'bg-[#f3f3f3]';
  const mainBg = isDarkMode ? 'bg-[#202020]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-[#333]' : 'border-[#e5e5e5]';

  const currentFolder = fsItems.find(i => i.id === currentPath);
  const items = fsItems.filter(i => i.parentId === currentPath);

  const getIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return <Folder className="text-yellow-400" size={24} />;
      case 'text': return <FileText className="text-blue-400" size={24} />;
      case 'image': return <ImageIcon className="text-green-400" size={24} />;
      case 'video': return <Video className="text-red-400" size={24} />;
      case 'audio': return <Music className="text-purple-400" size={24} />;
      default: return <FileText className="text-gray-400" size={24} />;
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
    <div className={`flex flex-col h-full ${bg} ${textColor}`}>
      <div className={`${mainBg} border-b ${borderColor} p-2 flex items-center gap-2`}>
        <button onClick={goBack} disabled={historyIndex === 0} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
          <ChevronLeft size={20} />
        </button>
        <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
          <ChevronRight size={20} />
        </button>
        <button onClick={() => navigateTo('c_drive')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <Home size={20} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <Search size={16} className={mutedText} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => item.type === 'folder' || item.type === 'drive' ? navigateTo(item.id) : null}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/5 transition"
              >
                {getIcon(item.type)}
                <span className="text-xs text-center truncate w-full">{item.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => item.type === 'folder' || item.type === 'drive' ? navigateTo(item.id) : null}
                className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 transition"
              >
                {getIcon(item.type)}
                <span className="flex-1 text-left">{item.name}</span>
                <span className={mutedText}>{item.size}</span>
                <span className={mutedText}>{item.dateModified}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorerApp;


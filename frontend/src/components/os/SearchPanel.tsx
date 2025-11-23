'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Acrylic } from '@/components/ui/Acrylic';
import { cn } from '@/lib/utils/cn';
import { Search, Clock, FileText, Settings as SettingsIcon, Folder, X } from 'lucide-react';
import { AppDefinition } from '@/types';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppDefinition[];
  onAppClick: (appId: string) => void;
}

interface SearchResult {
  id: string;
  type: 'app' | 'file' | 'setting' | 'recent';
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

/**
 * Windows 11 Search Panel Component
 * Global search for apps, files, and settings
 */
export const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  onClose,
  apps,
  onAppClick,
}) => {
  const { isDarkMode, accentColor, transparencyEffect } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const panelBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/95 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/5';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';

  // Mock recent items
  const recentItems = useMemo(() => [
    { id: 'recent-1', title: 'Document.docx', type: 'file' as const, icon: <FileText size={20} /> },
    { id: 'recent-2', title: 'Settings', type: 'setting' as const, icon: <SettingsIcon size={20} /> },
    { id: 'recent-3', title: 'Downloads', type: 'file' as const, icon: <Folder size={20} /> },
  ], []);

  // Search results
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!query.trim()) {
      return recentItems.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        icon: item.icon,
        action: () => {
          if (item.type === 'setting') {
            onAppClick('settings');
          }
          onClose();
        },
      }));
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search apps
    apps.forEach(app => {
      if (app.title.toLowerCase().includes(lowerQuery) || app.id.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `app-${app.id}`,
          type: 'app',
          title: app.title,
          description: 'Application',
          icon: app.icon,
          action: () => {
            onAppClick(app.id);
            onClose();
          },
        });
      }
    });

    // Search settings (mock)
    const settingsCategories = [
      'System', 'Personalization', 'Apps', 'Privacy', 'Update & Security',
      'Accounts', 'Time & Language', 'Gaming', 'Accessibility'
    ];
    settingsCategories.forEach(category => {
      if (category.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `setting-${category}`,
          type: 'setting',
          title: category,
          description: 'Settings',
          icon: <SettingsIcon size={20} />,
          action: () => {
            onAppClick('settings');
            onClose();
          },
        });
      }
    });

    // Search files (mock)
    const mockFiles = [
      'Document.docx', 'Spreadsheet.xlsx', 'Presentation.pptx',
      'Image.jpg', 'Video.mp4', 'Music.mp3'
    ];
    mockFiles.forEach(file => {
      if (file.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `file-${file}`,
          type: 'file',
          title: file,
          description: 'File',
          icon: <FileText size={20} />,
          action: () => {
            onAppClick('explorer');
            onClose();
          },
        });
      }
    });

    return results.slice(0, 10);
  }, [query, apps, recentItems, onAppClick, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          searchResults[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[4000] flex items-start justify-center pt-20',
        'win11-transition'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          'w-full max-w-2xl',
          panelBg,
          'win11-rounded-panel border shadow-2xl',
          borderColor,
          'overflow-hidden'
        )}
        style={{
          animation: 'win11-menu-slide-down 200ms cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <div className={cn(
            'flex items-center gap-3',
            'border rounded-lg px-4 py-3',
            isDarkMode ? 'bg-[#1f1f1f] border-white/10' : 'bg-white border-black/10'
          )}>
            <Search size={20} className={mutedText} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type here to search"
              className={cn(
                'flex-1 bg-transparent outline-none text-lg',
                textColor,
                'placeholder:text-gray-500'
              )}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={cn('p-1 rounded', hoverBg, textColor)}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[400px] overflow-y-auto win11-scrollbar">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={result.action}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition text-left',
                    index === selectedIndex ? activeBg : hoverBg,
                    textColor
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-100'
                  )}>
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-sm font-medium truncate', textColor)}>
                      {result.title}
                    </div>
                    {result.description && (
                      <div className={cn('text-xs truncate', mutedText)}>
                        {result.description}
                      </div>
                    )}
                  </div>
                  {result.type === 'recent' && (
                    <Clock size={16} className={mutedText} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className={cn('p-8 text-center', mutedText)}>
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <div className="text-sm">No results found</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn(
          'p-3 border-t flex items-center justify-between text-xs',
          borderColor,
          mutedText
        )}>
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div>{searchResults.length} results</div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;


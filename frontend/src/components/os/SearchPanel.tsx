'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
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
  const { isDarkMode, transparencyEffect } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);


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
      className="search-panel-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn('search-panel-container', 'win11-rounded-panel')}
        data-transparency={transparencyEffect}
        data-theme={isDarkMode ? 'dark' : 'light'}
        style={{
          animation: 'win11-menu-slide-down 200ms cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="search-panel-input-section" data-theme={isDarkMode ? 'dark' : 'light'}>
          <div className="search-panel-input-wrapper">
            <Search size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type here to search"
              className="search-panel-input"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="search-panel-clear-button"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="search-panel-results win11-scrollbar">
          {searchResults.length > 0 ? (
            <div className="search-panel-results-list">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={result.action}
                  className={cn('search-panel-result-item', index === selectedIndex && 'search-panel-result-item-active')}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="search-panel-result-icon">
                    {result.icon}
                  </div>
                  <div className="search-panel-result-content">
                    <div className="search-panel-result-title">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="search-panel-result-description">
                        {result.description}
                      </div>
                    )}
                  </div>
                  {result.type === 'recent' && (
                    <Clock size={16} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="search-panel-empty">
              <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <div className="search-panel-no-results-text">No results found</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-panel-footer">
          <div className="search-panel-footer-shortcuts">
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


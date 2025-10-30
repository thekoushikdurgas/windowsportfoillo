'use client';

import { useState } from 'react';
import { Bookmark, Download, Shield, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrowserBookmarks } from './BrowserBookmarks';
import { BrowserDownloads } from './BrowserDownloads';
import { BrowserSecurity } from './BrowserSecurity';

interface BrowserSidebarProps {
  className?: string;
}

export function BrowserSidebar({ className = '' }: BrowserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'downloads' | 'security'>('bookmarks');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50 ${className}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'bookmarks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('bookmarks')}
                className="h-8 px-3"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarks
              </Button>
              <Button
                variant={activeTab === 'downloads' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('downloads')}
                className="h-8 px-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </Button>
              <Button
                variant={activeTab === 'security' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('security')}
                className="h-8 px-3"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="h-full overflow-y-auto">
            {activeTab === 'bookmarks' && <BrowserBookmarks />}
            {activeTab === 'downloads' && <BrowserDownloads />}
            {activeTab === 'security' && <BrowserSecurity />}
          </div>
        </div>
      )}
    </>
  );
}

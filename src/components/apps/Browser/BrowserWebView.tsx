'use client';

import { useEffect, useRef } from 'react';
import { useBrowserStore } from '@/store/browserStore';

interface BrowserWebViewProps {
  className?: string;
}

export function BrowserWebView({ className = '' }: BrowserWebViewProps) {
  const { activeTabId, tabs, updateTab } = useBrowserStore();
  const webViewRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (!activeTab || !webViewRef.current) return;

    // Simulate page loading
    let timer: NodeJS.Timeout | undefined;
    
    if (activeTab.isLoading) {
      timer = setTimeout(() => {
        updateTab(activeTab.id, {
          isLoading: false,
          title: getPageTitle(activeTab.url),
          canGoBack: true,
          canGoForward: false,
        });
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeTab, updateTab]);

  const getPageTitle = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Extract domain name for display
      const domain = hostname.replace('www.', '');
      return `${domain.charAt(0).toUpperCase() + domain.slice(1)}`;
    } catch {
      return 'New Tab';
    }
  };

  const renderPlaceholderContent = () => {
    if (!activeTab) return null;

    if (activeTab.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      );
    }

    // For now, show a placeholder for web content
    // In a real implementation, this would be replaced with an actual webview
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
        <div className="text-6xl">🌐</div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Web Content Preview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            This is a placeholder for web content. In a real implementation, 
            this would display the actual webpage using a web rendering engine.
          </p>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>URL:</strong> {activeTab.url}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Title:</strong> {activeTab.title}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={webViewRef}
      className={`flex-1 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
    >
      {renderPlaceholderContent()}
    </div>
  );
}

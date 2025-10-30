'use client';

import { useEffect } from 'react';
import { useBrowserStore } from '@/store/browserStore';
import { BrowserNavigation } from './Browser/BrowserNavigation';
import { BrowserAddressBar } from './Browser/BrowserAddressBar';
import { BrowserTabs } from './Browser/BrowserTabs';
import { BrowserWebView } from './Browser/BrowserWebView';
import { BrowserSidebar } from './Browser/BrowserSidebar';

export default function Browser() {
  const { createTab, tabs } = useBrowserStore();

  // Initialize with a tab if none exist
  useEffect(() => {
    if (tabs.length === 0) {
      createTab();
    }
  }, [tabs.length, createTab]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 relative">
      {/* Navigation Bar */}
      <BrowserNavigation />
      
      {/* Address Bar */}
      <BrowserAddressBar />
      
      {/* Tab Bar */}
      <BrowserTabs />
      
      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Web Content Area */}
        <BrowserWebView />
        
        {/* Sidebar */}
        <BrowserSidebar />
      </div>
    </div>
  );
}

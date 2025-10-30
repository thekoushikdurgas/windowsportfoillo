'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Pin, PinOff, Volume2, VolumeX, Copy } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem } from '@/components/ui/context-menu';
import type { Tab } from '@/types/browser';

export function BrowserTabs() {
  const {
    tabs,
    switchTab,
    closeTab,
    pinTab,
    unpinTab,
    muteTab,
    unmuteTab,
    duplicateTab,
    createTab,
  } = useBrowserStore();

  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    switchTab(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleTabPin = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.isPinned) {
        unpinTab(tabId);
      } else {
        pinTab(tabId);
      }
    }
  };

  const handleTabMute = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.isMuted) {
        unmuteTab(tabId);
      } else {
        muteTab(tabId);
      }
    }
  };

  const handleDuplicateTab = (tabId: string) => {
    duplicateTab(tabId);
  };

  const handleNewTab = () => {
    createTab();
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (draggedTabId && draggedTabId !== targetTabId) {
      // In a real implementation, this would reorder tabs
      // For now, we'll just switch to the target tab
      switchTab(targetTabId);
    }
    setDraggedTabId(null);
  };

  const getTabTitle = (tab: Tab) => {
    if (tab.isLoading && !tab.title) {
      return 'Loading...';
    }
    return tab.title || 'New Tab';
  };

  const getFavicon = (tab: Tab) => {
    if (tab.favicon) {
      return (
        <Image
          src={tab.favicon}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 flex-shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    return <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-sm flex-shrink-0" />;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        {/* Tabs */}
        <div className="flex items-center min-w-0">
          {tabs.map((tab) => (
            <ContextMenu key={tab.id}>
              <ContextMenuTrigger asChild>
                <div
                  className={`
                    group flex items-center gap-2 px-3 py-2 min-w-0 max-w-48 cursor-pointer border-r border-gray-200 dark:border-gray-700
                    ${tab.isActive 
                      ? 'bg-white dark:bg-gray-900 border-b-2 border-blue-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    ${tab.isPinned ? 'w-12 px-2' : ''}
                  `}
                  onClick={() => handleTabClick(tab.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tab.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tab.id)}
                >
                  {/* Favicon */}
                  {!tab.isPinned && getFavicon(tab)}

                  {/* Tab Title */}
                  {!tab.isPinned && (
                    <span className="text-sm truncate flex-1 min-w-0">
                      {getTabTitle(tab)}
                    </span>
                  )}

                  {/* Tab Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Mute Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={(e) => handleTabMute(e, tab.id)}
                        >
                          {tab.isMuted ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tab.isMuted ? 'Unmute tab' : 'Mute tab'}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Pin Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={(e) => handleTabPin(e, tab.id)}
                        >
                          {tab.isPinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tab.isPinned ? 'Unpin tab' : 'Pin tab'}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Close Button */}
                    {tabs.length > 1 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                            onClick={(e) => handleTabClose(e, tab.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close tab</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDuplicateTab(tab.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate tab
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleTabPin({} as React.MouseEvent, tab.id)}>
                  {tab.isPinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin tab
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin tab
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleTabMute({} as React.MouseEvent, tab.id)}>
                  {tab.isMuted ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" />
                      Unmute tab
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Mute tab
                    </>
                  )}
                </ContextMenuItem>
                {tabs.length > 1 && (
                  <ContextMenuItem 
                    onClick={() => handleTabClose({} as React.MouseEvent, tab.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close tab
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>

        {/* New Tab Button */}
        <div className="flex-shrink-0 p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewTab}
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 rotate-45" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New tab</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

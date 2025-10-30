'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Folder, FolderOpen, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import type { Bookmark, BookmarkFolder } from '@/types/browser';

interface BrowserBookmarksProps {
  className?: string;
}

export function BrowserBookmarks({ className = '' }: BrowserBookmarksProps) {
  const {
    bookmarks,
    bookmarkFolders,
    addBookmark,
    removeBookmark,
    updateBookmark,
    createBookmarkFolder,
    removeBookmarkFolder,
    updateBookmarkFolder,
    navigateTo,
  } = useBrowserStore();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleAddBookmark = () => {
    const currentUrl = window.location.href;
    const currentTitle = document.title;
    
    addBookmark({
      title: currentTitle,
      url: currentUrl,
    });
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    navigateTo(bookmark.url);
  };

  const handleEditBookmark = (bookmarkId: string) => {
    setEditingBookmark(bookmarkId);
  };

  const handleSaveBookmark = (bookmarkId: string, newTitle: string, newUrl: string) => {
    updateBookmark(bookmarkId, {
      title: newTitle,
      url: newUrl,
    });
    setEditingBookmark(null);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createBookmarkFolder({
        name: newFolderName.trim(),
      });
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleEditFolder = (folderId: string) => {
    setEditingFolder(folderId);
  };

  const handleSaveFolder = (folderId: string, newName: string) => {
    updateBookmarkFolder(folderId, {
      name: newName,
    });
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    removeBookmarkFolder(folderId);
  };

  const getBookmarksInFolder = (folderId?: string) => {
    return bookmarks.filter(bookmark => bookmark.folderId === folderId);
  };

  const getRootFolders = () => {
    return bookmarkFolders.filter(folder => !folder.parentId);
  };

  const renderBookmark = (bookmark: Bookmark) => {
    if (editingBookmark === bookmark.id) {
      return (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <Input
            defaultValue={bookmark.title}
            className="mb-2"
            placeholder="Bookmark title"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const title = e.currentTarget.value;
                const url = (e.currentTarget.nextElementSibling as HTMLInputElement)?.value || bookmark.url;
                handleSaveBookmark(bookmark.id, title, url);
              }
            }}
          />
          <Input
            defaultValue={bookmark.url}
            placeholder="Bookmark URL"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const url = e.currentTarget.value;
                const title = (e.currentTarget.previousElementSibling as HTMLInputElement)?.value || bookmark.title;
                handleSaveBookmark(bookmark.id, title, url);
              }
            }}
          />
        </div>
      );
    }

    return (
      <ContextMenu key={bookmark.id}>
        <ContextMenuTrigger asChild>
          <div
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group"
            onClick={() => handleBookmarkClick(bookmark)}
          >
            {bookmark.favicon ? (
              <Image
                src={bookmark.favicon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-sm flex-shrink-0" />
            )}
            <span className="text-sm truncate flex-1">{bookmark.title}</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBookmark(bookmark.id);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit bookmark</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleBookmarkClick(bookmark)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open bookmark
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleEditBookmark(bookmark.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit bookmark
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => handleDeleteBookmark(bookmark.id)}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete bookmark
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const renderFolder = (folder: BookmarkFolder) => {
    const isExpanded = expandedFolders.has(folder.id);
    const bookmarksInFolder = getBookmarksInFolder(folder.id);

    if (editingFolder === folder.id) {
      return (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <Input
            defaultValue={folder.name}
            placeholder="Folder name"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveFolder(folder.id, e.currentTarget.value);
              }
            }}
            onBlur={(e) => {
              handleSaveFolder(folder.id, e.target.value);
            }}
            autoFocus
          />
        </div>
      );
    }

    return (
      <div key={folder.id} className="mb-2">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group"
              onClick={() => toggleFolder(folder.id)}
            >
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-medium flex-1">{folder.name}</span>
              <span className="text-xs text-gray-500">{bookmarksInFolder.length}</span>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(folder.id);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit folder</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem onClick={() => toggleFolder(folder.id)}>
              {isExpanded ? (
                <>
                  <Folder className="h-4 w-4 mr-2" />
                  Collapse folder
                </>
              ) : (
                <>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Expand folder
                </>
              )}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleEditFolder(folder.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit folder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => handleDeleteFolder(folder.id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete folder
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {isExpanded && (
          <div className="ml-6 space-y-1">
            {bookmarksInFolder.map(renderBookmark)}
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className={`p-4 space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bookmarks</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddBookmark}
                  className="h-8 w-8 p-0"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add current page to bookmarks</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewFolder(true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new folder</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* New Folder Input */}
        {showNewFolder && (
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
              onBlur={() => {
                if (newFolderName.trim()) {
                  handleCreateFolder();
                } else {
                  setShowNewFolder(false);
                }
              }}
              autoFocus
            />
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-2">
          {/* Root Bookmarks */}
          {getBookmarksInFolder().map(renderBookmark)}

          {/* Folders */}
          {getRootFolders().map(renderFolder)}
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 && bookmarkFolders.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookmarks yet</p>
            <p className="text-sm">Add bookmarks to organize your favorite websites</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

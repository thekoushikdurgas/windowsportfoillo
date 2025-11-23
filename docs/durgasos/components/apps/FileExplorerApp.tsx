import React, { useState, useEffect, useRef } from 'react';
import { WindowProps } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { WALLPAPERS } from '../../constants';
import {
  Folder, FileText, Image as ImageIcon, Music, Video,
  ChevronLeft, ChevronRight, ArrowUp, Search,
  Home, Monitor, Download, Star, MoreHorizontal,
  Plus, Copy, Scissors, Trash2, LayoutGrid, List as ListIcon,
  HardDrive, X, Check, File, Edit2, PanelRight, Clipboard, ExternalLink
} from 'lucide-react';

// --- Types & Mock Data ---

type FileType = 'folder' | 'text' | 'image' | 'video' | 'audio' | 'unknown' | 'drive';

interface FileSystemItem {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  size?: string;
  dateModified: string;
  content?: string;
}

interface ClipboardState {
  op: 'copy' | 'cut';
  items: string[];
}

// Module-level state for persistence across window close/open
let fsItems: FileSystemItem[] = [
  { id: 'root', parentId: null, name: 'This PC', type: 'folder', dateModified: '', size: '' },
  { id: 'c_drive', parentId: 'root', name: 'Local Disk (C:)', type: 'drive', dateModified: '', size: '800 GB free' },
  
  // User Folders
  { id: 'desktop', parentId: 'c_drive', name: 'Desktop', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'documents', parentId: 'c_drive', name: 'Documents', type: 'folder', dateModified: 'Yesterday', size: '' },
  { id: 'downloads', parentId: 'c_drive', name: 'Downloads', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'pictures', parentId: 'c_drive', name: 'Pictures', type: 'folder', dateModified: 'Last Week', size: '' },
  { id: 'music', parentId: 'c_drive', name: 'Music', type: 'folder', dateModified: 'Last Month', size: '' },
  { id: 'videos', parentId: 'c_drive', name: 'Videos', type: 'folder', dateModified: 'Last Month', size: '' },

  // Sample Content
  { id: 'f1', parentId: 'desktop', name: 'Project Alpha', type: 'folder', dateModified: 'Today', size: '' },
  { id: 'f2', parentId: 'desktop', name: 'todo.txt', type: 'text', dateModified: 'Today', size: '1 KB', content: '1. Buy milk\n2. Walk the dog\n3. Code React app\n4. Deploy to production' },
  { id: 'f3', parentId: 'documents', name: 'Resume.pdf', type: 'text', dateModified: 'Last Month', size: '450 KB', content: 'John Doe\nSoftware Engineer\n\nExperience:\n- Senior Dev at Tech Corp\n- Lead at Startup Inc' },
  { id: 'f4', parentId: 'pictures', name: 'Vacation.jpg', type: 'image', dateModified: 'Last Year', size: '2.4 MB', content: WALLPAPERS[2].url },
  { id: 'f5', parentId: 'downloads', name: 'Installer.exe', type: 'unknown', dateModified: 'Today', size: '45 MB' },
  { id: 'f6', parentId: 'pictures', name: 'City.jpg', type: 'image', dateModified: 'Last Month', size: '3.1 MB', content: WALLPAPERS[4].url },
];

const FileExplorerApp: React.FC<WindowProps> = () => {
  const { isDarkMode, accentColor } = useTheme();
  
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('c_drive');
  const [history, setHistory] = useState<string[]>(['c_drive']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // View State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Context Menu & Clipboard State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetId: string | null } | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardState | null>(null);

  // Force update to reflect FS changes
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  // Derived State
  const currentFolder = fsItems.find(i => i.id === currentPath);
  const items = fsItems.filter(i => {
     if (searchQuery) return i.name.toLowerCase().includes(searchQuery.toLowerCase()) && i.parentId !== null;
     return i.parentId === currentPath;
  });

  // Styles
  const bg = isDarkMode ? 'bg-[#191919]' : 'bg-[#f3f3f3]';
  const mainBg = isDarkMode ? 'bg-[#202020]' : 'bg-white';
  const headerBg = isDarkMode ? 'bg-[#191919]' : 'bg-[#f3f3f3]'; // Title bar/toolbar area
  const toolbarBg = isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#f9f9f9]';
  const sidebarBg = isDarkMode ? 'bg-[#191919]' : 'bg-[#f3f3f3]';
  const itemHover = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5';
  const itemSelected = isDarkMode ? 'bg-white/10' : 'bg-blue-50';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-[#333]' : 'border-[#e5e5e5]';

  // Context Menu click handler
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const getIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return <Folder className="text-yellow-400 fill-yellow-400/20" />;
      case 'drive': return <HardDrive className="text-gray-400" />;
      case 'image': return <ImageIcon className="text-purple-400" />;
      case 'video': return <Video className="text-red-400" />;
      case 'audio': return <Music className="text-pink-400" />;
      case 'text': return <FileText className="text-blue-400" />;
      default: return <File className="text-gray-400" />;
    }
  };

  // --- Actions ---

  const navigate = (id: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(id);
    setSelectedIds(new Set());
    setSearchQuery('');
  };

  const navigateUp = () => {
    if (currentFolder && currentFolder.parentId) {
      navigate(currentFolder.parentId);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const handleCreateFolder = () => {
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      parentId: currentPath,
      name: 'New Folder',
      type: 'folder',
      dateModified: new Date().toLocaleDateString(),
      size: ''
    };
    fsItems.push(newFolder);
    setRenamingId(newFolder.id);
    setRenameValue(newFolder.name);
    setSelectedIds(new Set([newFolder.id]));
    forceUpdate();
    setContextMenu(null);
  };

  const handleDelete = () => {
    fsItems = fsItems.filter(i => !selectedIds.has(i.id));
    // Also delete children recursively (simplified: just one level for now or strict parent check)
    const idsToDelete = new Set(selectedIds);
    let changed = true;
    while(changed) {
        changed = false;
        fsItems.forEach(i => {
            if (i.parentId && idsToDelete.has(i.parentId) && !idsToDelete.has(i.id)) {
                idsToDelete.add(i.id);
                changed = true;
            }
        });
    }
    fsItems = fsItems.filter(i => !idsToDelete.has(i.id));
    
    setSelectedIds(new Set());
    forceUpdate();
    setContextMenu(null);
  };

  const handleRename = () => {
    if (selectedIds.size === 1) {
        const id = Array.from(selectedIds)[0];
        const item = fsItems.find(i => i.id === id);
        if (item) {
            setRenamingId(id);
            setRenameValue(item.name);
        }
    }
    setContextMenu(null);
  };

  const submitRename = () => {
    if (renamingId) {
        const item = fsItems.find(i => i.id === renamingId);
        if (item) {
            item.name = renameValue;
        }
        setRenamingId(null);
        forceUpdate();
    }
  };

  // Clipboard Actions
  const handleCopy = () => {
      if (selectedIds.size > 0) {
          setClipboard({ op: 'copy', items: Array.from(selectedIds) });
      }
      setContextMenu(null);
  };

  const handleCut = () => {
      if (selectedIds.size > 0) {
          setClipboard({ op: 'cut', items: Array.from(selectedIds) });
      }
      setContextMenu(null);
  };

  const handlePaste = () => {
      if (!clipboard) return;
      
      const newItems: FileSystemItem[] = [];
      
      clipboard.items.forEach(id => {
          const originalItem = fsItems.find(i => i.id === id);
          if (originalItem) {
              if (clipboard.op === 'copy') {
                  // Clone
                  newItems.push({
                      ...originalItem,
                      id: Date.now().toString() + Math.random().toString().slice(2,8),
                      parentId: currentPath,
                      name: originalItem.name + ' - Copy',
                      dateModified: new Date().toLocaleDateString()
                  });
              } else if (clipboard.op === 'cut') {
                  // Move
                  originalItem.parentId = currentPath;
              }
          }
      });

      if (clipboard.op === 'copy') {
          fsItems.push(...newItems);
      } else {
          setClipboard(null); // Clear after cut
      }
      
      forceUpdate();
      setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, itemId: string | null) => {
      e.preventDefault();
      e.stopPropagation();
      
      // If clicking an item not currently selected, select it
      if (itemId && !selectedIds.has(itemId)) {
          setSelectedIds(new Set([itemId]));
      }
      // If clicking background, clear selection
      if (!itemId) {
          setSelectedIds(new Set());
      }
      
      setContextMenu({ x: e.clientX, y: e.clientY, targetId: itemId });
  };

  const selectedItem = selectedIds.size === 1 ? fsItems.find(i => i.id === Array.from(selectedIds)[0]) : null;

  return (
    <div className={`flex flex-col h-full ${bg} ${textColor} font-sans text-sm select-none relative`}>
      {/* 1. Header & Toolbar */}
      <div className={`${headerBg} flex flex-col pt-1 pb-2 px-2 border-b ${borderColor} gap-2`}>
        {/* Toolbar Row */}
        <div className="flex items-center gap-1">
            <button onClick={handleCreateFolder} className={`flex items-center gap-1 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition`}>
                <Plus size={16} className="text-blue-500" />
                <span>New</span>
            </button>
            <div className={`w-[1px] h-5 ${borderColor} mx-1`}></div>
            <button onClick={handleCut} className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30`} disabled={selectedIds.size === 0} title="Cut"><Scissors size={16} /></button>
            <button onClick={handleCopy} className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30`} disabled={selectedIds.size === 0} title="Copy"><Copy size={16} /></button>
            <button onClick={handlePaste} className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30`} disabled={!clipboard} title="Paste"><div className="relative"><Clipboard size={16} /><div className="absolute -bottom-1 -right-1 bg-blue-500 w-2 h-2 rounded-full"></div></div></button>
            <button onClick={handleRename} className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30`} disabled={selectedIds.size !== 1} title="Rename"><Edit2 size={16} /></button>
            <button onClick={handleDelete} className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30`} disabled={selectedIds.size === 0} title="Delete"><Trash2 size={16} /></button>
            <div className={`w-[1px] h-5 ${borderColor} mx-1`}></div>
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition ml-auto`} onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <LayoutGrid size={16} /> : <ListIcon size={16} />}
                <span>View</span>
            </button>
             <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-1 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition ${showPreview ? (isDarkMode ? 'bg-white/10' : 'bg-black/10') : ''}`} title="Preview Pane">
                <PanelRight size={16} />
                <span>Preview</span>
            </button>
        </div>

        {/* Address Bar Row */}
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                <button onClick={goBack} disabled={historyIndex === 0} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`}><ChevronLeft size={16} /></button>
                <button onClick={goForward} disabled={historyIndex === history.length - 1} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`}><ChevronRight size={16} /></button>
                <button onClick={navigateUp} disabled={!currentFolder?.parentId} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`}><ArrowUp size={16} /></button>
            </div>
            
            <div className={`flex-1 flex items-center px-3 py-1.5 ${isDarkMode ? 'bg-[#2d2d2d] border-[#333]' : 'bg-white border-[#e5e5e5]'} border rounded-md shadow-sm transition-colors`}>
                <Monitor size={14} className="mr-2 opacity-50" />
                <div className="flex items-center gap-1 text-xs">
                    <span className="opacity-50 hover:bg-black/5 px-1 rounded cursor-pointer" onClick={() => navigate('root')}>This PC</span>
                    <span className="opacity-30"><ChevronRight size={12}/></span>
                    {currentFolder && currentFolder.parentId !== 'root' && (
                        <>
                             {/* Simplified breadcrumbs for demo */}
                             <span className="font-medium px-1">{currentFolder.name}</span>
                        </>
                    )}
                    {currentFolder?.parentId === 'root' && <span className="font-medium px-1">{currentFolder.name}</span>}
                </div>
            </div>

            <div className={`w-64 flex items-center px-3 py-1.5 ${isDarkMode ? 'bg-[#2d2d2d] border-[#333]' : 'bg-white border-[#e5e5e5]'} border rounded-md shadow-sm`}>
                <Search size={14} className="mr-2 opacity-50" />
                <input 
                    type="text" 
                    placeholder={`Search ${currentFolder?.name || 'PC'}`}
                    className="bg-transparent border-none outline-none w-full text-xs placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-48 flex-shrink-0 ${sidebarBg} flex flex-col p-2 gap-1 overflow-y-auto border-r ${borderColor}`}>
             {/* Quick Access */}
             <div className="mb-2">
                 <div className={`px-2 py-1 text-xs font-semibold ${mutedText} flex items-center gap-1`}>
                    <Star size={12} /> Quick Access
                 </div>
                 {[
                    {id: 'desktop', icon: Monitor, label: 'Desktop'},
                    {id: 'downloads', icon: Download, label: 'Downloads'},
                    {id: 'documents', icon: FileText, label: 'Documents'},
                    {id: 'pictures', icon: ImageIcon, label: 'Pictures'},
                 ].map(item => (
                     <button 
                        key={item.id}
                        onClick={() => navigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-left transition ${currentPath === item.id ? itemSelected : ''}`}
                     >
                         <item.icon size={16} className={currentPath === item.id ? `text-${accentColor.tailwind}` : 'text-blue-400'} />
                         <span>{item.label}</span>
                     </button>
                 ))}
             </div>
             
             {/* This PC */}
             <div>
                 <div className={`px-2 py-1 text-xs font-semibold ${mutedText} flex items-center gap-1`}>
                    <Monitor size={12} /> This PC
                 </div>
                 <button 
                    onClick={() => navigate('c_drive')}
                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-left transition ${currentPath === 'c_drive' ? itemSelected : ''}`}
                 >
                     <HardDrive size={16} className="text-gray-400" />
                     <span>Local Disk (C:)</span>
                 </button>
             </div>
        </div>

        {/* File View */}
        <div 
          className={`flex-1 ${mainBg} overflow-y-auto p-4`} 
          onContextMenu={(e) => handleContextMenu(e, null)}
        >
             {/* Items Grid/List */}
             {items.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                     <Folder size={48} className="mb-2" />
                     <p>This folder is empty.</p>
                 </div>
             ) : (
                 <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2' : 'flex flex-col gap-1'}>
                     {items.map(item => {
                         const isSelected = selectedIds.has(item.id);
                         const isRenaming = renamingId === item.id;

                         return (
                            <div 
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (e.ctrlKey) {
                                        const newSet = new Set(selectedIds);
                                        newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
                                        setSelectedIds(newSet);
                                    } else {
                                        setSelectedIds(new Set([item.id]));
                                    }
                                }}
                                onDoubleClick={() => {
                                    if (item.type === 'folder' || item.type === 'drive') {
                                        navigate(item.id);
                                    }
                                }}
                                onContextMenu={(e) => handleContextMenu(e, item.id)}
                                className={`
                                    group rounded cursor-default border border-transparent
                                    ${viewMode === 'grid' ? 'flex flex-col items-center p-2 gap-2 text-center' : 'flex items-center px-2 py-1 gap-3'}
                                    ${isSelected ? `${itemSelected} ${isDarkMode ? 'border-white/10' : 'border-blue-200'}` : `hover:bg-black/5 dark:hover:bg-white/5`}
                                `}
                            >
                                <div className={viewMode === 'grid' ? 'w-12 h-12 flex items-center justify-center' : 'w-4 h-4'}>
                                    {React.cloneElement(getIcon(item.type), { size: viewMode === 'grid' ? 32 : 16 })}
                                </div>
                                
                                <div className="min-w-0 relative">
                                    {isRenaming ? (
                                        <input 
                                            autoFocus
                                            type="text" 
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') submitRename();
                                                if (e.key === 'Escape') setRenamingId(null);
                                            }}
                                            onBlur={submitRename}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full bg-white text-black border border-blue-500 rounded px-1 text-xs outline-none shadow-lg text-center"
                                        />
                                    ) : (
                                        <span className={`text-xs truncate ${isSelected ? '' : mutedText} group-hover:${textColor}`}>
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                                
                                {viewMode === 'list' && (
                                    <>
                                        <div className="flex-1"></div>
                                        <span className={`text-xs ${mutedText} w-24 text-right`}>{item.dateModified}</span>
                                        <span className={`text-xs ${mutedText} w-16 text-right`}>{item.size}</span>
                                    </>
                                )}
                            </div>
                         );
                     })}
                 </div>
             )}
        </div>

        {/* Preview Pane */}
        {showPreview && (
            <div className={`w-72 ${sidebarBg} border-l ${borderColor} flex flex-col p-6 items-center text-center animate-in slide-in-from-right-4 fade-in duration-300 overflow-y-auto`}>
                {selectedItem ? (
                    <>
                        <div className="w-32 h-32 mb-4 flex items-center justify-center rounded-lg shadow-sm bg-white/5">
                            {selectedItem.type === 'image' && selectedItem.content ? (
                                <img src={selectedItem.content} alt={selectedItem.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                React.cloneElement(getIcon(selectedItem.type), { size: 64 })
                            )}
                        </div>
                        <h3 className="font-semibold text-sm break-all mb-1">{selectedItem.name}</h3>
                        <p className={`text-xs ${mutedText} mb-4`}>{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}</p>
                        
                        <div className={`w-full text-left text-xs space-y-2 ${mutedText}`}>
                            <div className="flex justify-between">
                                <span>Modified</span>
                                <span>{selectedItem.dateModified}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Size</span>
                                <span>{selectedItem.size || '--'}</span>
                            </div>
                            
                            {/* File Content Preview */}
                            {selectedItem.type === 'text' && selectedItem.content && (
                                <div className={`mt-4 p-3 rounded border ${borderColor} ${mainBg} max-h-64 overflow-y-auto font-mono`}>
                                    <pre className="whitespace-pre-wrap">{selectedItem.content}</pre>
                                </div>
                            )}

                            {/* Image Info */}
                            {selectedItem.type === 'image' && (
                                <div className="mt-4">
                                    <p>Dimensions: 1920x1080</p>
                                    <p>Bit depth: 24</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={`flex flex-col items-center justify-center h-full opacity-40 text-xs ${mutedText}`}>
                        <Monitor size={48} className="mb-2" />
                        <p>Select a file to preview</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* 3. Status Bar */}
      <div className={`${headerBg} border-t ${borderColor} px-3 py-1 flex items-center justify-between text-xs ${mutedText}`}>
         <div>{items.length} items {selectedIds.size > 0 && `   |   ${selectedIds.size} item(s) selected`}</div>
         <div className="flex gap-4">
            <span onClick={() => setViewMode('list')} className="cursor-pointer hover:text-white"><ListIcon size={12}/></span>
            <span onClick={() => setViewMode('grid')} className="cursor-pointer hover:text-white"><LayoutGrid size={12}/></span>
         </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
         <div 
             className={`fixed z-[9999] w-48 rounded-lg shadow-2xl border ${borderColor} ${isDarkMode ? 'bg-[#2d2d2d]/95 text-white' : 'bg-white/95 text-black'} backdrop-blur-md p-1 text-sm select-none animate-in fade-in zoom-in-95 duration-100`}
             style={{ top: contextMenu.y, left: contextMenu.x }}
             onClick={(e) => e.stopPropagation()}
         >
             {contextMenu.targetId ? (
                 <>
                    {/* Item Menu */}
                    <button 
                        className={`w-full text-left px-3 py-2 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors font-semibold`}
                        onClick={() => {
                            const item = fsItems.find(i => i.id === contextMenu.targetId);
                            if (item && (item.type === 'folder' || item.type === 'drive')) {
                                navigate(item.id);
                            }
                            setContextMenu(null);
                        }}
                    >
                        <ExternalLink size={14} /> Open
                    </button>
                    <div className={`h-[1px] ${borderColor} my-1 mx-2`}></div>
                    <button onClick={handleCut} className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors`}>
                        <Scissors size={14} /> Cut
                    </button>
                    <button onClick={handleCopy} className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors`}>
                        <Copy size={14} /> Copy
                    </button>
                    <div className={`h-[1px] ${borderColor} my-1 mx-2`}></div>
                    <button onClick={handleRename} className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors`}>
                        <Edit2 size={14} /> Rename
                    </button>
                    <button onClick={handleDelete} className={`w-full text-left px-3 py-1.5 rounded hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors text-red-400`}>
                        <Trash2 size={14} /> Delete
                    </button>
                 </>
             ) : (
                 <>
                    {/* Background Menu */}
                    <button onClick={() => { setViewMode(viewMode === 'grid' ? 'list' : 'grid'); setContextMenu(null); }} className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors`}>
                        {viewMode === 'grid' ? <ListIcon size={14} /> : <LayoutGrid size={14} />} 
                        {viewMode === 'grid' ? 'View as List' : 'View as Grid'}
                    </button>
                    <button onClick={handleCreateFolder} className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors`}>
                        <Plus size={14} /> New Folder
                    </button>
                    <div className={`h-[1px] ${borderColor} my-1 mx-2`}></div>
                    <button 
                        onClick={handlePaste} 
                        disabled={!clipboard}
                        className={`w-full text-left px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit`}
                    >
                        <Clipboard size={14} /> Paste
                    </button>
                 </>
             )}
         </div>
      )}
    </div>
  );
};

export default FileExplorerApp;
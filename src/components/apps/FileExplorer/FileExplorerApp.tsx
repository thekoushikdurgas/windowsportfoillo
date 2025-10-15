'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  Search, 
  MoreHorizontal, 
  Grid3X3, 
  List, 
  ArrowLeft, 
  ArrowRight,
  RefreshCw,
  Home,
  Download,
  Music,
  Image,
  Video,
  FileText
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  icon: React.ReactNode;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modified: '2024-01-15',
    icon: <Folder className="w-5 h-5 text-blue-500" />
  },
  {
    id: '2',
    name: 'Downloads',
    type: 'folder',
    modified: '2024-01-14',
    icon: <Download className="w-5 h-5 text-blue-500" />
  },
  {
    id: '3',
    name: 'Pictures',
    type: 'folder',
    modified: '2024-01-13',
    icon: <Image className="w-5 h-5 text-blue-500" /> // eslint-disable-line jsx-a11y/alt-text
  },
  {
    id: '4',
    name: 'Music',
    type: 'folder',
    modified: '2024-01-12',
    icon: <Music className="w-5 h-5 text-blue-500" />
  },
  {
    id: '5',
    name: 'Videos',
    type: 'folder',
    modified: '2024-01-11',
    icon: <Video className="w-5 h-5 text-blue-500" />
  },
  {
    id: '6',
    name: 'Desktop',
    type: 'folder',
    modified: '2024-01-10',
    icon: <Home className="w-5 h-5 text-blue-500" />
  },
  {
    id: '7',
    name: 'project-report.pdf',
    type: 'file',
    size: '2.4 MB',
    modified: '2024-01-09',
    icon: <FileText className="w-5 h-5 text-red-500" />
  },
  {
    id: '8',
    name: 'presentation.pptx',
    type: 'file',
    size: '5.1 MB',
    modified: '2024-01-08',
    icon: <FileText className="w-5 h-5 text-orange-500" />
  },
  {
    id: '9',
    name: 'budget.xlsx',
    type: 'file',
    size: '1.8 MB',
    modified: '2024-01-07',
    icon: <FileText className="w-5 h-5 text-green-500" />
  }
];

export default function FileExplorerApp() {
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = mockFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(currentPath + file.name + '/');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-windows-surface flex flex-col"
    >
      {/* Header */}
      <div className="bg-windows-gray border-b border-windows-border p-4">
        <div className="flex items-center gap-4 mb-4">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-windows-surface-hover rounded-md transition-colors"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-windows-text" />
            </button>
            <button 
              className="p-2 hover:bg-windows-surface-hover rounded-md transition-colors"
              aria-label="Go forward"
              title="Go forward"
            >
              <ArrowRight className="w-4 h-4 text-windows-text" />
            </button>
            <button 
              className="p-2 hover:bg-windows-surface-hover rounded-md transition-colors"
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-windows-text" />
            </button>
          </div>

          {/* Address bar */}
          <div className="flex-1 bg-white rounded-md px-3 py-2 text-sm text-windows-text border border-windows-border">
            {currentPath || '/'}
          </div>

          {/* View controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              aria-label="Switch to list view"
              title="Switch to list view"
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-windows-blue text-white' : 'hover:bg-windows-surface-hover'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Switch to grid view"
              title="Switch to grid view"
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-windows-blue text-white' : 'hover:bg-windows-surface-hover'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button 
              className="p-2 hover:bg-windows-surface-hover rounded-md transition-colors"
              aria-label="More options"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-windows-text" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-windows-text-light" />
          <input
            type="text"
            placeholder="Search files and folders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-windows-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-windows-blue"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Navigation pane */}
        <div className="w-64 bg-windows-gray border-r border-windows-border p-4">
          <h3 className="text-sm font-semibold text-windows-text mb-3">Quick access</h3>
          <div className="space-y-1">
            {[
              { name: 'Desktop', icon: <Home className="w-4 h-4" /> },
              { name: 'Downloads', icon: <Download className="w-4 h-4" /> },
              { name: 'Documents', icon: <Folder className="w-4 h-4" /> },
              { name: 'Pictures', icon: <Image className="w-4 h-4" /> }, // eslint-disable-line jsx-a11y/alt-text
              { name: 'Music', icon: <Music className="w-4 h-4" /> },
              { name: 'Videos', icon: <Video className="w-4 h-4" /> }
            ].map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 p-2 text-left hover:bg-windows-surface-hover rounded-md transition-colors"
              >
                <span className="text-windows-text">{item.icon}</span>
                <span className="text-sm text-windows-text">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 p-4">
          {viewMode === 'list' ? (
            <div className="space-y-1">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-windows-text-light border-b border-windows-border">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Date modified</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
              </div>
              
              {/* File rows */}
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleFileClick(file.id)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                  className={`grid grid-cols-12 gap-4 px-4 py-2 text-sm hover:bg-windows-surface-hover rounded-md transition-colors cursor-pointer ${
                    selectedFiles.includes(file.id) ? 'bg-windows-blue text-white' : ''
                  }`}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <span className={selectedFiles.includes(file.id) ? 'text-white' : ''}>
                      {file.icon}
                    </span>
                    <span className={selectedFiles.includes(file.id) ? 'text-white' : 'text-windows-text'}>
                      {file.name}
                    </span>
                  </div>
                  <div className={`col-span-2 ${selectedFiles.includes(file.id) ? 'text-white' : 'text-windows-text-light'}`}>
                    {file.modified}
                  </div>
                  <div className={`col-span-2 ${selectedFiles.includes(file.id) ? 'text-white' : 'text-windows-text-light'}`}>
                    {file.type === 'folder' ? 'File folder' : 'File'}
                  </div>
                  <div className={`col-span-2 ${selectedFiles.includes(file.id) ? 'text-white' : 'text-windows-text-light'}`}>
                    {file.size || '-'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleFileClick(file.id)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                  className={`p-4 text-center hover:bg-windows-surface-hover rounded-lg transition-colors cursor-pointer ${
                    selectedFiles.includes(file.id) ? 'bg-windows-blue text-white' : ''
                  }`}
                >
                  <div className="mb-2 flex justify-center">
                    <span className={selectedFiles.includes(file.id) ? 'text-white' : ''}>
                      {file.icon}
                    </span>
                  </div>
                  <div className={`text-xs font-medium break-words ${
                    selectedFiles.includes(file.id) ? 'text-white' : 'text-windows-text'
                  }`}>
                    {file.name}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-windows-gray border-t border-windows-border px-4 py-2 text-sm text-windows-text-light">
        {selectedFiles.length > 0 ? (
          <span>{selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''} selected</span>
        ) : (
          <span>{filteredFiles.length} item{filteredFiles.length > 1 ? 's' : ''}</span>
        )}
      </div>
    </motion.div>
  );
}

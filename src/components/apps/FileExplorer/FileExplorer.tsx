'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WindowState } from '@/types/window'

interface FileExplorerProps {
  window: WindowState
}

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  size?: string
  modified: string
  icon: string
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modified: '2024-01-15',
    icon: '📁'
  },
  {
    id: '2',
    name: 'Downloads',
    type: 'folder',
    modified: '2024-01-14',
    icon: '📁'
  },
  {
    id: '3',
    name: 'Pictures',
    type: 'folder',
    modified: '2024-01-13',
    icon: '📁'
  },
  {
    id: '4',
    name: 'Music',
    type: 'folder',
    modified: '2024-01-12',
    icon: '📁'
  },
  {
    id: '5',
    name: 'Videos',
    type: 'folder',
    modified: '2024-01-11',
    icon: '📁'
  },
  {
    id: '6',
    name: 'readme.txt',
    type: 'file',
    size: '2.1 KB',
    modified: '2024-01-10',
    icon: '📄'
  },
  {
    id: '7',
    name: 'project.pdf',
    type: 'file',
    size: '1.2 MB',
    modified: '2024-01-09',
    icon: '📄'
  }
]

export default function FileExplorer({ window }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState('This PC')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.name)
    }
  }

  const handleItemSelect = (itemId: string, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      setSelectedItems((prev: string[]) => 
        prev.includes(itemId) 
          ? prev.filter((id: string) => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setSelectedItems([itemId])
    }
  }

  return (
    <div className="flex h-full bg-windows-surface dark:bg-windows-surface-dark">
      {/* Sidebar */}
      <div className="w-64 sm:w-48 md:w-56 lg:w-64 bg-windows-gray-light dark:bg-windows-surface-elevated-dark border-r border-windows-border dark:border-windows-border-dark flex-shrink-0">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            {['Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-2 py-1 text-sm text-text-secondary dark:text-text-secondary-dark hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-windows-gray-light dark:bg-windows-surface-elevated-dark border-b border-windows-border dark:border-windows-border-dark flex items-center px-4 gap-2">
          <button className="p-1 hover:bg-windows-gray dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors">
            ←
          </button>
          <button className="p-1 hover:bg-windows-gray dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors">
            →
          </button>
          <button className="p-1 hover:bg-windows-gray dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors">
            ↻
          </button>
          <div className="w-px h-6 bg-windows-border dark:bg-windows-border-dark mx-2" />
          <button className="p-1 hover:bg-windows-gray dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors">
            ↑
          </button>
          <div className="flex-1" />
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-1 hover:bg-windows-gray dark:hover:bg-windows-gray-dark rounded-windows-sm transition-colors"
          >
            {viewMode === 'list' ? '⊞' : '⊡'}
          </button>
        </div>

        {/* Address Bar */}
        <div className="h-8 bg-windows-surface dark:bg-windows-surface-dark border-b border-windows-border dark:border-windows-border-dark flex items-center px-4">
          <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
            {currentPath}
          </span>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'list' ? (
            <div className="p-4">
              <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs text-text-secondary dark:text-text-secondary-dark border-b border-windows-border dark:border-windows-border-dark pb-2 mb-2">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Date modified</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
              </div>
              {mockFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 py-2 px-2 rounded-windows-sm cursor-pointer hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors ${
                    selectedItems.includes(file.id) ? 'bg-windows-accent-light dark:bg-windows-gray-dark' : ''
                  }`}
                  onClick={() => handleItemClick(file)}
                  onMouseDown={(e: React.MouseEvent) => handleItemSelect(file.id, e.ctrlKey)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="col-span-6 flex items-center gap-2">
                    <span className="text-lg">{file.icon}</span>
                    <span className="text-sm text-text-primary dark:text-text-primary-dark truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                    {file.modified}
                  </div>
                  <div className="col-span-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                    {file.type === 'folder' ? 'File folder' : 'Text Document'}
                  </div>
                  <div className="col-span-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                    {file.size || '-'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {mockFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className={`flex flex-col items-center p-4 rounded-windows cursor-pointer hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors ${
                    selectedItems.includes(file.id) ? 'bg-windows-accent-light dark:bg-windows-gray-dark' : ''
                  }`}
                  onClick={() => handleItemClick(file)}
                  onMouseDown={(e: React.MouseEvent) => handleItemSelect(file.id, e.ctrlKey)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-2">{file.icon}</div>
                  <div className="text-xs text-text-primary dark:text-text-primary-dark text-center truncate w-full">
                    {file.name}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

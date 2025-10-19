'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, FileText, Download } from 'lucide-react'

export default function Notepad() {
  const [content, setContent] = useState('Welcome to DurgasOS Notepad!\n\nThis is a simple text editor built with React and TypeScript.\n\nYou can:\n- Type and edit text\n- Save your work\n- Download files\n- Enjoy the Windows 11-like interface\n\nStart typing to begin...')
  const [fileName, setFileName] = useState('Untitled.txt')
  const [isModified, setIsModified] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsModified(content !== 'Welcome to DurgasOS Notepad!\n\nThis is a simple text editor built with React and TypeScript.\n\nYou can:\n- Type and edit text\n- Save your work\n- Download files\n- Enjoy the Windows 11-like interface\n\nStart typing to begin...')
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleSave = () => {
    // In a real app, this would save to a backend or local storage
    console.log('Saving file:', fileName, content)
    setIsModified(false)
    // Show success message
    alert('File saved successfully!')
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNewFile = () => {
    if (isModified) {
      const shouldSave = confirm('Do you want to save changes to the current file?')
      if (shouldSave) {
        handleSave()
      }
    }
    setContent('')
    setFileName('Untitled.txt')
    setIsModified(false)
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex items-center space-x-2"
      >
        <motion.button
          className="flex items-center space-x-1 px-3 py-1 bg-windows-blue text-white rounded hover:bg-windows-blue-dark transition-colors"
          onClick={handleNewFile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">New</span>
        </motion.button>

        <motion.button
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </motion.button>

        <motion.button
          className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Download</span>
        </motion.button>

        <div className="flex-1" />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {fileName} {isModified && '*'}
        </div>
      </motion.div>

      {/* Text Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-4"
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          className="w-full h-full resize-none outline-none bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed"
          placeholder="Start typing..."
          autoFocus
        />
      </motion.div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
      >
        <div>
          Characters: {content.length} | Words: {content.trim().split(/\s+/).filter(word => word.length > 0).length}
        </div>
        <div>
          DurgasOS Notepad v1.0
        </div>
      </motion.div>
    </div>
  )
}

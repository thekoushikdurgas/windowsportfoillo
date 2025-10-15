'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Save, 
  FolderOpen, 
  Printer, 
  Bold, 
  Italic, 
  Underline 
} from 'lucide-react';

export default function NotepadApp() {
  const [content, setContent] = useState('Welcome to Notepad!\n\nThis is a simple text editor built for the Windows 11 clone.\n\nYou can type your notes, thoughts, or any text here.\n\nFeatures:\n- Simple and clean interface\n- Auto-save functionality\n- Word count display\n- Basic formatting options\n\nStart typing to begin...');
  const [fileName, setFileName] = useState('Untitled');
  const [isModified, setIsModified] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsModified(true);
    
    // Calculate word count
    const words = newContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleSave = () => {
    // Simulate save functionality
    setIsModified(false);
    // In a real app, this would save to file system
    // Saving file: fileName
  };

  const handleOpen = () => {
    // Simulate open functionality
    // Opening file...
  };

  const handleNew = () => {
    if (isModified) {
      if (confirm('Do you want to save changes?')) {
        handleSave();
      }
    }
    setContent('');
    setFileName('Untitled');
    setIsModified(false);
    setWordCount(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-windows-surface flex flex-col"
    >
      {/* Menu Bar */}
      <div className="bg-windows-gray border-b border-windows-border p-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-windows-text">File</span>
            <button
              onClick={handleNew}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              New
            </button>
            <button
              onClick={handleOpen}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Open
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Save
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-windows-text">Edit</span>
            <button
              onClick={() => document.execCommand('undo')}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Undo
            </button>
            <button
              onClick={() => document.execCommand('redo')}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Redo
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-windows-text">Format</span>
            <button
              onClick={() => document.execCommand('bold')}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Bold
            </button>
            <button
              onClick={() => document.execCommand('italic')}
              className="px-2 py-1 hover:bg-windows-surface-hover rounded text-windows-text"
            >
              Italic
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-windows-gray border-b border-windows-border p-2">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNew}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text"
            title="New"
          >
            <FileText className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text"
            title="Open"
          >
            <FolderOpen className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text"
            title="Save"
          >
            <Save className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-windows-border mx-2" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.execCommand('bold')}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text font-bold"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.execCommand('italic')}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text italic"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.execCommand('underline')}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text underline"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </motion.button>
          
          <div className="w-px h-6 bg-windows-border mx-2" />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="p-2 hover:bg-windows-surface-hover rounded text-windows-text"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Text Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full resize-none outline-none bg-transparent text-windows-text font-mono text-sm leading-relaxed"
          placeholder="Start typing your notes here..."
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-windows-gray border-t border-windows-border px-4 py-2 flex items-center justify-between text-sm text-windows-text-light">
        <div className="flex items-center gap-4">
          <span>{fileName}{isModified ? ' *' : ''}</span>
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ready</span>
        </div>
      </div>
    </motion.div>
  );
}

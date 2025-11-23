'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Save, File } from 'lucide-react';

const NotepadApp: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    // In a real app, this would save to a file system
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    if (content && !confirm('Do you want to save changes?')) {
      return;
    }
    setContent('');
    setFileName('Untitled');
  };

  return (
    <div className={cn('notepad-container')} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Toolbar */}
      <div className="notepad-toolbar">
        <button
          onClick={handleNew}
          className="notepad-toolbar-button"
          title="New"
        >
          <File size={16} />
        </button>
        <button
          onClick={handleSave}
          className="notepad-toolbar-button"
          title="Save"
        >
          <Save size={16} />
        </button>
        <div className="notepad-toolbar-spacer"></div>
        <span className="notepad-toolbar-filename">{fileName}</span>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="notepad-editor win11-scrollbar"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default NotepadApp;


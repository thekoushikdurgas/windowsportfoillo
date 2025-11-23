'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { FileText, Save, File } from 'lucide-react';

const NotepadApp: React.FC<WindowProps> = ({ windowId, isActive }) => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgColor = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';

  // Auto-focus on mount
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

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
    <div className={cn('h-full flex flex-col', bgColor, textColor)}>
      {/* Toolbar */}
      <div className={cn(
        'h-10 flex items-center gap-2 px-4 border-b shrink-0',
        borderColor,
        isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'
      )}>
        <button
          onClick={handleNew}
          className={cn('p-2 rounded transition', hoverBg)}
          title="New"
        >
          <File size={16} />
        </button>
        <button
          onClick={handleSave}
          className={cn('p-2 rounded transition', hoverBg)}
          title="Save"
        >
          <Save size={16} />
        </button>
        <div className="flex-1"></div>
        <span className="text-xs opacity-70">{fileName}</span>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={cn(
          'flex-1 w-full p-4 resize-none outline-none',
          bgColor,
          textColor,
          'font-mono text-sm',
          'win11-scrollbar'
        )}
        placeholder="Start typing..."
        style={{
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }}
      />
    </div>
  );
};

export default NotepadApp;


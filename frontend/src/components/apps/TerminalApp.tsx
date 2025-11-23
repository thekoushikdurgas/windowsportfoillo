'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Terminal as TerminalIcon } from 'lucide-react';

interface Command {
  input: string;
  output: string;
  timestamp: number;
}

const TerminalApp: React.FC<WindowProps> = ({ windowId, isActive }) => {
  const { isDarkMode } = useTheme();
  const [commands, setCommands] = useState<Command[]>([
    { input: 'Welcome to DurgasOS Terminal', output: '', timestamp: Date.now() },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const textColor = isDarkMode ? 'text-green-400' : 'text-green-700';
  const bgColor = isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#1e1e1e]';
  const promptColor = isDarkMode ? 'text-blue-400' : 'text-blue-300';

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive, commands]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  date     - Show current date and time
  echo     - Echo back the input
  ls       - List files (mock)
  pwd      - Print working directory
  whoami   - Show current user
  exit     - Close terminal`;
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'durgas-user';
        break;
      case 'pwd':
        output = '/home/durgas-user';
        break;
      case 'ls':
        output = 'Documents  Downloads  Pictures  Videos  Desktop';
        break;
      case 'exit':
        // Close window - would need window management
        output = 'Use window controls to close';
        break;
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = trimmedCmd.substring(5);
        } else if (trimmedCmd) {
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }

    if (output) {
      setCommands(prev => [
        ...prev,
        { input: cmd, output, timestamp: Date.now() },
      ]);
    }

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        executeCommand(currentInput);
        setCurrentInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className={cn('h-full flex flex-col', bgColor)}>
      {/* Header */}
      <div className={cn(
        'h-10 flex items-center gap-2 px-4 border-b shrink-0',
        isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-black/10 bg-[#2d2d2d]'
      )}>
        <TerminalIcon size={16} className={textColor} />
        <span className={cn('text-sm font-medium', textColor)}>Terminal</span>
      </div>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm win11-scrollbar"
        style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={promptColor}>durgas-user@durgasos:~$</span>
              <span className={textColor}>{cmd.input}</span>
            </div>
            {cmd.output && (
              <div className={cn('ml-4', textColor)}>{cmd.output}</div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className={promptColor}>durgas-user@durgasos:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex-1 bg-transparent outline-none',
              textColor
            )}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;


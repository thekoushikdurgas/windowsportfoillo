import { useState, useCallback, useRef, useEffect } from 'react';
import { TerminalState, CommandHistory } from '@/types/terminal';
import { parseCommand, executeCommand, commandRegistry } from '@/lib/terminal-commands';

export const useTerminal = (initialDirectory: string[] = ['Users', 'Durgas']) => {
  const [state, setState] = useState<TerminalState>({
    history: [],
    currentDirectory: initialDirectory,
    environment: {
      USER: 'durgas',
      HOME: '/Users/Durgas',
      PATH: '/usr/bin:/bin:/usr/sbin:/sbin',
      PWD: '/Users/Durgas',
      SHELL: '/bin/bash'
    },
    aliases: {
      ll: 'ls -l',
      la: 'ls -a',
      lla: 'ls -la'
    },
    jobs: [],
    prompt: '$',
    isExecuting: false,
    commandHistory: [],
    historyIndex: -1
  });

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [state.history]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addToHistory = useCallback((command: string, output: string, exitCode: number, duration: number) => {
    const historyItem: CommandHistory = {
      id: Date.now().toString(),
      command,
      output,
      timestamp: new Date(),
      exitCode,
      duration,
      workingDirectory: state.currentDirectory.join('/')
    };

    setState(prev => ({
      ...prev,
      history: [...prev.history, historyItem],
      commandHistory: [...prev.commandHistory, command],
      historyIndex: prev.commandHistory.length
    }));
  }, [state.currentDirectory]);

  const executeCommandHandler = useCallback(async (commandInput: string) => {
    if (!commandInput.trim()) return;

    setState(prev => ({ ...prev, isExecuting: true }));

    try {
      const parsedCommand = parseCommand(commandInput);
      const result = await executeCommand(parsedCommand, state);
      
      // Handle special commands that modify state
      if (parsedCommand.command === 'cd') {
        const newPath = parsedCommand.args.length === 0 ? ['Users', 'Durgas'] : 
          parsedCommand.args[0] === '..' ? state.currentDirectory.slice(0, -1) :
          parsedCommand.args[0] === '.' ? state.currentDirectory :
          parsedCommand.args[0]?.startsWith('/') ? 
            parsedCommand.args[0].split('/').filter(Boolean) :
            parsedCommand.args[0] ? [...state.currentDirectory, parsedCommand.args[0]] : state.currentDirectory;

        setState(prev => ({
          ...prev,
          currentDirectory: newPath,
          environment: {
            ...prev.environment,
            PWD: `/${newPath.join('/')}`
          }
        }));
      }

      addToHistory(commandInput, result.output, result.exitCode, result.duration);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addToHistory(commandInput, `Error: ${errorMessage}`, 1, 0);
    } finally {
      setState(prev => ({ ...prev, isExecuting: false }));
    }
  }, [state, addToHistory]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommandHandler(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        setState(prev => ({ ...prev, historyIndex: newIndex }));
        setInput(state.commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.historyIndex < state.commandHistory.length - 1) {
        const newIndex = state.historyIndex + 1;
        setState(prev => ({ ...prev, historyIndex: newIndex }));
        setInput(state.commandHistory[newIndex] || '');
      } else {
        setState(prev => ({ ...prev, historyIndex: state.commandHistory.length }));
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion - could be enhanced
      const currentInput = input.trim();
      const commands = Object.keys(commandRegistry);
      const matches = commands.filter(cmd => cmd.startsWith(currentInput));
      
      if (matches.length === 1) {
        setInput(`${matches[0]} `);
      } else if (matches.length > 1) {
        // Show possible completions
        const completionOutput = matches.join('  ');
        addToHistory('', `Possible completions: ${completionOutput}`, 0, 0);
      }
    }
  }, [input, state.historyIndex, state.commandHistory, executeCommandHandler, addToHistory]);

  const clearTerminal = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const exportHistory = useCallback(() => {
    const historyText = state.history
      .map(item => `${item.timestamp.toISOString()} [${item.exitCode}] ${item.workingDirectory}$ ${item.command}\n${item.output}`)
      .join('\n\n');
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.history]);

  const getPrompt = useCallback(() => {
    const path = state.currentDirectory.length === 0 ? '/' : `/${state.currentDirectory.join('/')}`;
    const userName = state.environment['USER'];
    return `${userName}@durgasos:${path}$`;
  }, [state.currentDirectory, state.environment]);

  return {
    state,
    input,
    setInput,
    inputRef,
    historyRef,
    executeCommand: executeCommandHandler,
    handleKeyPress,
    clearTerminal,
    exportHistory,
    getPrompt
  };
};

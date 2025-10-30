'use client';

import { useTerminal } from '@/hooks/use-terminal';
import { CommandHistory } from '@/types/terminal';

export default function Terminal() {
  const {
    state,
    input,
    setInput,
    inputRef,
    historyRef,
    handleKeyPress,
    clearTerminal,
    exportHistory,
    getPrompt
  } = useTerminal();

  const renderHistoryItem = (item: CommandHistory, index: number) => {
    const isError = item.exitCode !== 0;
    
    return (
      <div key={item.id} className="space-y-1">
        {/* Command line */}
        <div className="flex items-start">
          <span className="text-green-400 flex-shrink-0">
            {getPrompt()}
          </span>
          <span className="text-green-400 ml-1">{item.command}</span>
        </div>
        
        {/* Output */}
        {item.output && (
          <div className={`ml-4 ${isError ? 'text-red-400' : 'text-green-300'}`}>
            {item.output.split('\n').map((line) => (
              <div key={`${item.id}-line-${line}`}>{line}</div>
            ))}
          </div>
        )}
        
        {/* Status info */}
        {state.history.length > 0 && index === state.history.length - 1 && (
          <div className="text-xs text-gray-500 ml-4">
            Exit code: {item.exitCode} | Duration: {item.duration}ms
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-green-800 bg-green-900/20">
        <div className="flex items-center space-x-4">
          <span className="text-green-400 font-bold">Terminal</span>
          <span className="text-green-300 text-xs">
            {state.history.length} commands | {state.currentDirectory.join('/')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearTerminal}
            className="px-2 py-1 text-xs bg-green-800 hover:bg-green-700 rounded transition-colors"
            title="Clear terminal"
          >
            Clear
          </button>
          <button
            onClick={exportHistory}
            className="px-2 py-1 text-xs bg-green-800 hover:bg-green-700 rounded transition-colors"
            title="Export history"
          >
            Export
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={historyRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {state.history.length === 0 ? (
          <div className="space-y-2">
            <div className="text-green-400">
              Welcome to DurgasOS Terminal v2.0
            </div>
            <div className="text-green-300">
              Type &quot;help&quot; for available commands
            </div>
            <div className="text-green-300">
              Use arrow keys to navigate command history
            </div>
          </div>
        ) : (
          state.history.map((item, index) => renderHistoryItem(item, index))
        )}
      </div>

      {/* Command Input */}
      <div className="flex items-center p-2 border-t border-green-800 bg-green-900/10">
        <span className="text-green-400 flex-shrink-0">
          {getPrompt()}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-green-400 ml-1"
          autoFocus
          placeholder="Enter command..."
          title="Terminal input"
          disabled={state.isExecuting}
        />
        {state.isExecuting && (
          <div className="text-green-400 animate-pulse">
            Executing...
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-green-800 bg-green-900/20 text-xs text-green-300">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>Commands: {state.history.length}</span>
          <span>Jobs: {state.jobs.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>User: {state.environment['USER']}</span>
          <span>Shell: {state.environment['SHELL']}</span>
        </div>
      </div>
    </div>
  );
}

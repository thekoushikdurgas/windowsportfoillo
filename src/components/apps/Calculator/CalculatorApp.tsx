'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { persistence } from '@/utils/persistence';
import { notifications } from '@/services/notificationService';
import { 
  Calculator as CalculatorIcon, 
  History, 
  Settings,
  XSquare,
  Percent
} from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | '=' | 'C' | 'CE' | '.';
type CalculatorMode = 'standard' | 'scientific';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedHistory = persistence.getCalculatorHistory();
    const savedMemory = persistence.getCalculatorMemory();
    
    if (savedHistory.length > 0) {
      setHistory(savedHistory);
    }
    
    if (savedMemory !== 0) {
      setMemory(savedMemory);
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    persistence.debouncedSave({ 
      calculatorHistory: history,
      calculatorMemory: memory 
    });
  }, [history, memory]);

  const handleNumber = useCallback((num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [waitingForNewValue, display]);

  const handleOperation = useCallback((op: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(op);
  }, [display, previousValue, operation]);

  const calculate = (firstValue: number, secondValue: number, operation: Operation): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  }, []);

  const handleClearEntry = () => {
    setDisplay('0');
  };

  const handleDecimal = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [waitingForNewValue, display]);

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const expression = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [expression, ...prev.slice(0, 9)]); // Keep last 10 entries
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      
      // Show calculation notification for interesting results
      if (newValue === Math.PI) {
        notifications.toast('Special Result', 'You found π!', 'info', 'Calculator');
      } else if (newValue === Math.E) {
        notifications.toast('Special Result', 'You found e!', 'info', 'Calculator');
      } else if (Number.isInteger(newValue) && newValue > 1000) {
        notifications.toast('Large Number', `Result: ${newValue.toLocaleString()}`, 'info', 'Calculator');
      }
    }
  }, [display, previousValue, operation]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('+');
      } else if (e.key === '-') {
        handleOperation('-');
      } else if (e.key === '*') {
        handleOperation('*');
      } else if (e.key === '/') {
        handleOperation('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === 'Backspace') {
        setDisplay(display.slice(0, -1) || '0');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleNumber, handleDecimal, handleEquals, handleOperation, handleClear, display]);

  const handleMemoryAdd = () => {
    const newMemory = memory + parseFloat(display);
    setMemory(newMemory);
    notifications.toast('Memory Updated', `Added ${display} to memory`, 'success', 'Calculator');
  };

  const handleMemorySubtract = () => {
    const newMemory = memory - parseFloat(display);
    setMemory(newMemory);
    notifications.toast('Memory Updated', `Subtracted ${display} from memory`, 'success', 'Calculator');
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    notifications.toast('Memory Recalled', `Retrieved ${memory} from memory`, 'info', 'Calculator');
  };

  const handleMemoryClear = () => {
    setMemory(0);
    notifications.toast('Memory Cleared', 'Memory has been reset to 0', 'info', 'Calculator');
  };

  const handleScientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'percent':
        result = value / 100;
        break;
      default:
        return;
    }

    setDisplay(String(result));
  };

  const buttons = [
    { label: 'C', type: 'function', action: handleClear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: 'CE', type: 'function', action: handleClearEntry, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '⌫', type: 'function', action: () => setDisplay(display.slice(0, -1) || '0'), className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { label: '/', type: 'operation', action: () => handleOperation('/'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '7', type: 'number', action: () => handleNumber('7'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '8', type: 'number', action: () => handleNumber('8'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '9', type: 'number', action: () => handleNumber('9'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '*', type: 'operation', action: () => handleOperation('*'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '4', type: 'number', action: () => handleNumber('4'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '5', type: 'number', action: () => handleNumber('5'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '6', type: 'number', action: () => handleNumber('6'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '-', type: 'operation', action: () => handleOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '1', type: 'number', action: () => handleNumber('1'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '2', type: 'number', action: () => handleNumber('2'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '3', type: 'number', action: () => handleNumber('3'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '+', type: 'operation', action: () => handleOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '±', type: 'function', action: () => setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '0', type: 'number', action: () => handleNumber('0'), className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '.', type: 'function', action: handleDecimal, className: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
    { label: '=', type: 'operation', action: handleEquals, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-windows-surface flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <CalculatorIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-windows-text">Calculator</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'standard' ? 'scientific' : 'standard')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {mode === 'standard' ? 'Scientific' : 'Standard'}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="History"
          >
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Calculator */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Display */}
          <div className="mb-4">
            <div className="bg-gray-900 text-white p-6 rounded-xl text-right text-3xl font-mono min-h-[80px] flex items-center justify-end shadow-inner">
              <div className="truncate max-w-full">
                {display}
              </div>
            </div>
            
            {/* Memory indicator */}
            {memory !== 0 && (
              <div className="mt-2 text-right text-sm text-gray-600">
                Memory: {memory}
              </div>
            )}
          </div>

          {/* Memory buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={handleMemoryClear}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              MC
            </button>
            <button
              onClick={handleMemoryRecall}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              MR
            </button>
            <button
              onClick={handleMemoryAdd}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              M+
            </button>
            <button
              onClick={handleMemorySubtract}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              M-
            </button>
          </div>

          {/* Scientific functions (when in scientific mode) */}
          {mode === 'scientific' && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => handleScientificFunction('sqrt')}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                title="Square root"
              >
                √
              </button>
              <button
                onClick={() => handleScientificFunction('square')}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                title="Square"
              >
                <XSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScientificFunction('pi')}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                title="Pi"
              >
                π
              </button>
              <button
                onClick={() => handleScientificFunction('percent')}
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                title="Percent"
              >
                <Percent className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-2 flex-1">
            {buttons.map((button, index) => (
              <motion.button
                key={button.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.action}
                className={`p-4 rounded-xl font-semibold text-lg transition-all duration-150 shadow-sm hover:shadow-md ${button.className}`}
              >
                {button.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </h3>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No history yet</p>
              ) : (
                history.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 bg-white rounded-lg text-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      const result = entry.split(' = ')[1];
                      if (result) setDisplay(result);
                    }}
                  >
                    {entry}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

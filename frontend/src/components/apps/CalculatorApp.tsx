'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Calculator as CalculatorIcon } from 'lucide-react';

const CalculatorApp: React.FC<WindowProps> = ({ windowId, isActive }) => {
  const { isDarkMode } = useTheme();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgColor = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const buttonBg = isDarkMode ? 'bg-[#2d2d2d] hover:bg-[#3d3d3d]' : 'bg-gray-100 hover:bg-gray-200';
  const buttonBgAccent = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const buttonBgOperator = isDarkMode ? 'bg-[#383838] hover:bg-[#484848]' : 'bg-gray-200 hover:bg-gray-300';

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
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
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    colSpan?: number;
  }> = ({ onClick, className, children, colSpan = 1 }) => (
    <button
      onClick={onClick}
      className={cn(
        'h-16 rounded-lg font-semibold text-lg transition',
        className,
        `col-span-${colSpan}`
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn('h-full flex flex-col', bgColor, textColor)}>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <CalculatorIcon size={24} />
          <h1 className="text-xl font-semibold">Calculator</h1>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Display */}
          <div className={cn(
            'h-20 rounded-lg p-4 flex items-end justify-end text-right text-3xl font-light',
            isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50',
            'overflow-hidden'
          )}>
            {display}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3 flex-1">
            <Button onClick={clear} className={buttonBg}>
              AC
            </Button>
            <Button onClick={() => setDisplay(String(-parseFloat(display)))} className={buttonBg}>
              +/-
            </Button>
            <Button onClick={() => inputOperation('%')} className={buttonBg}>
              %
            </Button>
            <Button onClick={() => inputOperation('÷')} className={cn(buttonBgOperator, textColor)}>
              ÷
            </Button>

            <Button onClick={() => inputNumber('7')} className={buttonBg}>
              7
            </Button>
            <Button onClick={() => inputNumber('8')} className={buttonBg}>
              8
            </Button>
            <Button onClick={() => inputNumber('9')} className={buttonBg}>
              9
            </Button>
            <Button onClick={() => inputOperation('×')} className={cn(buttonBgOperator, textColor)}>
              ×
            </Button>

            <Button onClick={() => inputNumber('4')} className={buttonBg}>
              4
            </Button>
            <Button onClick={() => inputNumber('5')} className={buttonBg}>
              5
            </Button>
            <Button onClick={() => inputNumber('6')} className={buttonBg}>
              6
            </Button>
            <Button onClick={() => inputOperation('-')} className={cn(buttonBgOperator, textColor)}>
              -
            </Button>

            <Button onClick={() => inputNumber('1')} className={buttonBg}>
              1
            </Button>
            <Button onClick={() => inputNumber('2')} className={buttonBg}>
              2
            </Button>
            <Button onClick={() => inputNumber('3')} className={buttonBg}>
              3
            </Button>
            <Button onClick={() => inputOperation('+')} className={cn(buttonBgOperator, textColor)}>
              +
            </Button>

            <Button onClick={() => inputNumber('0')} className={buttonBg} colSpan={2}>
              0
            </Button>
            <Button onClick={inputDecimal} className={buttonBg}>
              .
            </Button>
            <Button onClick={performCalculation} className={cn(buttonBgAccent, 'text-white')}>
              =
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;


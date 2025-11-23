'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Calculator as CalculatorIcon } from 'lucide-react';

const CalculatorApp: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);


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
        'calculator-button',
        className,
        colSpan === 2 && 'calculator-button-col-span-2'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn('calculator-container')} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="calculator-content">
        <div className="calculator-header">
          <CalculatorIcon size={24} />
          <h1 className="calculator-title">Calculator</h1>
        </div>

        <div className="calculator-body">
          {/* Display */}
          <div className="calculator-display">
            {display}
          </div>

          {/* Buttons */}
          <div className="calculator-buttons">
            <Button onClick={clear}>
              AC
            </Button>
            <Button onClick={() => setDisplay(String(-parseFloat(display)))}>
              +/-
            </Button>
            <Button onClick={() => inputOperation('%')}>
              %
            </Button>
            <Button onClick={() => inputOperation('÷')} className="calculator-button-operator">
              ÷
            </Button>

            <Button onClick={() => inputNumber('7')}>
              7
            </Button>
            <Button onClick={() => inputNumber('8')}>
              8
            </Button>
            <Button onClick={() => inputNumber('9')}>
              9
            </Button>
            <Button onClick={() => inputOperation('×')} className="calculator-button-operator">
              ×
            </Button>

            <Button onClick={() => inputNumber('4')}>
              4
            </Button>
            <Button onClick={() => inputNumber('5')}>
              5
            </Button>
            <Button onClick={() => inputNumber('6')}>
              6
            </Button>
            <Button onClick={() => inputOperation('-')} className="calculator-button-operator">
              -
            </Button>

            <Button onClick={() => inputNumber('1')}>
              1
            </Button>
            <Button onClick={() => inputNumber('2')}>
              2
            </Button>
            <Button onClick={() => inputNumber('3')}>
              3
            </Button>
            <Button onClick={() => inputOperation('+')} className="calculator-button-operator">
              +
            </Button>

            <Button onClick={() => inputNumber('0')} colSpan={2}>
              0
            </Button>
            <Button onClick={inputDecimal}>
              .
            </Button>
            <Button onClick={performCalculation} className="calculator-button-accent">
              =
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;


'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const Button = ({ onClick, children, className = '' }: { onClick: () => void; children: React.ReactNode; className?: string }) => (
    <motion.button
      className={`h-16 rounded-lg font-semibold text-lg transition-colors ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 max-w-sm mx-auto"
      >
        {/* Display */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="text-right text-white text-3xl font-mono overflow-hidden">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button onClick={clear} className="col-span-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white">
            Clear
          </Button>
          <Button onClick={() => inputOperation('÷')} className="bg-orange-500 text-white">
            ÷
          </Button>
          <Button onClick={() => inputOperation('×')} className="bg-orange-500 text-white">
            ×
          </Button>

          {/* Row 2 */}
          <Button onClick={() => inputNumber('7')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            7
          </Button>
          <Button onClick={() => inputNumber('8')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            8
          </Button>
          <Button onClick={() => inputNumber('9')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            9
          </Button>
          <Button onClick={() => inputOperation('-')} className="bg-orange-500 text-white">
            -
          </Button>

          {/* Row 3 */}
          <Button onClick={() => inputNumber('4')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            4
          </Button>
          <Button onClick={() => inputNumber('5')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            5
          </Button>
          <Button onClick={() => inputNumber('6')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            6
          </Button>
          <Button onClick={() => inputOperation('+')} className="bg-orange-500 text-white">
            +
          </Button>

          {/* Row 4 */}
          <Button onClick={() => inputNumber('1')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            1
          </Button>
          <Button onClick={() => inputNumber('2')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            2
          </Button>
          <Button onClick={() => inputNumber('3')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            3
          </Button>
          <Button onClick={performCalculation} className="row-span-2 bg-orange-500 text-white">
            =
          </Button>

          {/* Row 5 */}
          <Button onClick={() => inputNumber('0')} className="col-span-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            0
          </Button>
          <Button onClick={inputDecimal} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            .
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

import React from 'react';

const Calculator = ({ onClose }: { onClose: () => void }) => {
  const buttons = [
    'C', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white select-none">
      <div className="flex-grow p-4 flex items-end justify-end text-5xl font-light">
        0
      </div>
      <div className="grid grid-cols-4 gap-px bg-gray-700">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`
              p-4 text-2xl text-center
              ${['/', '*', '-', '+', '='].includes(btn) ? 'bg-orange-500 hover:bg-orange-600' : ''}
              ${['C', '+/-', '%'].includes(btn) ? 'bg-gray-600 hover:bg-gray-700' : ''}
              ${!['/', '*', '-', '+', '=', 'C', '+/-', '%'].includes(btn) ? 'bg-gray-700 hover:bg-gray-800' : ''}
              ${btn === '0' ? 'col-span-2' : ''}
              transition-colors duration-200
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
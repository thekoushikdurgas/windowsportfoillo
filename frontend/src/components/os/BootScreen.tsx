'use client';

import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="mb-16">
          <svg width="100" height="100" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H42V42H0V0Z" fill="#0078D4"/>
            <path d="M46 0H88V42H46V0Z" fill="#0078D4"/>
            <path d="M0 46H42V88H0V46Z" fill="#0078D4"/>
            <path d="M46 46H88V88H46V46Z" fill="#0078D4"/>
          </svg>
       </div>
       <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default BootScreen;


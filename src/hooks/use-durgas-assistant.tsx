'use client';

import { createContext, useContext, useState, useCallback } from 'react';
// import { useDesktop } from '@/context/DesktopContext';

type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface DurgasAssistantContextType {
  isAssistantOpen: boolean;
  assistantState: AssistantState;
  toggleAssistant: () => void;
}

const DurgasAssistantContext = createContext<DurgasAssistantContextType | undefined>(undefined);

export const DurgasAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  // const { openApp } = useDesktop();

  const toggleAssistant = useCallback(() => {
    if (isAssistantOpen) {
      setIsAssistantOpen(false);
      setAssistantState('idle');
    } else {
      setIsAssistantOpen(true);
      setAssistantState('listening');
      
      // Simulate assistant interaction
      setTimeout(() => {
        setAssistantState('thinking');
      }, 2000);
      
      setTimeout(() => {
        setAssistantState('speaking');
      }, 4000);
      
      setTimeout(() => {
        setAssistantState('idle');
        setIsAssistantOpen(false);
      }, 6000);
    }
  }, [isAssistantOpen]);

  return (
    <DurgasAssistantContext.Provider
      value={{
        isAssistantOpen,
        assistantState,
        toggleAssistant,
      }}
    >
      {children}
    </DurgasAssistantContext.Provider>
  );
};

export const useDurgasAssistant = () => {
  const context = useContext(DurgasAssistantContext);
  if (!context) {
    throw new Error('useDurgasAssistant must be used within a DurgasAssistantProvider');
  }
  return context;
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslations, languageNames, languageFlags } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof ReturnType<typeof getTranslations>) => string;
  languageNames: typeof languageNames;
  languageFlags: typeof languageFlags;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLanguage = localStorage.getItem('durgasos-language') as Language;
    if (savedLanguage && ['en', 'bn', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('durgasos-language', language);
  }, [language]);

  const t = (key: keyof ReturnType<typeof getTranslations>): string => {
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languageNames,
    languageFlags
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

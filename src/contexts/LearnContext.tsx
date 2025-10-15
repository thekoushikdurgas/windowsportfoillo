'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  nextStep?: string;
  prevStep?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  appId: string;
  steps: TutorialStep[];
  completed: boolean;
}

interface LearnContextType {
  activeTutorial: Tutorial | null;
  currentStep: number;
  isTutorialActive: boolean;
  startTutorial: (appId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeTutorial: () => void;
  closeTutorial: () => void;
  showHelp: (context: string) => void;
}

const LearnContext = createContext<LearnContextType | undefined>(undefined);

// Enhanced tutorial data for different apps
const tutorials: Record<string, Tutorial> = {
  'about-me': {
    id: 'about-me-tutorial',
    title: 'About Me App Tutorial',
    description: 'Learn how to navigate and interact with the About Me application',
    appId: 'about-me',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to About Me! 👋',
        description: 'This is your personal portfolio app! Here you can showcase your skills, experience, and projects. Let\'s explore the different sections together.',
        position: 'bottom'
      },
      {
        id: 'navigation',
        title: 'Navigation Tabs',
        description: 'Use these tabs to navigate between different sections: Personal Info, Skills, Experience, Projects, and Contact.',
        position: 'top'
      },
      {
        id: 'personal-info',
        title: 'Personal Information 📋',
        description: 'This section contains your basic information, location, contact details, and a brief bio about yourself.',
        position: 'right'
      },
      {
        id: 'skills',
        title: 'Interactive Skills 🛠️',
        description: 'Here you can see your technical skills with interactive progress bars. Hover over each skill to see your proficiency level!',
        position: 'left'
      },
      {
        id: 'experience',
        title: 'Work Experience 💼',
        description: 'View your professional journey with detailed descriptions of your roles and achievements.',
        position: 'top'
      },
      {
        id: 'projects',
        title: 'Featured Projects 🚀',
        description: 'Showcase your best work with project cards that include technologies used and links to live demos.',
        position: 'left'
      },
      {
        id: 'contact',
        title: 'Contact & Social Links 📞',
        description: 'Make it easy for people to reach you with direct contact buttons and social media links.',
        position: 'top'
      },
      {
        id: 'learn-buttons',
        title: 'Learn More Buttons 💡',
        description: 'Look for "Learn more" buttons throughout the app for additional context and help with each section.',
        position: 'bottom'
      }
    ]
  },
  'file-explorer': {
    id: 'file-explorer-tutorial',
    title: 'File Explorer Tutorial',
    description: 'Learn how to navigate files and folders',
    appId: 'file-explorer',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to File Explorer',
        description: 'File Explorer helps you browse and manage files and folders on your system.',
        position: 'bottom'
      },
      {
        id: 'navigation',
        title: 'Navigation Pane',
        description: 'Use the left pane to navigate between different folders and drives.',
        position: 'right'
      },
      {
        id: 'file-list',
        title: 'File List',
        description: 'The main area shows files and folders in the current directory.',
        position: 'left'
      }
    ]
  },
  'settings': {
    id: 'settings-tutorial',
    title: 'Settings Tutorial',
    description: 'Learn how to customize your Windows 11 experience',
    appId: 'settings',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Settings ⚙️',
        description: 'Settings allows you to customize your system preferences and personalization options. Let\'s explore the different categories available.',
        position: 'bottom'
      },
      {
        id: 'categories',
        title: 'Settings Categories',
        description: 'Browse through different settings categories: System, Personalization, Apps, Privacy, and more. Each category contains related settings.',
        position: 'right'
      },
      {
        id: 'personalization',
        title: 'Personalization 🎨',
        description: 'Customize your desktop appearance, wallpaper, themes, and taskbar settings to make Windows 11 truly yours.',
        position: 'left'
      },
      {
        id: 'system',
        title: 'System Settings 💻',
        description: 'Manage display settings, sound preferences, notifications, and power options for optimal performance.',
        position: 'top'
      }
    ]
  },
  'calculator': {
    id: 'calculator-tutorial',
    title: 'Calculator Tutorial',
    description: 'Learn how to use the Windows 11 Calculator app',
    appId: 'calculator',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Calculator 🧮',
        description: 'The Calculator app provides a clean, modern interface for all your mathematical needs. Let\'s explore its features.',
        position: 'bottom'
      },
      {
        id: 'basic-operations',
        title: 'Basic Operations',
        description: 'Use the number pad and operation buttons (+, -, ×, ÷) for basic arithmetic calculations.',
        position: 'right'
      },
      {
        id: 'advanced-functions',
        title: 'Advanced Functions',
        description: 'Access scientific functions, memory operations, and special calculations using the function buttons.',
        position: 'left'
      },
      {
        id: 'history',
        title: 'Calculation History',
        description: 'View your previous calculations and reuse results for complex computations.',
        position: 'top'
      }
    ]
  },
  'notepad': {
    id: 'notepad-tutorial',
    title: 'Notepad Tutorial',
    description: 'Learn how to use the Windows 11 Notepad app',
    appId: 'notepad',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Notepad 📝',
        description: 'Notepad is a simple yet powerful text editor for taking notes, writing documents, and editing text files.',
        position: 'bottom'
      },
      {
        id: 'text-editing',
        title: 'Text Editing',
        description: 'Type directly in the text area. Use standard keyboard shortcuts like Ctrl+C, Ctrl+V, Ctrl+Z for copy, paste, and undo.',
        position: 'right'
      },
      {
        id: 'word-count',
        title: 'Word Count & Statistics',
        description: 'Monitor your document\'s word count, character count, and other statistics in real-time.',
        position: 'left'
      },
      {
        id: 'file-operations',
        title: 'File Operations',
        description: 'Use the context menu (right-click) to create new files, open existing ones, and save your work.',
        position: 'top'
      }
    ]
  },
  'desktop': {
    id: 'desktop-tutorial',
    title: 'Desktop Tutorial',
    description: 'Learn how to navigate and use the Windows 11 desktop',
    appId: 'desktop',
    completed: false,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Windows 11 Desktop 🖥️',
        description: 'This is your main workspace! Learn how to navigate, manage windows, and use the taskbar effectively.',
        position: 'bottom'
      },
      {
        id: 'desktop-icons',
        title: 'Desktop Icons',
        description: 'Double-click icons to open applications. Right-click for context menus with additional options.',
        position: 'right'
      },
      {
        id: 'taskbar',
        title: 'Taskbar Navigation',
        description: 'The taskbar shows open apps and provides quick access to the Start Menu, search, and system functions.',
        position: 'top'
      },
      {
        id: 'window-management',
        title: 'Window Management',
        description: 'Drag windows to move them, resize by dragging edges, and use the title bar buttons to minimize, maximize, or close.',
        position: 'left'
      },
      {
        id: 'learn-button',
        title: 'Learn Button 💡',
        description: 'Every app window has a Learn button (💡) in the title bar. Click it to get contextual help and tutorials!',
        position: 'bottom'
      }
    ]
  }
};

export function LearnProvider({ children }: { children: ReactNode }) {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  const startTutorial = (appId: string) => {
    const tutorial = tutorials[appId];
    if (tutorial) {
      setActiveTutorial(tutorial);
      setCurrentStep(0);
      setIsTutorialActive(true);
    }
  };

  const nextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      // Mark tutorial as completed
      tutorials[activeTutorial.id].completed = true;
      setIsTutorialActive(false);
      setActiveTutorial(null);
      setCurrentStep(0);
    }
  };

  const closeTutorial = () => {
    setIsTutorialActive(false);
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const showHelp = (_context: string) => {
    // Show contextual help based on the context
    // Showing help for context: context
  };

  return (
    <LearnContext.Provider
      value={{
        activeTutorial,
        currentStep,
        isTutorialActive,
        startTutorial,
        nextStep,
        prevStep,
        completeTutorial,
        closeTutorial,
        showHelp,
      }}
    >
      {children}
    </LearnContext.Provider>
  );
}

export function useLearn() {
  const context = useContext(LearnContext);
  if (context === undefined) {
    throw new Error('useLearn must be used within a LearnProvider');
  }
  return context;
}

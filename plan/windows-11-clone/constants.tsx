import React from 'react';
import { AppData } from './types';
import AboutMe from './apps/AboutMe';
import Welcome from './apps/Welcome';
import Notepad from './apps/Notepad';
import Calculator from './apps/Calculator';
import { UserIcon, FolderIcon, MailIcon, NotepadIcon, CalculatorIcon } from './components/icons';
import { AboutMeTaskbarIcon, WelcomeTaskbarIcon, NotepadTaskbarIcon, CalculatorTaskbarIcon, ContactTaskbarIcon } from './components/taskbarIcons';

export const APPS: AppData[] = [
  {
    id: 'about_me',
    title: 'About Me',
    icon: <UserIcon />,
    taskbarIcon: <AboutMeTaskbarIcon />,
    component: AboutMe,
    defaultSize: { width: 500, height: 450 },
  },
  {
    id: 'welcome',
    title: 'Welcome',
    icon: <FolderIcon />,
    taskbarIcon: <WelcomeTaskbarIcon />,
    component: Welcome,
    defaultSize: { width: 600, height: 400 },
  },
    {
    id: 'notepad',
    title: 'Notepad',
    icon: <NotepadIcon />,
    taskbarIcon: <NotepadTaskbarIcon />,
    component: Notepad,
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: <CalculatorIcon />,
    taskbarIcon: <CalculatorTaskbarIcon />,
    component: Calculator,
    defaultSize: { width: 350, height: 500 },
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: <MailIcon />,
    taskbarIcon: <ContactTaskbarIcon />,
    // Placeholder component
    component: ({ onClose }) => (
      <div className="p-4 bg-white h-full flex flex-col">
        <h1 className="font-bold text-xl">Contact Me</h1>
        <p className="flex-grow mt-2">This is a placeholder for a contact application.</p>
        <div className="mt-auto pt-4 flex justify-end">
            <button onClick={() => alert('Contacting... not really!')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Learn More</button>
        </div>
      </div>
    ),
    defaultSize: { width: 400, height: 300 },
  },
];

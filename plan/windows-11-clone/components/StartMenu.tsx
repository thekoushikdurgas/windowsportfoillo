import React from 'react';
import { APPS } from '../constants';
import type { AppData } from '../types';
import { FolderIcon, NotepadIcon } from './icons';

interface StartMenuProps {
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpenApp, onClose }) => {
  const handleAppClick = (appId: string) => {
    onOpenApp(appId);
    onClose();
  };
  
  const recommendedItems = [
    { name: 'Project Plan.docx', icon: <FolderIcon className="w-8 h-8 text-blue-500" /> },
    { name: 'Presentation.pptx', icon: <FolderIcon className="w-8 h-8 text-orange-500" /> },
    { name: 'Meeting Notes', icon: <NotepadIcon className="w-8 h-8 text-yellow-500" /> },
    { name: 'New Game Title', icon: <FolderIcon className="w-8 h-8 text-green-500" /> },
  ];

  return (
    <div 
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[550px] h-auto max-h-[650px] bg-slate-200/80 text-black dark:bg-gray-900/80 dark:text-white backdrop-blur-2xl rounded-lg p-6 flex flex-col max-md:w-full max-md:h-[calc(100vh-3.5rem)] max-md:bottom-12 max-md:left-0 max-md:translate-x-0 max-md:rounded-none animate-fade-in-up"
      onClick={(e) => e.stopPropagation()}
    >
      <input 
        type="text"
        placeholder="Type here to search"
        className="w-full bg-white/50 dark:bg-gray-700/50 border border-black/20 dark:border-gray-600 rounded-md p-2 mb-6 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Pinned</h2>
      </div>

      <div className="grid grid-cols-6 max-sm:grid-cols-4 gap-4">
        {APPS.map((app) => (
          <div
            key={app.id}
            onClick={() => handleAppClick(app.id)}
            className="flex flex-col items-center justify-center p-2 text-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors duration-200"
          >
            <div className="text-3xl text-blue-500 mb-1">
              {React.cloneElement(app.icon, { className: 'w-8 h-8' })}
            </div>
            <span className="text-xs truncate w-full">{app.title}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t border-black/10 dark:border-white/10 pt-4">
        <h2 className="text-lg font-semibold mb-4">Recommended</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {recommendedItems.map((item, index) => (
                <div key={index} className="flex items-center p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
                    {item.icon}
                    <div className="ml-3">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Recently opened</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StartMenu;

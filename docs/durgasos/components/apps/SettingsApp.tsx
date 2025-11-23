import React, { useState } from 'react';
import { WindowProps } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../constants';
import { 
  Monitor, 
  Palette, 
  Bluetooth, 
  Wifi, 
  User, 
  AppWindow, 
  Gamepad2, 
  Accessibility, 
  ShieldCheck, 
  Laptop,
  Check,
  Moon,
  Sun,
  LayoutTemplate,
  Droplet
} from 'lucide-react';

const SettingsApp: React.FC<WindowProps> = () => {
  const { 
    isDarkMode, toggleTheme, 
    wallpaperUrl, setWallpaperUrl, 
    accentColor, setAccentColor,
    transparencyEffect, toggleTransparency,
    centerTaskbar, toggleTaskbarAlignment
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState('personalization');

  // Styles
  const bgColor = isDarkMode ? 'bg-[#1f1f1f]' : 'bg-[#f3f3f3]';
  const sidebarColor = isDarkMode ? 'bg-[#1f1f1f]' : 'bg-[#eaeaea]';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const cardColor = isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#333]' : 'border-[#e5e5e5]';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const menuItems = [
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'bluetooth', label: 'Bluetooth & devices', icon: Bluetooth },
    { id: 'network', label: 'Network & internet', icon: Wifi },
    { id: 'personalization', label: 'Personalization', icon: Palette },
    { id: 'apps', label: 'Apps', icon: AppWindow },
    { id: 'accounts', label: 'Accounts', icon: User },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'privacy', label: 'Privacy & security', icon: ShieldCheck },
  ];

  const Toggle = ({ value, onToggle }: { value: boolean, onToggle: () => void }) => (
    <div 
      className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${value ? `bg-${accentColor.tailwind}` : 'bg-gray-400'}`}
      onClick={onToggle}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className={`flex h-full ${bgColor} ${textColor} font-sans`}>
      {/* Sidebar */}
      <div className={`w-60 flex-shrink-0 flex flex-col p-2 space-y-1 ${sidebarColor} overflow-y-auto`}>
        <div className="p-4 mb-2 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${accentColor.tailwind} to-purple-400`}></div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">User</span>
                <span className="text-xs opacity-60">Local Account</span>
            </div>
        </div>
        <div className="px-3 pb-2 text-xs opacity-50 font-semibold">Settings</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === item.id 
                ? `${isDarkMode ? 'bg-[#333]' : 'bg-white'} shadow-sm` 
                : 'hover:opacity-80'
            }`}
          >
            <item.icon size={16} className={activeTab === item.id ? `text-${accentColor.tailwind}` : ''} />
            <span>{item.label}</span>
            {activeTab === item.id && (
                <div className={`ml-auto w-1 h-3 rounded-full bg-${accentColor.tailwind}`}></div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">
          {menuItems.find(i => i.id === activeTab)?.label}
        </h1>

        {activeTab === 'personalization' && (
          <div className="space-y-6 max-w-3xl">
            {/* Real-time Preview */}
            <div className="w-full h-48 rounded-xl overflow-hidden relative shadow-lg transition-all duration-500"
              style={{ backgroundImage: `url(${wallpaperUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`${isDarkMode ? 'bg-[#202020]' : 'bg-[#f3f3f3]'} w-1/2 h-1/2 rounded-lg shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-black/10'} flex flex-col overflow-hidden opacity-90`}>
                        <div className={`${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white'} h-6 w-full flex items-center px-2 gap-1`}>
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-black'} opacity-50`}>Window Preview</span>
                        </div>
                    </div>
                </div>
                {/* Taskbar Preview */}
                <div className={`absolute bottom-0 w-full h-8 ${isDarkMode ? 'bg-[#202020]/90' : 'bg-[#f3f3f3]/90'} backdrop-blur-md flex items-center px-4 gap-2 transition-all duration-300 ${centerTaskbar ? 'justify-center' : 'justify-start'}`}>
                   <div className="w-4 h-4 bg-blue-500 rounded-[1px]"></div>
                   <div className={`w-4 h-4 rounded bg-${accentColor.tailwind}`}></div>
                   <div className={`w-4 h-4 rounded bg-gray-400`}></div>
                </div>
            </div>

            {/* Theme & Mode */}
            <div className={`${cardColor} rounded-xl p-4 flex items-center justify-between border ${borderColor}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h3 className="font-medium">Choose your mode</h3>
                  <p className={`text-sm ${mutedText}`}>Change how apps and Windows appear</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/10 p-1 rounded-lg">
                 <button 
                   onClick={() => !isDarkMode && toggleTheme()}
                   className={`px-3 py-1 text-sm rounded-md transition ${isDarkMode ? 'bg-[#333] shadow text-white' : 'opacity-50 text-black'}`}
                 >Dark</button>
                 <button 
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`px-3 py-1 text-sm rounded-md transition ${!isDarkMode ? 'bg-white shadow text-black' : 'opacity-50 text-white'}`}
                 >Light</button>
              </div>
            </div>

            {/* Background Selector */}
            <div className={`${cardColor} rounded-xl p-6 border ${borderColor}`}>
                <h3 className="font-medium mb-4">Background</h3>
                <div className="grid grid-cols-3 gap-4">
                    {WALLPAPERS.map(wp => (
                        <button 
                            key={wp.id}
                            onClick={() => setWallpaperUrl(wp.url)}
                            className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition hover:opacity-90 ${wallpaperUrl === wp.url ? `border-${accentColor.tailwind}` : 'border-transparent'}`}
                        >
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                            {wallpaperUrl === wp.url && (
                                <div className={`absolute bottom-2 right-2 bg-${accentColor.tailwind} text-white rounded-full p-1`}>
                                    <Check size={12} />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-[10px] text-white truncate px-2">{wp.name}</div>
                        </button>
                    ))}
                </div>
            </div>

             {/* Colors & Effects */}
            <div className={`${cardColor} rounded-xl p-6 border ${borderColor}`}>
                <h3 className="font-medium mb-4 flex items-center gap-2"><Palette size={18} /> Colors</h3>
                
                <div className="mb-6">
                    <div className="text-sm font-medium mb-3">Accent Color</div>
                    <div className="flex flex-wrap gap-3">
                        {ACCENT_COLORS.map(color => (
                            <button
                                key={color.id}
                                onClick={() => setAccentColor(color)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 border-2 ${accentColor.id === color.id ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            >
                                {accentColor.id === color.id && <Check size={16} className="text-white drop-shadow-md" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`flex items-center justify-between py-3 border-t ${borderColor}`}>
                    <div className="flex items-center gap-3">
                        <Droplet size={18} className={mutedText} />
                        <div>
                            <div className="text-sm font-medium">Transparency effects</div>
                            <div className={`text-xs ${mutedText}`}>Windows and surfaces appear translucent</div>
                        </div>
                    </div>
                    <Toggle value={transparencyEffect} onToggle={toggleTransparency} />
                </div>
            </div>

            {/* Taskbar Behaviors */}
             <div className={`${cardColor} rounded-xl p-6 border ${borderColor}`}>
                <h3 className="font-medium mb-4 flex items-center gap-2"><LayoutTemplate size={18} /> Taskbar behaviors</h3>
                
                <div className="flex items-center justify-between">
                     <div>
                        <div className="text-sm font-medium">Taskbar alignment</div>
                        <div className={`text-xs ${mutedText}`}>Choose how the taskbar is aligned</div>
                     </div>
                     <div className={`flex items-center rounded-lg border ${borderColor} overflow-hidden`}>
                        <button 
                           onClick={() => !centerTaskbar && toggleTaskbarAlignment()}
                           className={`px-3 py-1.5 text-xs transition ${!centerTaskbar ? `bg-${accentColor.tailwind} text-white` : `hover:${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}`}
                        >
                            Left
                        </button>
                        <div className={`w-[1px] ${borderColor}`}></div>
                        <button 
                           onClick={() => centerTaskbar && toggleTaskbarAlignment()}
                           className={`px-3 py-1.5 text-xs transition ${centerTaskbar ? `bg-${accentColor.tailwind} text-white` : `hover:${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}`}
                        >
                            Center
                        </button>
                     </div>
                </div>
            </div>

          </div>
        )}

        {activeTab === 'system' && (
             <div className="space-y-4 max-w-2xl">
                 <div className={`${cardColor} rounded-xl p-8 border ${borderColor} text-center space-y-4`}>
                     <Monitor size={48} className={`mx-auto text-${accentColor.tailwind}`} />
                     <h2 className="text-xl font-semibold">DurgasOS PC</h2>
                     <div className="grid grid-cols-2 gap-4 text-left mt-8">
                         <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
                             <div className="text-xs opacity-60">Processor</div>
                             <div className="font-mono text-sm">Google Gemini 3.0 Pro NPU</div>
                         </div>
                         <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
                             <div className="text-xs opacity-60">Installed RAM</div>
                             <div className="font-mono text-sm">128.0 TB (Virtual)</div>
                         </div>
                         <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
                             <div className="text-xs opacity-60">System Type</div>
                             <div className="font-mono text-sm">Web-based Operating System</div>
                         </div>
                         <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
                             <div className="text-xs opacity-60">Edition</div>
                             <div className="font-mono text-sm">DurgasOS 11 Pro</div>
                         </div>
                     </div>
                 </div>
             </div>
        )}

        {activeTab !== 'personalization' && activeTab !== 'system' && (
             <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                 <div className="p-4 rounded-full bg-black/5 mb-4">
                     {React.createElement(menuItems.find(i => i.id === activeTab)?.icon || Monitor, { size: 32 })}
                 </div>
                 <p>This setting is not available in the simulator.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;

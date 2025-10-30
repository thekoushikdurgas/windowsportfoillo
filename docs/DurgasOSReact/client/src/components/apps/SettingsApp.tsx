import { useState } from "react";
import {
  Monitor,
  Wifi,
  Bell,
  Lock,
  Palette,
  Globe,
  Accessibility,
  Info
} from "lucide-react";

export function SettingsApp() {
  const [selectedSection, setSelectedSection] = useState("display");

  const sections = [
    { id: "display", label: "Display", icon: Monitor },
    { id: "network", label: "Network & Internet", icon: Wifi },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "personalization", label: "Personalization", icon: Palette },
    { id: "language", label: "Language & Region", icon: Globe },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="h-full flex bg-[#1a1a1a]">
      {/* Sidebar */}
      <div 
        className="w-56 flex flex-col border-r overflow-y-auto"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="p-3">
          <h2 className="text-base font-semibold text-white mb-3 px-3">Settings</h2>
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover-elevate active-elevate-2 transition-all text-left ${
                    selectedSection === section.id ? 'bg-white/10' : ''
                  }`}
                  data-testid={`nav-${section.id}`}
                >
                  <Icon className="w-4 h-4 text-white/70" />
                  <span className="text-xs text-white/90">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {selectedSection === "display" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Display</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "linear-gradient(to right, #0078D4 0%, #0078D4 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 100%)",
                    }}
                    data-testid="slider-brightness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Resolution
                  </label>
                  <select
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-[#0078D4]/50"
                    data-testid="select-resolution"
                  >
                    <option>1920 x 1080 (Recommended)</option>
                    <option>1680 x 1050</option>
                    <option>1440 x 900</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Scale
                  </label>
                  <select
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-[#0078D4]/50"
                    data-testid="select-scale"
                  >
                    <option>100% (Recommended)</option>
                    <option>125%</option>
                    <option>150%</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedSection === "personalization" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Personalization</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    {["#0078D4", "#0067C0", "#16C60C", "#E74856", "#FFB900", "#8764B8"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-white/20 hover-elevate active-elevate-2 transition-all"
                        style={{ backgroundColor: color }}
                        data-testid={`color-${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Dark", "Light", "Auto"].map((theme) => (
                      <button
                        key={theme}
                        className="p-4 rounded-lg border border-white/10 hover-elevate active-elevate-2 transition-all"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        data-testid={`theme-${theme.toLowerCase()}`}
                      >
                        <div className="text-xs text-white/90 font-medium">{theme}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === "about" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">About DurgasOS</h2>
              
              <div className="space-y-6">
                <div 
                  className="p-6 rounded-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 grid grid-cols-2 gap-1">
                      <div className="bg-[#0078D4] rounded-sm"></div>
                      <div className="bg-[#0078D4] rounded-sm"></div>
                      <div className="bg-[#0078D4] rounded-sm"></div>
                      <div className="bg-[#0078D4] rounded-sm"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">DurgasOS</h3>
                      <p className="text-sm text-white/60">Version 11.0.0</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-white/70">
                    <p>A Windows 11 desktop simulator built with React</p>
                    <p className="text-xs text-white/50">
                      © 2024 DurgasOS. All rights reserved.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/90 mb-3">System Information</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Processor", value: "Web Browser Engine" },
                      { label: "Installed RAM", value: "Simulated" },
                      { label: "System Type", value: "64-bit operating system" },
                    ].map((item) => (
                      <div 
                        key={item.label}
                        className="flex justify-between py-2 px-3 rounded-lg"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      >
                        <span className="text-xs text-white/60">{item.label}</span>
                        <span className="text-xs text-white/90">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!["display", "personalization", "about"].includes(selectedSection) && (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-sm text-white/60">
                {sections.find(s => s.id === selectedSection)?.label} settings coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

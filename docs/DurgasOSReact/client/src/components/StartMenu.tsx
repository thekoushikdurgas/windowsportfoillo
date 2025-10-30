import { useState } from "react";
import { 
  Search, 
  User, 
  Settings, 
  Power,
  FileText,
  Briefcase,
  Globe,
  ShoppingBag,
  Folder,
  Image,
  Calculator
} from "lucide-react";

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (appId: string, title: string, icon: string) => void;
}

export function StartMenu({ onClose, onOpenApp }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const pinnedApps = [
    { id: "about-me", title: "About Me", icon: User, iconName: "user", description: "Profile & Information" },
    { id: "portfolio", title: "Portfolio", icon: Briefcase, iconName: "briefcase", description: "My Projects" },
    { id: "browser", title: "Browser", icon: Globe, iconName: "globe", description: "Web Browser" },
    { id: "app-store", title: "App Store", icon: ShoppingBag, iconName: "shopping-bag", description: "Get Apps" },
    { id: "file-explorer", title: "File Explorer", icon: Folder, iconName: "folder", description: "Browse Files" },
    { id: "settings", title: "Settings", icon: Settings, iconName: "settings", description: "System Settings" },
    { id: "photos", title: "Photos", icon: Image, iconName: "image", description: "View Photos" },
    { id: "calculator", title: "Calculator", icon: Calculator, iconName: "calculator", description: "Quick Math" },
    { id: "notes", title: "Notes", icon: FileText, iconName: "file-text", description: "Take Notes" },
  ];

  const filteredApps = pinnedApps.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[600px] h-[660px] rounded-xl flex flex-col overflow-hidden z-[10000]"
      style={{
        backgroundColor: "rgba(32, 32, 32, 0.95)",
        backdropFilter: "blur(40px) saturate(150%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.5)",
      }}
      onClick={(e) => e.stopPropagation()}
      data-testid="start-menu"
    >
      {/* Search Bar */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search for apps, settings, and files"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white/10 border border-white/10 rounded-lg text-white text-[11px] placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#0078D4]/50"
            data-testid="input-start-search"
          />
        </div>
      </div>

      {/* Pinned Apps */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="mb-3">
          <h3 className="text-[11px] font-semibold text-white/80 mb-3">Pinned</h3>
          <div className="grid grid-cols-6 gap-3">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onOpenApp(app.id, app.title, app.iconName);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 transition-all group"
                data-testid={`button-app-${app.id}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <app.icon className="w-6 h-6 text-white/90 group-hover:text-[#0078D4] transition-colors" />
                </div>
                <span className="text-[11px] font-medium text-white/90 text-center leading-tight line-clamp-2">
                  {app.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="mt-6 mb-4">
          <h3 className="text-[11px] font-semibold text-white/80 mb-3">Recommended</h3>
          <div className="space-y-1">
            {[
              { name: "Recent Document.pdf", time: "2 hours ago", icon: FileText },
              { name: "Project Files", time: "Yesterday", icon: Folder },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover-elevate active-elevate-2 transition-all"
                data-testid={`button-recent-${index}`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white/70" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[11px] font-medium text-white/90">{item.name}</div>
                  <div className="text-[10px] text-white/50">{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="flex items-center justify-between p-4 border-t"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <button 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover-elevate active-elevate-2 transition-all"
          data-testid="button-user-profile"
        >
          <div className="w-6 h-6 rounded-full bg-[#0078D4] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-medium text-white/90">User</span>
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all"
          data-testid="button-power"
        >
          <Power className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </div>
  );
}

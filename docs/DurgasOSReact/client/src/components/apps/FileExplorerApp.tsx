import { useState } from "react";
import { 
  Home, 
  FolderOpen, 
  Image, 
  FileText, 
  Music, 
  Video,
  ChevronRight,
  Grid3x3,
  List
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon: string;
  size?: string;
  modified?: string;
}

export function FileExplorerApp() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPath, setCurrentPath] = useState(["This PC", "Documents"]);

  const folders = [
    { id: "1", name: "Desktop", type: "folder" as const, icon: "desktop" },
    { id: "2", name: "Documents", type: "folder" as const, icon: "file-text" },
    { id: "3", name: "Downloads", type: "folder" as const, icon: "download" },
    { id: "4", name: "Pictures", type: "folder" as const, icon: "image" },
    { id: "5", name: "Music", type: "folder" as const, icon: "music" },
    { id: "6", name: "Videos", type: "folder" as const, icon: "video" },
  ];

  const files: FileItem[] = [
    { id: "f1", name: "Project Report.pdf", type: "file", icon: "file-text", size: "2.4 MB", modified: "Today" },
    { id: "f2", name: "Presentation.pptx", type: "file", icon: "file-text", size: "5.1 MB", modified: "Yesterday" },
    { id: "f3", name: "Budget.xlsx", type: "file", icon: "file-text", size: "1.2 MB", modified: "2 days ago" },
  ];

  const allItems = [...folders, ...files];

  return (
    <div className="h-full flex bg-[#1a1a1a]">
      {/* Sidebar */}
      <div 
        className="w-52 flex flex-col border-r overflow-y-auto"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="p-3">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover-elevate active-elevate-2 transition-all text-left"
            data-testid="nav-home"
          >
            <Home className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/90">Home</span>
          </button>
        </div>

        <div className="px-3 pb-3">
          <div className="text-[10px] text-white/40 font-medium mb-2 px-3">Quick Access</div>
          <div className="space-y-1">
            {[
              { icon: FolderOpen, label: "Documents", active: true },
              { icon: Image, label: "Pictures", active: false },
              { icon: Music, label: "Music", active: false },
              { icon: Video, label: "Videos", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover-elevate active-elevate-2 transition-all text-left ${
                  item.active ? 'bg-white/5' : ''
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/90">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-3 h-3 text-white/40" />}
                <button
                  className="px-2 py-1 rounded hover-elevate active-elevate-2 transition-all text-white/70"
                  data-testid={`breadcrumb-${index}`}
                >
                  {path}
                </button>
              </div>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all ${
                viewMode === "grid" ? 'bg-white/10' : ''
              }`}
              data-testid="button-view-grid"
            >
              <Grid3x3 className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all ${
                viewMode === "list" ? 'bg-white/10' : ''
              }`}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-3">
              {allItems.map((item) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 transition-all"
                  data-testid={`item-${item.id}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {item.type === "folder" ? (
                      <FolderOpen className="w-10 h-10 text-white/70" />
                    ) : (
                      <FileText className="w-10 h-10 text-white/70" />
                    )}
                  </div>
                  <span className="text-xs text-white/90 text-center line-clamp-2">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {allItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover-elevate active-elevate-2 transition-all text-left"
                  data-testid={`item-list-${item.id}`}
                >
                  <div>
                    {item.type === "folder" ? (
                      <FolderOpen className="w-5 h-5 text-white/70" />
                    ) : (
                      <FileText className="w-5 h-5 text-white/70" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/90 truncate">{item.name}</div>
                  </div>
                  {item.size && (
                    <div className="text-xs text-white/40">{item.size}</div>
                  )}
                  {item.modified && (
                    <div className="text-xs text-white/40 w-20">{item.modified}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

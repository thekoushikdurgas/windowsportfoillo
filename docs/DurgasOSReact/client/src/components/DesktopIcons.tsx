import { Monitor, Trash2, Folder } from "lucide-react";
import type { DesktopIcon } from "@shared/schema";

interface DesktopIconsProps {
  icons: DesktopIcon[];
  onOpen: (appId: string, title: string, icon: string) => void;
}

export function DesktopIcons({ icons, onOpen }: DesktopIconsProps) {
  const handleDoubleClick = (icon: DesktopIcon) => {
    onOpen(icon.appId, icon.name, icon.icon);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "monitor":
        return <Monitor className="w-12 h-12 text-white/90" />;
      case "trash-2":
        return <Trash2 className="w-12 h-12 text-white/90" />;
      default:
        return <Folder className="w-12 h-12 text-white/90" />;
    }
  };

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-8" data-testid="desktop-icons">
      {icons.map((icon) => (
        <button
          key={icon.id}
          onDoubleClick={() => handleDoubleClick(icon)}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover-elevate active-elevate-2 w-20 group"
          data-testid={`icon-${icon.id}`}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            {getIconComponent(icon.icon)}
          </div>
          <span className="text-[11px] text-white text-center leading-tight line-clamp-2 font-medium drop-shadow-lg">
            {icon.name}
          </span>
        </button>
      ))}
    </div>
  );
}

import { RefreshCw, Image, Settings, ArrowDownToLine } from "lucide-react";

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ position, onClose }: ContextMenuProps) {
  const menuItems = [
    { icon: RefreshCw, label: "Refresh", action: () => {} },
    { divider: true },
    { icon: Image, label: "Personalize", action: () => {} },
    { icon: ArrowDownToLine, label: "Display settings", action: () => {} },
    { divider: true },
    { icon: Settings, label: "Settings", action: () => {} },
  ];

  return (
    <>
      {/* Backdrop to close menu */}
      <div
        className="fixed inset-0 z-[10001]"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed min-w-[240px] py-1 rounded-lg z-[10002]"
        style={{
          left: position.x,
          top: position.y,
          backgroundColor: "rgba(42, 42, 42, 0.98)",
          backdropFilter: "blur(40px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.6)",
        }}
        data-testid="context-menu"
      >
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <div
                key={index}
                className="h-[1px] my-1 mx-1"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            );
          }

          const Icon = item.icon!;
          return (
            <button
              key={index}
              onClick={() => {
                item.action?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 h-8 px-3 text-left hover-elevate active-elevate-2 transition-all"
              data-testid={`context-menu-${item.label?.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Icon className="w-4 h-4 text-white/70" />
              <span className="text-[11px] text-white/90">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

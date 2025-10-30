import { useRef, useEffect, useState } from "react";
import { Minus, Square, X } from "lucide-react";
import type { WindowState } from "@shared/schema";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

export function Window({
  window,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        onUpdatePosition({
          x: window.position.x + deltaX,
          y: window.position.y + deltaY,
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }

      if (isResizing && !window.isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        onUpdateSize({
          width: Math.max(400, resizeStart.width + deltaX),
          height: Math.max(300, resizeStart.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, window, onUpdatePosition, onUpdateSize]);

  if (window.isMinimized) return null;

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      onFocus();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    });
  };

  const style: React.CSSProperties = window.isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 48,
        width: "100%",
        height: "calc(100vh - 48px)",
        zIndex: window.zIndex,
      }
    : {
        position: "fixed",
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onClick={onFocus}
      className={`flex flex-col overflow-hidden ${
        window.isMaximized ? "" : "rounded-lg"
      }`}
      data-testid={`window-${window.appId}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        className="h-8 flex items-center justify-between px-3 cursor-move select-none"
        style={{
          backgroundColor: "rgba(32, 32, 32, 0.9)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        data-testid="window-titlebar"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/90 font-medium truncate">
            {window.title}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={onMinimize}
            className="w-12 h-8 flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
            data-testid="button-minimize"
          >
            <Minus className="w-3 h-3 text-white/90" />
          </button>
          <button
            onClick={onMaximize}
            className="w-12 h-8 flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
            data-testid="button-maximize"
          >
            <Square className="w-3 h-3 text-white/90" />
          </button>
          <button
            onClick={onClose}
            className="w-12 h-8 flex items-center justify-center hover:bg-red-600 active-elevate-2 transition-colors"
            data-testid="button-close"
          >
            <X className="w-3 h-3 text-white/90" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundColor: "#202020",
          border: window.isMaximized ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          style={{ zIndex: 1 }}
        />
      )}
    </div>
  );
}

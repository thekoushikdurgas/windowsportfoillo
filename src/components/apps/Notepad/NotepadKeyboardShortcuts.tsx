'use client';

import { useEffect } from 'react';
import { NotepadActions } from '@/types/notepad';

interface NotepadKeyboardShortcutsProps {
  actions: NotepadActions;
}

export function NotepadKeyboardShortcuts({ actions }: NotepadKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle global shortcuts that don't require focus on textarea
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'f':
            event.preventDefault();
            actions.showFindDialog();
            break;
          case 'h':
            event.preventDefault();
            actions.showReplaceDialog();
            break;
          case 'g':
            event.preventDefault();
            const line = prompt('Go to line:');
            if (line) {
              actions.goToLine(parseInt(line, 10));
            }
            break;
          case '=':
          case '+':
            event.preventDefault();
            actions.setZoom(100); // Reset zoom
            break;
          case '-':
            event.preventDefault();
            actions.setZoom(100); // Reset zoom
            break;
          case '0':
            event.preventDefault();
            actions.resetZoom();
            break;
        }
      }

      // Handle F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        actions.toggleFullscreen();
      }

      // Handle Escape to close dialogs
      if (event.key === 'Escape') {
        actions.hideFindDialog();
        actions.hideReplaceDialog();
        actions.hideSettingsDialog();
        actions.hideAboutDialog();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions]);

  // This component doesn't render anything visible
  return null;
}

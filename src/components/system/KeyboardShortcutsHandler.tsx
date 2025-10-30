'use client';

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export function KeyboardShortcutsHandler() {
  useKeyboardShortcuts();
  return null; // This component doesn't render anything
}

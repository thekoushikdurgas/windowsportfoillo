'use client';

import { useEffect, useRef, useCallback } from 'react';
import { accessibility, announce, focusElement, trapFocus, createKeyboardNavigation } from '@/utils/accessibility';

interface UseAccessibilityOptions {
  announceOnMount?: string;
  announceOnUnmount?: string;
  trapFocus?: boolean;
  keyboardNavigation?: boolean;
  focusOnMount?: boolean;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const {
    announceOnMount,
    announceOnUnmount,
    trapFocus: shouldTrapFocus,
    keyboardNavigation: shouldEnableKeyboardNav,
    focusOnMount,
  } = options;

  // Utility functions
  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Announce on mount
  useEffect(() => {
    if (announceOnMount) {
      announce(announceOnMount);
    }
  }, [announceOnMount]);

  // Focus on mount
  useEffect(() => {
    if (focusOnMount && containerRef.current) {
      focusElement(containerRef.current);
    }
  }, [focusOnMount]);

  // Trap focus
  useEffect(() => {
    if (shouldTrapFocus && containerRef.current) {
      cleanupRef.current = trapFocus(containerRef.current);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [shouldTrapFocus]);

  // Keyboard navigation
  useEffect(() => {
    if (shouldEnableKeyboardNav && containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      cleanupRef.current = createKeyboardNavigation(focusableElements);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [shouldEnableKeyboardNav, getFocusableElements]);

  // Announce on unmount
  useEffect(() => {
    return () => {
      if (announceOnUnmount) {
        announce(announceOnUnmount);
      }
    };
  }, [announceOnUnmount]);

  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusElement(focusableElements[0]);
      }
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusElement(focusableElements[focusableElements.length - 1]);
      }
    }
  }, [getFocusableElements]);

  const announceChange = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announce(message, priority);
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    announceChange,
    getFocusableElements,
    accessibility,
  };
}

// Hook for keyboard navigation in lists
export function useKeyboardNavigation<T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  options: {
    enabled?: boolean;
    announceSelection?: boolean;
    getItemDescription?: (item: T, index: number) => string;
  } = {}
) {
  const { enabled = true, announceSelection = true, getItemDescription } = options;
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
        if (announceSelection && getItemDescription) {
          announce(`Selected ${getItemDescription(items[nextIndex], nextIndex)}`);
        }
        break;
      
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
        setSelectedIndex(prevIndex);
        if (announceSelection && getItemDescription) {
          announce(`Selected ${getItemDescription(items[prevIndex], prevIndex)}`);
        }
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex], selectedIndex);
          if (announceSelection) {
            announce(`Activated ${getItemDescription?.(items[selectedIndex], selectedIndex) || 'item'}`);
          }
        }
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        if (announceSelection && getItemDescription) {
          announce(`Selected ${getItemDescription(items[0], 0)}`);
        }
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(items.length - 1);
        if (announceSelection && getItemDescription) {
          announce(`Selected ${getItemDescription(items[items.length - 1], items.length - 1)}`);
        }
        break;
    }
  }, [enabled, selectedIndex, items, onSelect, announceSelection, getItemDescription]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return {
    selectedIndex,
    setSelectedIndex,
  };
}

// Hook for accessible modals and dialogs
export function useAccessibleModal(options: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  initialFocus?: 'first' | 'close' | 'content';
} = { isOpen: false, onClose: () => {}, title: '' }) {
  const { isOpen, onClose, title, description, initialFocus = 'first' } = options;
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Announce modal opening
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      announce(`Dialog opened: ${title}`);
      
      // Focus initial element
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          const closeButton = modalRef.current.querySelector('[data-modal-close]') as HTMLElement;
          
          switch (initialFocus) {
            case 'close':
              if (closeButton) focusElement(closeButton);
              break;
            case 'content':
              const content = modalRef.current.querySelector('[data-modal-content]') as HTMLElement;
              if (content) focusElement(content);
              break;
            case 'first':
            default:
              if (focusableElements.length > 0) {
                focusElement(focusableElements[0]);
              }
              break;
          }
        }
      }, 100);
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        focusElement(previousActiveElement.current);
      }
    }
  }, [isOpen, title, initialFocus, getFocusableElements]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        announce('Dialog closed');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus in modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      return cleanup;
    }
  }, [isOpen]);

  

  return {
    modalRef,
    modalProps: {
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': title,
      'aria-describedby': description,
    },
  };
}

// Import React for useState
import React from 'react';

/**
 * Accessibility utilities for Windows 11 replica
 */

export interface AccessibilityOptions {
  announceChanges?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  screenReader?: boolean;
  keyboardNavigation?: boolean;
}

export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private options: AccessibilityOptions;
  private announcementQueue: string[] = [];
  private isAnnouncing = false;

  private constructor() {
    this.options = {
      announceChanges: true,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
    };

    this.detectCapabilities();
    this.setupEventListeners();
  }

  public static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  private detectCapabilities(): void {
    if (typeof window === 'undefined') return;

    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.options.reducedMotion = true;
    }

    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.options.highContrast = true;
    }

    // Detect screen reader (basic detection)
    this.options.screenReader = this.detectScreenReader();

    // Apply initial accessibility settings
    this.applyAccessibilitySettings();
  }

  private detectScreenReader(): boolean {
    // Basic screen reader detection
    if (typeof window === 'undefined') return false;
    
    return (
      'speechSynthesis' in window ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver')
    );
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for system preference changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    reducedMotionQuery.addEventListener('change', (e) => {
      this.options.reducedMotion = e.matches;
      this.applyAccessibilitySettings();
    });

    highContrastQuery.addEventListener('change', (e) => {
      this.options.highContrast = e.matches;
      this.applyAccessibilitySettings();
    });

    // Keyboard navigation support
    document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
  }

  private applyAccessibilitySettings(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply reduced motion
    if (this.options.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply high contrast
    if (this.options.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply keyboard navigation
    if (this.options.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }

  private handleGlobalKeyDown(e: KeyboardEvent): void {
    // Handle global accessibility shortcuts
    if (e.altKey && e.shiftKey) {
      switch (e.key) {
        case 'H':
          // Toggle high contrast
          e.preventDefault();
          this.toggleHighContrast();
          break;
        case 'M':
          // Toggle reduced motion
          e.preventDefault();
          this.toggleReducedMotion();
          break;
        case 'S':
          // Toggle screen reader announcements
          e.preventDefault();
          this.toggleAnnouncements();
          break;
      }
    }

    // Tab navigation enhancement
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigating');
    }
  }

  // Public API methods
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.options.announceChanges) return;

    if (this.options.screenReader) {
      // Use aria-live regions for screen readers
      this.createLiveRegion(message, priority);
    } else {
      // Fallback to console or other methods
      // Accessibility announcement: message
    }
  }

  private createLiveRegion(message: string, priority: 'polite' | 'assertive'): void {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }

  public toggleHighContrast(): void {
    this.options.highContrast = !this.options.highContrast;
    this.applyAccessibilitySettings();
    this.announce(`High contrast ${this.options.highContrast ? 'enabled' : 'disabled'}`);
  }

  public toggleReducedMotion(): void {
    this.options.reducedMotion = !this.options.reducedMotion;
    this.applyAccessibilitySettings();
    this.announce(`Reduced motion ${this.options.reducedMotion ? 'enabled' : 'disabled'}`);
  }

  public toggleAnnouncements(): void {
    this.options.announceChanges = !this.options.announceChanges;
    this.announce(`Screen reader announcements ${this.options.announceChanges ? 'enabled' : 'disabled'}`);
  }

  public getOptions(): AccessibilityOptions {
    return { ...this.options };
  }

  public updateOptions(updates: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...updates };
    this.applyAccessibilitySettings();
  }

  // Focus management
  public focusElement(element: HTMLElement | null): void {
    if (element && typeof element.focus === 'function') {
      element.focus();
      this.announce(`Focused on ${this.getElementDescription(element)}`);
    }
  }

  public trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    let currentIndex = 0;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      e.preventDefault();
      
      if (e.shiftKey) {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
      } else {
        currentIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
      }

      focusableElements[currentIndex]?.focus();
    };

    container.addEventListener('keydown', handleTabKey);
    focusableElements[0]?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
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
  }

  private getElementDescription(element: HTMLElement): string {
    // Try to get accessible name
    const label = element.getAttribute('aria-label') ||
                  element.getAttribute('aria-labelledby') ||
                  element.getAttribute('title') ||
                  element.textContent?.trim() ||
                  element.tagName.toLowerCase();

    return label || 'element';
  }

  // Keyboard navigation helpers
  public createKeyboardNavigation(items: HTMLElement[]): () => void {
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          currentIndex = (currentIndex + 1) % items.length;
          items[currentIndex]?.focus();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[currentIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          items[currentIndex]?.focus();
          break;
        case 'End':
          e.preventDefault();
          currentIndex = items.length - 1;
          items[currentIndex]?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Screen reader helpers
  public hideFromScreenReader(element: HTMLElement): void {
    element.setAttribute('aria-hidden', 'true');
  }

  public showToScreenReader(element: HTMLElement): void {
    element.removeAttribute('aria-hidden');
  }

  public describeElement(element: HTMLElement, description: string): void {
    element.setAttribute('aria-describedby', description);
  }

  // High contrast support
  public addHighContrastStyles(): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.id = 'accessibility-high-contrast';
    style.textContent = `
      .high-contrast {
        --windows-surface: #ffffff;
        --windows-text: #000000;
        --windows-border: #000000;
        --windows-accent: #0000ff;
        --windows-accent-text: #ffffff;
      }
      
      .high-contrast .windows-window {
        border: 2px solid var(--windows-border);
      }
      
      .high-contrast button {
        border: 1px solid var(--windows-border);
      }
      
      .high-contrast button:focus {
        outline: 2px solid var(--windows-accent);
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Reduced motion support
  public addReducedMotionStyles(): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.id = 'accessibility-reduced-motion';
    style.textContent = `
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .reduced-motion .motion-reduce {
        animation: none !important;
        transition: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Initialize accessibility features
  public initialize(): void {
    this.addHighContrastStyles();
    this.addReducedMotionStyles();
    this.applyAccessibilitySettings();
  }
}

// Export singleton instance
export const accessibility = AccessibilityManager.getInstance();

// Utility functions for easy use
export const announce = (message: string, priority?: 'polite' | 'assertive') => {
  accessibility.announce(message, priority);
};

export const focusElement = (element: HTMLElement | null) => {
  accessibility.focusElement(element);
};

export const trapFocus = (container: HTMLElement) => {
  return accessibility.trapFocus(container);
};

export const createKeyboardNavigation = (items: HTMLElement[]) => {
  return accessibility.createKeyboardNavigation(items);
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  accessibility.initialize();
}

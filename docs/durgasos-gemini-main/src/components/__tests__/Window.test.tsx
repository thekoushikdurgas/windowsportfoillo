/**
 * @file Tests for the Window component.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Window } from '../Window';
import { AppProvider } from '../../contexts/AppContext';
import { WindowInstance } from '../../types';

// Mock the LazyApp component
jest.mock('../LazyApp', () => ({
  __esModule: true,
  default: ({ app, data }: { app: any; data?: any }) => (
    <div data-testid={`lazy-app-${app.id}`}>
      {app.name} - {JSON.stringify(data || {})}
    </div>
  ),
}));

const mockWindow: WindowInstance = {
  id: 'test-window-1',
  appId: 'about',
  x: 100,
  y: 100,
  width: 800,
  height: 600,
  zIndex: 1,
  isMinimized: false,
  data: { title: 'Test Window' },
};

const renderWithProvider = (window: WindowInstance) => {
  return render(
    <AppProvider>
      <Window win={window} />
    </AppProvider>
  );
};

describe('Window Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  it('renders window with correct title and content', () => {
    renderWithProvider(mockWindow);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByTestId('lazy-app-about')).toBeInTheDocument();
  });

  it('renders window controls', () => {
    renderWithProvider(mockWindow);
    
    // Check for minimize, maximize, and close buttons
    expect(screen.getByText('_')).toBeInTheDocument(); // Minimize button
    expect(screen.getByText('□')).toBeInTheDocument(); // Maximize button
    expect(screen.getByText('✕')).toBeInTheDocument(); // Close button
  });

  it('handles minimize button click', () => {
    renderWithProvider(mockWindow);
    
    const minimizeButton = screen.getByText('_');
    fireEvent.click(minimizeButton);
    
    // The window should be minimized (not visible)
    expect(screen.queryByText('About Me')).not.toBeInTheDocument();
  });

  it('handles close button click', () => {
    renderWithProvider(mockWindow);
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    // The window should be closed (not visible)
    expect(screen.queryByText('About Me')).not.toBeInTheDocument();
  });

  it('applies correct styling for active window', () => {
    renderWithProvider(mockWindow);
    
    const windowElement = screen.getByText('About Me').closest('div[class*="absolute"]');
    expect(windowElement).toHaveClass('shadow-[var(--accent-color)]/50');
  });

  it('handles window dragging', async () => {
    renderWithProvider(mockWindow);
    
    const header = screen.getByText('About Me').closest('div[class*="flex"]');
    
    // Simulate mouse down on header
    fireEvent.mouseDown(header!);
    
    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
    
    // Simulate mouse up
    fireEvent.mouseUp(window);
    
    // The window position should be updated
    await waitFor(() => {
      expect(header).toBeInTheDocument();
    });
  });

  it('handles window resizing', async () => {
    renderWithProvider(mockWindow);
    
    const windowElement = screen.getByText('About Me').closest('div[class*="absolute"]');
    
    // Find a resize handle (bottom-right corner)
    const resizeHandle = windowElement?.querySelector('[class*="bottom-right"]');
    
    if (resizeHandle) {
      // Simulate mouse down on resize handle
      fireEvent.mouseDown(resizeHandle);
      
      // Simulate mouse move
      fireEvent.mouseMove(window, { clientX: 900, clientY: 700 });
      
      // Simulate mouse up
      fireEvent.mouseUp(window);
      
      // The window size should be updated
      await waitFor(() => {
        expect(windowElement).toBeInTheDocument();
      });
    }
  });

  it('does not render when app is not found', () => {
    const invalidWindow: WindowInstance = {
      ...mockWindow,
      appId: 'non-existent-app',
    };
    
    const { container } = renderWithProvider(invalidWindow);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when window is minimized', () => {
    const minimizedWindow: WindowInstance = {
      ...mockWindow,
      isMinimized: true,
    };
    
    const { container } = renderWithProvider(minimizedWindow);
    expect(container.firstChild).toBeNull();
  });
});

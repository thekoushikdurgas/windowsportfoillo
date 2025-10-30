import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import Welcome from '../../Welcome';

// Mock the DesktopContext
const mockOpenApp = jest.fn();
jest.mock('@/context/DesktopContext', () => ({
  useDesktop: () => ({
    openApp: mockOpenApp,
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Welcome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="light">
        {component}
      </ThemeProvider>
    );
  };

  it('renders welcome message', () => {
    renderWithTheme(<Welcome />);
    
    expect(screen.getByText('Welcome to DurgasOS')).toBeInTheDocument();
    expect(screen.getByText(/A modern Windows 11 desktop simulator/)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithTheme(<Welcome />);
    
    expect(screen.getByText('View Portfolio')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('calls openApp when portfolio button is clicked', () => {
    renderWithTheme(<Welcome />);
    
    const portfolioButton = screen.getByText('View Portfolio');
    fireEvent.click(portfolioButton);
    
    expect(mockOpenApp).toHaveBeenCalledWith('portfolio');
  });

  it('calls openApp when about button is clicked', () => {
    renderWithTheme(<Welcome />);
    
    const aboutButton = screen.getByText('About Me');
    fireEvent.click(aboutButton);
    
    expect(mockOpenApp).toHaveBeenCalledWith('about');
  });

  it('shows first time user message when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithTheme(<Welcome />);
    
    expect(screen.getByText(/First time here\? Welcome!/)).toBeInTheDocument();
  });

  it('shows tour button for returning users', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    renderWithTheme(<Welcome />);
    
    expect(screen.getByText('Take a Tour')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithTheme(<Welcome />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('aria-label', 'Welcome to DurgasOS');
    
    const title = screen.getByText('Welcome to DurgasOS');
    expect(title).toHaveAttribute('id', 'welcome-title');
  });

  it('renders quick tips section', () => {
    renderWithTheme(<Welcome />);
    
    expect(screen.getByText('💡 Quick Tips:')).toBeInTheDocument();
    expect(screen.getByText(/Click on desktop icons to open applications/)).toBeInTheDocument();
  });
});

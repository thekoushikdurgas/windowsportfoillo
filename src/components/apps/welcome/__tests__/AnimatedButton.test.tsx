import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedButton } from '../AnimatedButton';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe('AnimatedButton', () => {
  it('renders button with children', () => {
    render(<AnimatedButton>Test Button</AnimatedButton>);
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<AnimatedButton onClick={handleClick}>Test Button</AnimatedButton>);
    
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <AnimatedButton onClick={handleClick} disabled>
        Test Button
      </AnimatedButton>
    );
    
    fireEvent.click(screen.getByText('Test Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<AnimatedButton loading>Test Button</AnimatedButton>);
    
    // The button should still be in the DOM but with loading state
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<AnimatedButton className="custom-class">Test Button</AnimatedButton>);
    
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<AnimatedButton aria-label="Test button">Test Button</AnimatedButton>);
    
    const button = screen.getByText('Test Button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });
});

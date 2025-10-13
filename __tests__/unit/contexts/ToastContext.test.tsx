import { render, screen, waitFor, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ReactNode } from 'react';

// Test component to access toast context
function TestComponent() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success message')}>Show Success</button>
      <button onClick={() => toast.error('Error message')}>Show Error</button>
      <button onClick={() => toast.warning('Warning message')}>Show Warning</button>
      <button onClick={() => toast.info('Info message')}>Show Info</button>
    </div>
  );
}

describe('ToastContext', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('should show success toast', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = getByText('Show Success');
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('should show error toast', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = getByText('Show Error');
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('should show warning toast', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = getByText('Show Warning');
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  it('should show info toast', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = getByText('Show Info');
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('should allow manual dismissal of toast', async () => {
    const { getByText, getByLabelText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show toast
    act(() => {
      getByText('Show Success').click();
    });

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Close toast
    const closeButton = getByLabelText('Close');
    act(() => {
      closeButton.click();
    });

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should auto-dismiss toast after duration', async () => {
    jest.useFakeTimers();

    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      getByText('Show Success').click();
    });

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should stack multiple toasts', async () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show multiple toasts
    act(() => {
      getByText('Show Success').click();
      getByText('Show Error').click();
      getByText('Show Warning').click();
    });

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });
});


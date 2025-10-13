import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportModal from '@/components/ReportModal';
import { ToastProvider } from '@/contexts/ToastContext';

global.fetch = jest.fn();

const mockOnClose = jest.fn();
const mockOnReported = jest.fn();

const renderModal = () => {
  return render(
    <ToastProvider>
      <ReportModal
        itemId="test-item-id"
        itemTitle="Test Item Title"
        onClose={mockOnClose}
        onReported={mockOnReported}
      />
    </ToastProvider>
  );
};

describe('ReportModal Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockOnClose.mockClear();
    mockOnReported.mockClear();
  });

  it('should render modal with item title', () => {
    renderModal();

    expect(screen.getByText('Report Item')).toBeInTheDocument();
    expect(screen.getByText('Test Item Title')).toBeInTheDocument();
  });

  it('should display all report reason options', () => {
    renderModal();

    expect(screen.getByText('Counterfeit or Fake Item')).toBeInTheDocument();
    expect(screen.getByText('Inappropriate Content')).toBeInTheDocument();
    expect(screen.getByText('Misleading Description')).toBeInTheDocument();
    expect(screen.getByText('Prohibited Item')).toBeInTheDocument();
    expect(screen.getByText('Spam or Scam')).toBeInTheDocument();
    expect(screen.getByText('Copyright Violation')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('should allow selecting a reason', () => {
    renderModal();

    const counterfe itOption = screen.getByLabelText(/Counterfeit or Fake Item/i).closest('label');
    fireEvent.click(counterfeitOption!);

    const radioButton = screen.getByRole('radio', { name: /counterfeit/i }) as HTMLInputElement;
    expect(radioButton.checked).toBe(true);
  });

  it('should allow entering additional description', () => {
    renderModal();

    const textarea = screen.getByPlaceholderText(/Provide any additional information/i);
    fireEvent.change(textarea, { target: { value: 'This is clearly fake' } });

    expect(textarea).toHaveValue('This is clearly fake');
  });

  it('should show character count for description', () => {
    renderModal();

    const textarea = screen.getByPlaceholderText(/Provide any additional information/i);
    fireEvent.change(textarea, { target: { value: 'Test description' } });

    expect(screen.getByText(/16 \/ 1000 characters/i)).toBeInTheDocument();
  });

  it('should enforce 1000 character limit on description', () => {
    renderModal();

    const longText = 'A'.repeat(1001);
    const textarea = screen.getByPlaceholderText(/Provide any additional information/i) as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: longText } });
    
    // Should be truncated by maxLength
    expect(textarea.value.length).toBeLessThanOrEqual(1000);
  });

  it('should close modal when Cancel clicked', () => {
    renderModal();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when X button clicked', () => {
    renderModal();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should submit report successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Report submitted' }),
    });

    renderModal();

    // Select reason
    const counterfeitOption = screen.getByLabelText(/Counterfeit or Fake Item/i).closest('label');
    fireEvent.click(counterfeitOption!);

    // Add description
    const textarea = screen.getByPlaceholderText(/Provide any additional information/i);
    fireEvent.change(textarea, { target: { value: 'This is fake' } });

    // Submit
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/reports', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: 'test-item-id',
          reason: 'counterfeit',
          description: 'This is fake',
        }),
      }));
    });

    await waitFor(() => {
      expect(mockOnReported).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should require selecting a reason before submitting', async () => {
    renderModal();

    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);

    // Should not call API without reason
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderModal();

    const counterfeitOption = screen.getByLabelText(/Counterfeit or Fake Item/i).closest('label');
    fireEvent.click(counterfeitOption!);

    const submitButton = screen.getByText('Submit Report') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(submitButton.disabled).toBe(true);
    });
  });

  it('should show false report warning', () => {
    renderModal();

    expect(screen.getByText(/False reports may result in account suspension/i)).toBeInTheDocument();
  });

  it('should handle API error gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Failed to submit report' }),
    });

    renderModal();

    const counterfeitOption = screen.getByLabelText(/Counterfeit or Fake Item/i).closest('label');
    fireEvent.click(counterfeitOption!);

    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show auto-takedown message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        message: 'Report submitted',
        autoTakenDown: true 
      }),
    });

    renderModal();

    const counterfeitOption = screen.getByLabelText(/Counterfeit or Fake Item/i).closest('label');
    fireEvent.click(counterfeitOption!);

    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});


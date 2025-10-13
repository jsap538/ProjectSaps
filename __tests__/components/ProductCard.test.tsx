import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/contexts/CartContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { ToastProvider } from '@/contexts/ToastContext';

const mockItem = {
  _id: '123',
  title: 'Navy Silk Tie',
  brand: "Drake's",
  price_cents: 5000,
  images: [{ url: 'https://example.com/image.jpg', order: 0, isMain: true }],
  condition: 'Like New',
};

// Mock fetch
global.fetch = jest.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      <CartProvider>
        <WatchlistProvider>
          {component}
        </WatchlistProvider>
      </CartProvider>
    </ToastProvider>
  );
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should render item details correctly', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    expect(screen.getByText('Navy Silk Tie')).toBeInTheDocument();
    expect(screen.getByText("Drake's")).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('Like New')).toBeInTheDocument();
  });

  it('should display item image', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    const image = screen.getByAltText('Navy Silk Tie');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('should show fallback image if no images', () => {
    const itemWithoutImages = { ...mockItem, images: [] };
    renderWithProviders(<ProductCard item={itemWithoutImages} />);

    const image = screen.getByAltText('Navy Silk Tie');
    expect(image).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });

  it('should have clickable link to item detail page', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/items/123');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should display Add to Cart button', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('should display Buy Now button', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

  it('should show watchlist button', () => {
    renderWithProviders(<ProductCard item={mockItem} />);

    const watchlistButtons = screen.getAllByRole('button');
    expect(watchlistButtons.length).toBeGreaterThan(0);
  });

  it('should format price correctly', () => {
    const expensiveItem = { ...mockItem, price_cents: 125050 };
    renderWithProviders(<ProductCard item={expensiveItem} />);

    expect(screen.getByText('$1250.50')).toBeInTheDocument();
  });

  it('should format price with exact 2 decimal places', () => {
    const item = { ...mockItem, price_cents: 5000 };
    renderWithProviders(<ProductCard item={item} />);

    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('should handle free items (edge case)', () => {
    const freeItem = { ...mockItem, price_cents: 0 };
    renderWithProviders(<ProductCard item={freeItem} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});


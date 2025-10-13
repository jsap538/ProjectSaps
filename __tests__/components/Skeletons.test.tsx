import { render } from '@testing-library/react';
import {
  ProductCardSkeleton,
  ItemDetailSkeleton,
  CartItemSkeleton,
  WatchlistItemSkeleton,
  DashboardStatSkeleton,
  DashboardItemSkeleton,
} from '@/components/Skeletons';

describe('Skeleton Components', () => {
  it('should render ProductCardSkeleton without errors', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render ItemDetailSkeleton without errors', () => {
    const { container } = render(<ItemDetailSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render CartItemSkeleton without errors', () => {
    const { container } = render(<CartItemSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render WatchlistItemSkeleton without errors', () => {
    const { container } = render(<WatchlistItemSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render DashboardStatSkeleton without errors', () => {
    const { container } = render(<DashboardStatSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render DashboardItemSkeleton without errors', () => {
    const { container } = render(<DashboardItemSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should have consistent styling across all skeletons', () => {
    const skeletons = [
      ProductCardSkeleton,
      CartItemSkeleton,
      WatchlistItemSkeleton,
      DashboardStatSkeleton,
      DashboardItemSkeleton,
    ];

    skeletons.forEach(Skeleton => {
      const { container } = render(<Skeleton />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });
});


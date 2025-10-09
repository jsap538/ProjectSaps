import Link from "next/link";
import { PrimaryButton } from "@/components/Buttons";

export function EmptyCart() {
  return (
    <div className="text-center py-16">
      {/* Empty Cart Illustration */}
      <div className="mb-8 flex justify-center">
        <svg
          className="h-48 w-48 text-nickel/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-porcelain mb-4 text-display">
        Your Cart is Empty
      </h2>
      <p className="text-base sm:text-lg text-nickel mb-8 max-w-md mx-auto text-body">
        Discover premium men's accessories and add them to your cart to get started.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/browse">
          <PrimaryButton>
            Browse Collection
          </PrimaryButton>
        </Link>
        <Link href="/watchlist">
          <button className="px-6 py-3 rounded-xl border border-porcelain/20 text-porcelain font-medium transition-all duration-sap hover:bg-porcelain/5 hover:border-porcelain/40">
            View Watchlist
          </button>
        </Link>
      </div>
    </div>
  );
}

export function EmptyWatchlist() {
  return (
    <div className="text-center py-16">
      {/* Empty Watchlist Illustration */}
      <div className="mb-8 flex justify-center">
        <svg
          className="h-48 w-48 text-nickel/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-porcelain mb-4 text-display">
        Your Watchlist is Empty
      </h2>
      <p className="text-base sm:text-lg text-nickel mb-8 max-w-md mx-auto text-body">
        Save items you love to your watchlist and we'll notify you of price drops.
      </p>
      
      <Link href="/browse">
        <PrimaryButton>
          Discover Items
        </PrimaryButton>
      </Link>
    </div>
  );
}

export function EmptyDashboard() {
  return (
    <div className="text-center py-16">
      {/* Empty Dashboard Illustration */}
      <div className="mb-8 flex justify-center">
        <svg
          className="h-48 w-48 text-nickel/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-porcelain mb-4 text-display">
        No Items Listed Yet
      </h2>
      <p className="text-base sm:text-lg text-nickel mb-8 max-w-md mx-auto text-body">
        Start selling by creating your first listing. It only takes a few minutes.
      </p>
      
      <Link href="/sell">
        <PrimaryButton>
          List Your First Item
        </PrimaryButton>
      </Link>
    </div>
  );
}

export function EmptyBrowse() {
  return (
    <div className="text-center py-16">
      {/* Empty Browse Illustration */}
      <div className="mb-8 flex justify-center">
        <svg
          className="h-48 w-48 text-nickel/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-porcelain mb-4 text-display">
        No Items Found
      </h2>
      <p className="text-base sm:text-lg text-nickel mb-8 max-w-md mx-auto text-body">
        Try adjusting your filters or search terms to find what you're looking for.
      </p>
      
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-xl bg-porcelain text-ink font-medium transition-all duration-sap hover:-translate-y-px shadow-soft"
      >
        Clear All Filters
      </button>
    </div>
  );
}


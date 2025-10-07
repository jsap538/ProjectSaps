"use client";

import { useWatchlist } from "@/contexts/WatchlistContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { PrimaryButton, GhostButton } from "@/components/Buttons";
import BrandMark from "@/components/BrandMark";

export default function WatchlistPage() {
  const { isSignedIn, isLoaded } = useUser();
  const {
    watchlist,
    watchlistCount,
    isLoading,
    error,
    removeFromWatchlist,
    fetchWatchlist,
  } = useWatchlist();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-titanium mx-auto"></div>
          <p className="mt-4 text-nickel">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-2xl font-medium text-porcelain mb-4">
            Access Denied
          </h1>
          <p className="text-nickel mb-6">
            Please sign in to view your watchlist.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-in">
              <PrimaryButton>
                Sign In
              </PrimaryButton>
            </Link>
            <Link href="/sign-up">
              <GhostButton>
                Sign Up
              </GhostButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-titanium mx-auto"></div>
          <p className="mt-4 text-nickel">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-2xl font-medium text-porcelain mb-4">
            Error Loading Watchlist
          </h1>
          <p className="text-nickel mb-6">{error}</p>
          <button
            onClick={fetchWatchlist}
            className="rounded-xl bg-porcelain text-ink px-6 py-3 font-medium hover:bg-titanium transition-colors duration-sap"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (watchlistCount === 0) {
    return (
      <div className="min-h-screen bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
            <h1 className="text-4xl font-semibold text-porcelain mb-4 text-display">
              Your Watchlist is Empty
            </h1>
            <p className="text-nickel mb-8 text-body">
              Start watching items you're interested in. You'll be notified of price changes and availability.
            </p>
            <Link href="/browse">
              <PrimaryButton>
                Start Watching
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
            Your Watchlist
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            Watched Items
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            {watchlistCount} {watchlistCount === 1 ? 'item' : 'items'} you're watching for price changes and availability.
          </p>
        </div>

        {/* Watchlist Items */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {watchlist.map((item) => (
            <div
              key={item._id}
              className="group rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle transition-all duration-sap hover:shadow-soft"
            >
              <Link href={`/items/${item._id}`} className="block">
                <div className="relative aspect-[4/5] bg-ink mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={item.images?.[0] || 'https://placehold.co/400x500/0B0C0E/F5F6F7?text=No+Image'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-sap group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized
                  />
                  
                  {/* Watchlist indicator */}
                  <div className="absolute top-4 left-4">
                    <div className="rounded-full bg-red-500/90 backdrop-blur-sm p-2">
                      <Heart className="h-4 w-4 fill-porcelain text-porcelain" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Condition badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-sm bg-ink/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-porcelain shadow-sm">
                      {item.condition}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-nickel">
                    {item.brand}
                  </div>
                  
                  <h3 className="text-porcelain font-medium line-clamp-2 group-hover:text-titanium transition-colors duration-sap">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-light text-porcelain">
                      ${(item.price_cents / 100).toFixed(2)}
                    </span>
                    <div className="flex items-center text-sm font-medium text-nickel group-hover:text-titanium transition-colors duration-sap">
                      <span className="mr-1">View</span>
                      <svg className="h-4 w-4 transition-transform duration-sap group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Remove from watchlist button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => removeFromWatchlist(item._id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-sap flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  <span className="text-sm font-medium">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-16 text-center">
          <Link href="/browse">
            <GhostButton>
              Continue Shopping
            </GhostButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

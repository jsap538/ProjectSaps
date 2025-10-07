"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

interface WatchlistItem {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  images: string[];
  condition: string;
  createdAt: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  watchlistCount: number;
  isLoading: boolean;
  isItemLoading: (itemId: string) => boolean;
  error: string | null;
  addToWatchlist: (itemId: string) => Promise<void>;
  removeFromWatchlist: (itemId: string) => Promise<void>;
  isInWatchlist: (itemId: string) => boolean;
  fetchWatchlist: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    if (!isSignedIn) {
      setWatchlist([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/watchlist');
      const data = await response.json();
      
      if (data.success) {
        setWatchlist(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch watchlist');
      }
    } catch (err: any) {
      console.error('Error fetching watchlist:', err);
      setError(err.message);
      setWatchlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchWatchlist();
    }
  }, [isLoaded, isSignedIn]);

  const addToWatchlist = async (itemId: string) => {
    if (!isSignedIn) {
      setError('Please sign in to add items to your watchlist.');
      return;
    }
    
    // Set loading for this specific item
    setLoadingItems(prev => new Set(prev).add(itemId));
    setError(null);
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Fetch full watchlist to get complete item details
        await fetchWatchlist();
      } else {
        throw new Error(data.error || 'Failed to add item to watchlist');
      }
    } catch (err: any) {
      console.error('Error adding to watchlist:', err);
      setError(err.message);
    } finally {
      // Remove loading for this specific item
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeFromWatchlist = async (itemId: string) => {
    if (!isSignedIn) {
      setError('Please sign in to modify your watchlist.');
      return;
    }
    
    // Set loading for this specific item
    setLoadingItems(prev => new Set(prev).add(itemId));
    setError(null);
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Optimistically remove from watchlist
        setWatchlist(prevWatchlist => prevWatchlist.filter(item => item._id !== itemId));
      } else {
        throw new Error(data.error || 'Failed to remove item from watchlist');
      }
    } catch (err: any) {
      console.error('Error removing from watchlist:', err);
      setError(err.message);
    } finally {
      // Remove loading for this specific item
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const isInWatchlist = (itemId: string): boolean => {
    return watchlist.some(item => item._id === itemId);
  };

  const isItemLoading = (itemId: string): boolean => {
    return loadingItems.has(itemId);
  };

  const watchlistCount = watchlist.length;

  const value: WatchlistContextType = {
    watchlist,
    watchlistCount,
    isLoading,
    isItemLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    fetchWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

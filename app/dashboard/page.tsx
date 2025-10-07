"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  condition: string;
  isApproved: boolean;
  isActive: boolean;
  views: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchMyItems();
    }
  }, [isLoaded, user]);

  const fetchMyItems = async () => {
    try {
      const response = await fetch('/api/items/my-items');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch items');
      }
      
      if (data.success) {
        setItems(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('User synced successfully! You can now use the marketplace features.');
        // Refresh the page to show the updated state
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to sync user');
      }
    } catch (err) {
      console.error('Error syncing user:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync user');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh the items list
      fetchMyItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access your dashboard.
          </p>
          <Link
            href="/sign-in"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark md:text-4xl dark:text-white">
            Seller Dashboard
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Welcome back, {user.firstName || 'Seller'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Items</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">
                  {items.filter(item => item.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-semibold text-dark dark:text-white">
                  {items.reduce((sum, item) => sum + item.views, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <Link
            href="/sell"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List New Item
          </Link>
          
          <button
            onClick={syncUser}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync User to Database
          </button>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-[#1f2329] rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-dark dark:text-white">My Items</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading items...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchMyItems}
                className="mt-2 text-primary hover:text-primary-dark"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No items yet</p>
              <Link
                href="/sell"
                className="text-primary hover:text-primary-dark"
              >
                List your first item
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item) => (
                <div key={item._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-dark dark:text-white">
                          {item.title}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>${(item.price_cents / 100).toFixed(2)}</span>
                        <span>•</span>
                        <span>{item.condition}</span>
                        <span>•</span>
                        <span>{item.views} views</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.isApproved 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {item.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/items/${item._id}`}
                        className="text-primary hover:text-primary-dark text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

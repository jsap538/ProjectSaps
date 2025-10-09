"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardStatSkeleton, DashboardItemSkeleton } from "@/components/Skeletons";
import { EmptyDashboard } from "@/components/EmptyStates";

interface Item {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  condition: string;
  isApproved: boolean;
  isActive: boolean;
  stats: {
    views: number;
  };
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
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-titanium mx-auto"></div>
          <p className="mt-4 text-nickel">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-porcelain mb-4">
            Access Denied
          </h1>
          <p className="text-nickel mb-6">
            Please sign in to access your dashboard.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-porcelain text-ink font-medium transition-transform duration-sap hover:-translate-y-px"
          >
            Sign In
          </Link>
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
            Seller Dashboard
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            Welcome back, {user.firstName || 'Seller'}
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Manage your listings and track your sales performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
              <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-nickel mb-2">Total Items</p>
            <p className="text-3xl font-semibold text-porcelain">{items.length}</p>
          </div>

          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
              <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-nickel mb-2">Approved Items</p>
            <p className="text-3xl font-semibold text-porcelain">
              {items.filter(item => item.isApproved).length}
            </p>
          </div>

          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
              <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-nickel mb-2">Total Views</p>
            <p className="text-3xl font-semibold text-porcelain">
              {items.reduce((sum, item) => sum + item.stats.views, 0)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-16 text-center">
          <Link
            href="/sell"
            className="inline-flex items-center px-8 py-4 bg-porcelain text-ink rounded-xl font-medium transition-transform duration-sap hover:-translate-y-px shadow-soft"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List New Item
          </Link>
        </div>

        {/* Items List */}
        <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 shadow-soft">
          <div className="px-8 py-6 border-b border-porcelain/10">
            <h2 className="text-xl font-semibold text-porcelain">My Items</h2>
          </div>

          {loading ? (
            <div className="divide-y divide-porcelain/10">
              {[...Array(5)].map((_, i) => (
                <DashboardItemSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchMyItems}
                className="rounded-xl bg-porcelain text-ink px-6 py-3 font-medium hover:bg-titanium transition-colors duration-sap"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8">
              <EmptyDashboard />
            </div>
          ) : (
            <div className="divide-y divide-porcelain/10">
              {items.map((item) => (
                <div key={item._id} className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-porcelain">
                          {item.title}
                        </h3>
                        <span className="text-sm text-nickel">
                          {item.brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-nickel">
                        <span className="text-titanium font-medium">${(item.price_cents / 100).toFixed(2)}</span>
                        <span>•</span>
                        <span>{item.condition}</span>
                        <span>•</span>
                        <span>{item.stats.views} views</span>
                        <span>•</span>
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          item.isApproved 
                            ? 'bg-titanium/20 text-titanium'
                            : 'bg-nickel/20 text-nickel'
                        }`}>
                          {item.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/items/${item._id}`}
                        className="text-titanium hover:text-porcelain text-sm font-medium transition-colors duration-sap"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-sap"
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

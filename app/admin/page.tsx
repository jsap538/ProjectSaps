"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Item {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  images?: string[];
  condition: string;
  category: string;
  color: string;
  description: string;
  isApproved: boolean;
  createdAt: string;
  sellerId: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (isLoaded && user) {
      fetchItems();
    }
  }, [isLoaded, user, selectedTab]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/items');
      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
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

  const approveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/items/${itemId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve item');
      }
      fetchItems(); // Refresh the list
    } catch (err) {
      console.error('Error approving item:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve item');
    }
  };

  const rejectItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/items/${itemId}/reject`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reject item');
      }
      fetchItems(); // Refresh the list
    } catch (err) {
      console.error('Error rejecting item:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject item');
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
    router.push('/sign-in');
    return null;
  }

  // Filter items based on selected tab
  const filteredItems = items.filter(item => {
    switch (selectedTab) {
      case 'pending':
        return !item.isApproved;
      case 'approved':
        return item.isApproved;
      case 'rejected':
        return false; // We'll add rejected status later
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark md:text-4xl dark:text-white">
            Admin Panel
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Manage item approvals and marketplace content
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending Review', count: items.filter(item => !item.isApproved).length },
                { key: 'approved', label: 'Approved', count: items.filter(item => item.isApproved).length },
                { key: 'rejected', label: 'Rejected', count: 0 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Items List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-[#1f2329] dark:ring-gray-800">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-[#1f2329] dark:ring-gray-800">
                <div className="flex gap-6">
                  {/* Item Image */}
                  <div className="w-32 h-32 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-dark dark:text-white">
                        {item.title}
                      </h3>
                      <span className="text-2xl font-bold text-primary">
                        ${(item.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {item.brand} • {item.condition} • {item.category}
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Seller: {item.sellerId?.firstName} {item.sellerId?.lastName}</p>
                        <p>Submitted: {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>

                      {selectedTab === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => rejectItem(item._id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveItem(item._id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-200 dark:bg-[#1f2329] dark:ring-gray-800">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No items found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

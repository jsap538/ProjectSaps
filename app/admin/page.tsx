"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { IItemImage } from "@/types";

interface Item {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  images?: IItemImage[];
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
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected' | 'reports'>('pending');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Check admin status first
  useEffect(() => {
    if (isLoaded && user) {
      checkAdminStatus();
    }
  }, [isLoaded, user]);

  // Fetch items only if admin
  useEffect(() => {
    if (isAdmin) {
      if (selectedTab === 'reports') {
        fetchReports();
      } else {
        fetchItems();
      }
    }
  }, [isAdmin, selectedTab]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      if (data.success && data.data.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  };

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

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?status=pending');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
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

  const resolveReport = async (reportId: string, action: string, notes?: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNotes: notes }),
      });
      if (!response.ok) {
        throw new Error('Failed to resolve report');
      }
      fetchReports(); // Refresh the reports list
    } catch (err) {
      console.error('Error resolving report:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve report');
    }
  };


  if (!isLoaded || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the admin panel.
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="h-24 w-24 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You do not have administrator privileges to access this page. 
            Please contact support if you believe this is an error.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Go Home
            </Link>
            <Link
              href="/browse"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Browse Items
            </Link>
          </div>
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
    <div className="min-h-screen bg-gray-200">
      <div className="mx-auto max-w-6xl px-8 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 md:text-5xl">
            Admin Panel
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage item approvals and marketplace content
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-300">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending Review', count: items.filter(item => !item.isApproved).length },
                { key: 'approved', label: 'Approved', count: items.filter(item => item.isApproved).length },
                { key: 'rejected', label: 'Rejected', count: 0 },
                { key: 'reports', label: 'Reported Items', count: reports.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-300 shadow-sm p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedTab === 'reports' ? (
          /* Reports List */
          reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report: any) => (
                <div key={report._id} className="bg-white border-2 border-red-200 shadow-sm p-6">
                  <div className="flex gap-6">
                    {/* Item Image */}
                    <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                      {report.itemId?.images && report.itemId.images.length > 0 ? (
                        <img
                          src={report.itemId.images[0].url}
                          alt={report.itemId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>

                    {/* Report Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">
                            {report.itemId?.title || 'Deleted Item'}
                          </h3>
                          <p className="text-gray-600">
                            {report.itemId?.brand} • {report.itemId?.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-red-900 mb-1">
                          Reason: {report.reason.charAt(0).toUpperCase() + report.reason.slice(1).replace('_', ' ')}
                        </p>
                        {report.description && (
                          <p className="text-sm text-red-800">
                            {report.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <p>Reported by: {report.reporterId?.firstName} {report.reporterId?.lastName}</p>
                          <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => resolveReport(report._id, 'dismissed', 'No violation found')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-sm hover:bg-gray-200 transition border border-gray-300"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Enter moderation notes (optional):');
                              resolveReport(report._id, 'item_removed', notes || 'Violation confirmed');
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 transition"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-300 shadow-sm p-16 text-center">
              <p className="text-lg text-gray-600">
                No pending reports. Great job keeping the marketplace clean!
              </p>
            </div>
          )
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white border border-gray-300 shadow-sm p-6">
                <div className="flex gap-6">
                  {/* Item Image */}
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
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
                      <h3 className="text-xl font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <span className="text-2xl font-light text-gray-900">
                        ${(item.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {item.brand} • {item.condition} • {item.category}
                    </p>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p>Seller: {item.sellerId?.firstName} {item.sellerId?.lastName}</p>
                        <p>Submitted: {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>

                      {selectedTab === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => rejectItem(item._id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-sm hover:bg-red-100 transition border border-red-200"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveItem(item._id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 transition"
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
          <div className="bg-white border border-gray-300 shadow-sm p-16 text-center">
            <p className="text-lg text-gray-600">
              No items found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

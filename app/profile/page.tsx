"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface UserProfile {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  isSeller: boolean;
  rating: number;
  totalSales: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const becomeSeller = async () => {
    if (!confirm('Are you sure you want to become a seller? This action cannot be undone.')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/profile/become-seller', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update seller status');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, isSeller: true } : null);
      } else {
        throw new Error(data.error || 'Failed to update seller status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUpdating(false);
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
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark md:text-4xl dark:text-white">
            Profile
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Manage your account settings and seller status
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 text-red-600 dark:text-red-400 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
              <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
                Account Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="text-dark dark:text-white">{profile.firstName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="text-dark dark:text-white">{profile.lastName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="text-dark dark:text-white">{profile.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Since
                  </label>
                  <div className="text-dark dark:text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Status */}
            <div className="bg-white dark:bg-[#1f2329] rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
              <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
                Seller Status
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.isSeller 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {profile.isSeller ? 'Active Seller' : 'Buyer Only'}
                    </span>
                  </div>
                  {profile.isSeller ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>Rating: {profile.rating.toFixed(1)}/5.0</div>
                      <div>Total Sales: {profile.totalSales}</div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Become a seller to start listing items and earning money.
                    </p>
                  )}
                </div>

                {!profile.isSeller && (
                  <button
                    onClick={becomeSeller}
                    disabled={updating}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Updating...' : 'Become Seller'}
                  </button>
                )}
              </div>
            </div>

            {/* Seller Benefits */}
            {!profile.isSeller && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
                  Seller Benefits
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    List unlimited items for sale
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to seller dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Build your seller rating and reputation
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Secure payments and buyer protection
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

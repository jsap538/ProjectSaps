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
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="mx-auto max-w-4xl px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 md:text-5xl">
            Profile
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your account settings and seller status
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 text-red-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="bg-white border border-gray-300 shadow-sm p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Account Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    First Name
                  </label>
                  <div className="text-gray-900">{profile.firstName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Last Name
                  </label>
                  <div className="text-gray-900">{profile.lastName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <div className="text-gray-900">{profile.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Member Since
                  </label>
                  <div className="text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Status */}
            <div className="bg-white border border-gray-300 shadow-sm p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Seller Status
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-sm text-sm font-medium ${
                      profile.isSeller 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.isSeller ? 'Active Seller' : 'Buyer Only'}
                    </span>
                  </div>
                  {profile.isSeller ? (
                    <div className="text-sm text-gray-600">
                      <div>Rating: {profile.rating.toFixed(1)}/5.0</div>
                      <div>Total Sales: {profile.totalSales}</div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Become a seller to start listing items and earning money.
                    </p>
                  )}
                </div>

                {!profile.isSeller && (
                  <button
                    onClick={becomeSeller}
                    disabled={updating}
                    className="bg-gray-900 text-white px-6 py-3 rounded-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Updating...' : 'Become Seller'}
                  </button>
                )}
              </div>
            </div>

            {/* Seller Benefits */}
            {!profile.isSeller && (
              <div className="bg-gray-50 border border-gray-300 p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Seller Benefits
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    List unlimited items for sale
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to seller dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Build your seller rating and reputation
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
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

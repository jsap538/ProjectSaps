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
            Please sign in to view your profile.
          </p>
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
            Account Settings
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            Profile
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Manage your account settings and seller status
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-titanium mx-auto"></div>
            <p className="mt-4 text-nickel">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="rounded-xl bg-porcelain text-ink px-6 py-3 font-medium hover:bg-titanium transition-colors duration-sap"
            >
              Try Again
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Profile Information */}
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-porcelain mb-6">
                Account Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-nickel mb-2">
                    First Name
                  </label>
                  <div className="text-porcelain">{profile.firstName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nickel mb-2">
                    Last Name
                  </label>
                  <div className="text-porcelain">{profile.lastName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nickel mb-2">
                    Email
                  </label>
                  <div className="text-porcelain">{profile.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nickel mb-2">
                    Member Since
                  </label>
                  <div className="text-porcelain">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Status */}
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-porcelain mb-6">
                Seller Status
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-xl text-sm font-medium ${
                      profile.isSeller 
                        ? 'bg-titanium/20 text-titanium'
                        : 'bg-nickel/20 text-nickel'
                    }`}>
                      {profile.isSeller ? 'Active Seller' : 'Buyer Only'}
                    </span>
                  </div>
                  {profile.isSeller ? (
                    <div className="text-sm text-nickel">
                      <div>Rating: <span className="text-titanium font-medium">{profile.rating.toFixed(1)}/5.0</span></div>
                      <div>Total Sales: <span className="text-titanium font-medium">{profile.totalSales}</span></div>
                    </div>
                  ) : (
                    <p className="text-sm text-nickel">
                      Become a seller to start listing items and earning money.
                    </p>
                  )}
                </div>

                {!profile.isSeller && (
                  <button
                    onClick={becomeSeller}
                    disabled={updating}
                    className="rounded-xl bg-porcelain text-ink px-6 py-3 font-medium transition-transform duration-sap hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updating ? 'Updating...' : 'Become Seller'}
                  </button>
                )}
              </div>
            </div>

            {/* Seller Benefits */}
            {!profile.isSeller && (
              <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
                <h3 className="text-lg font-semibold text-porcelain mb-6">
                  Seller Benefits
                </h3>
                <ul className="space-y-4 text-nickel text-body">
                  <li className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                      <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    List unlimited items for sale
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                      <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Access to seller dashboard
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                      <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Build your seller rating and reputation
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                      <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
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

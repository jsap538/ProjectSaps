"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Temporarily disable admin check due to ngrok auth issues
      // TODO: Re-enable when Clerk auth is working properly with ngrok
      // checkAdminStatus();
      setIsAdmin(false); // Default to non-admin for now
    }
  }, [isSignedIn, user]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsAdmin(data.user.isAdmin || false);
        }
      } else if (response.status === 401) {
        // Handle unauthorized - user might not be synced to database yet
        console.log('Admin check: User not found in database, defaulting to non-admin');
        setIsAdmin(false);
      } else {
        console.error('Error fetching admin status:', response.status);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // Don't show admin link if we can't verify status
      setIsAdmin(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-[#1a1d24]/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-dark transition hover:text-primary dark:text-white">
            SAPS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 md:flex">
            <Link
              href="/browse"
              className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Sell
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              How It Works
            </Link>
            <div className="ml-6 flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hello, {user?.firstName || 'User'}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-700 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-dark hover:shadow-md hover:shadow-primary/30"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-dark dark:text-white md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1a1d24] md:hidden">
          <div className="space-y-1 px-6 py-4">
            <Link
              href="/browse"
              className="block py-3 text-base font-medium text-dark dark:text-gray-300"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="block py-3 text-base font-medium text-dark dark:text-gray-300"
            >
              Sell
            </Link>
            <Link
              href="/how-it-works"
              className="block py-3 text-base font-medium text-dark dark:text-gray-300"
            >
              How It Works
            </Link>
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              {isSignedIn ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block py-3 text-base font-medium text-dark dark:text-gray-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-3 text-base font-medium text-dark dark:text-gray-300"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block py-3 text-base font-medium text-dark dark:text-gray-300"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-base font-medium text-dark dark:text-gray-300">
                      Hello, {user?.firstName || 'User'}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block py-3 text-base font-medium text-dark dark:text-gray-300"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isSignedIn, user } = useUser();
  const { cartCount } = useCart();

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
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/70 border-b border-porcelain/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 text-porcelain transition-colors duration-sap hover:text-titanium">
            <BrandMark className="h-8 w-8 text-titanium" />
            <span className="text-2xl font-semibold tracking-wide1">SAPS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-porcelain/80">
            <Link
              href="/browse"
              className="sap-link text-sm font-medium transition-colors duration-sap hover:text-porcelain"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="sap-link text-sm font-medium transition-colors duration-sap hover:text-porcelain"
            >
              Sell
            </Link>
            <Link
              href="/how-it-works"
              className="sap-link text-sm font-medium transition-colors duration-sap hover:text-porcelain"
            >
              How It Works
            </Link>
            <div className="ml-6 flex items-center gap-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 text-porcelain/80 transition-colors duration-sap hover:text-porcelain"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-titanium text-ink text-xs font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="sap-link text-sm font-medium text-porcelain/80 transition-colors duration-sap hover:text-porcelain"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="sap-link text-sm font-medium text-porcelain/80 transition-colors duration-sap hover:text-porcelain"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="sap-link text-sm font-medium text-porcelain/80 transition-colors duration-sap hover:text-porcelain"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-nickel">
                    Hello, {user?.firstName || 'User'}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="sap-link text-sm font-medium text-porcelain/80 transition-colors duration-sap hover:text-porcelain"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-ink bg-porcelain shadow-subtle transition-transform duration-sap hover:-translate-y-px"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-porcelain md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-porcelain/10 bg-graphite/95 backdrop-blur md:hidden">
          <div className="space-y-1 px-6 py-4">
            <Link
              href="/browse"
              className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
            >
              Sell
            </Link>
            <Link
              href="/how-it-works"
              className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
            >
              How It Works
            </Link>
            <div className="border-t border-porcelain/10 pt-4">
              {isSignedIn ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-base font-medium text-porcelain/90">
                      Hello, {user?.firstName || 'User'}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block py-3 text-base font-medium text-porcelain/90 transition-colors duration-sap hover:text-porcelain"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="mt-2 block rounded-xl bg-porcelain text-ink px-4 py-3 text-center text-base font-semibold transition-transform duration-sap hover:-translate-y-px"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


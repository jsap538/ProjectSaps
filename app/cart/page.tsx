"use client";

import { useCart } from "@/contexts/CartContext";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PrimaryButton, GhostButton } from "@/components/Buttons";
import BrandMark from "@/components/BrandMark";

export default function CartPage() {
  const { cart, cartCount, isLoading, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isSignedIn } = useUser();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRemoveItem = async (itemId: string) => {
    console.log('handleRemoveItem called with:', itemId); // Debug log
    console.log('Cart data:', cart); // Debug log
    
    if (!itemId) {
      console.error('No itemId provided to handleRemoveItem');
      alert('Error: No item ID provided');
      return;
    }
    
    setIsUpdating(itemId);
    try {
      await removeFromCart(itemId);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-porcelain mb-4">
            Sign In Required
          </h1>
          <p className="text-nickel mb-8">
            Please sign in to view your shopping cart.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-in">
              <PrimaryButton>
                Sign In
              </PrimaryButton>
            </Link>
            <Link href="/sign-up">
              <GhostButton>
                Sign Up
              </GhostButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-titanium mx-auto"></div>
          <p className="mt-4 text-nickel">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-ink">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
            <h1 className="text-4xl font-semibold text-porcelain mb-4 text-display">
              Your Cart is Empty
            </h1>
            <p className="text-nickel mb-8 text-body">
              Add some premium accessories to get started.
            </p>
            <Link href="/browse">
              <PrimaryButton>
                Start Shopping
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 10000 ? 0 : 1000; // Free shipping over $100
  const finalTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
            Shopping Cart
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            Your Cart
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((cartItem) => {
                console.log('Rendering cart item:', cartItem); // Debug log
                return (
                <div
                  key={cartItem.itemId}
                  className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle"
                >
                  <div className="flex gap-6">
                    {/* Item Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-ink">
                      <Image
                        src={cartItem.item?.images?.[0]?.url || 'https://placehold.co/200x200/0B0C0E/F5F6F7?text=No+Image'}
                        alt={cartItem.item?.title || 'Item'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/items/${cartItem.itemId}`}>
                            <h3 className="text-lg font-semibold text-porcelain hover:text-titanium transition-colors duration-sap cursor-pointer">
                              {cartItem.item?.title || 'Item'}
                            </h3>
                          </Link>
                          <p className="text-nickel">{cartItem.item?.brand}</p>
                          <p className="text-sm text-nickel">Condition: {cartItem.item?.condition}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-semibold text-titanium">
                            ${((cartItem.item?.price_cents || 0) / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-nickel">
                            ${(((cartItem.item?.price_cents || 0) * cartItem.quantity) / 100).toFixed(2)} total
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRemoveItem(cartItem.itemId)}
                          disabled={isUpdating === cartItem.itemId}
                          className="text-red-400 hover:text-red-300 transition-colors duration-sap disabled:opacity-50 flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-8">
              <button
                onClick={handleClearCart}
                className="text-nickel hover:text-porcelain transition-colors duration-sap"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-porcelain mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-nickel">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>${(totalPrice / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-nickel">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}</span>
                </div>
                
                {shipping > 0 && (
                  <p className="text-sm text-nickel">
                    Add ${((10000 - totalPrice) / 100).toFixed(2)} more for free shipping
                  </p>
                )}
                
                <div className="border-t border-porcelain/10 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-porcelain">
                    <span>Total</span>
                    <span>${(finalTotal / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button className="w-full rounded-xl bg-porcelain text-ink px-6 py-4 font-semibold transition-transform duration-sap hover:-translate-y-px shadow-soft">
                  Proceed to Checkout
                </button>
                
                <Link href="/browse" className="block">
                  <button className="w-full rounded-xl border border-porcelain/20 text-porcelain px-6 py-4 font-medium transition-colors duration-sap hover:bg-porcelain/5">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

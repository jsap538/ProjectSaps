"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import { formatCurrency } from '@/lib/format';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { cart, getTotalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  
  // Check if this is a "Buy Now" checkout (single item, skip cart)
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const buyNowItemId = searchParams?.get('item');

  const createOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use either Buy Now item or cart items
      const itemIds = buyNowItemId ? [buyNowItemId] : cart.map(item => item.itemId);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemIds,
          shippingAddressIndex: 0, // TODO: Let user select
          skipCartClear: !!buyNowItemId, // Don't clear cart for Buy Now purchases
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      setClientSecret(data.data.clientSecret);
      setOrderId(data.data.order._id);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  }, [cart, buyNowItemId]);

  // Fetch buy now item if needed
  useEffect(() => {
    if (buyNowItemId && isSignedIn) {
      fetch(`/api/items/${buyNowItemId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBuyNowItem(data.data);
          }
        })
        .catch(err => console.error('Error fetching buy now item:', err));
    }
  }, [buyNowItemId, isSignedIn]);

  useEffect(() => {
    // Redirect if not signed in
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect=/checkout');
      return;
    }

    // Redirect if cart is empty AND not a buy now checkout
    if (isLoaded && !buyNowItemId && cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Create order and get payment intent
    if (isSignedIn && (cart.length > 0 || buyNowItemId)) {
      createOrder();
    }
  }, [isSignedIn, isLoaded, cart.length, buyNowItemId, createOrder, router]);

  // Calculate total based on buy now or cart
  const totalPrice = buyNowItem 
    ? buyNowItem.price_cents 
    : getTotalPrice();
  
  // Items to display in checkout
  const checkoutItems = buyNowItem 
    ? [{
        itemId: buyNowItem._id,
        item: {
          _id: buyNowItem._id,
          title: buyNowItem.title,
          brand: buyNowItem.brand,
          price_cents: buyNowItem.price_cents,
          images: buyNowItem.images,
          condition: buyNowItem.condition,
        },
        quantity: 1,
      }]
    : cart;

  // Stripe Elements options
  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#33CC66',      // Digital Fern
      colorBackground: '#1a2742',   // Slightly lighter than ink for form
      colorText: '#F5F6F7',         // Porcelain
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-titanium border-r-transparent mb-4"></div>
          <p className="text-porcelain text-lg">Preparing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-graphite/60 border border-red-500/20 rounded-xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-porcelain mb-4">
            Checkout Error
          </h1>
          <p className="text-nickel mb-6">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="rounded-xl bg-titanium/20 border border-titanium/30 text-titanium px-6 py-3 font-medium transition-all duration-sap hover:bg-titanium/30"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center text-porcelain">
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(buyNowItemId ? `/items/${buyNowItemId}` : '/cart')}
          className="flex items-center gap-2 text-nickel hover:text-porcelain transition-colors duration-sap mb-8 group"
        >
          <svg className="w-5 h-5 transition-transform duration-sap group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{buyNowItemId ? 'Back to Item' : 'Back to Cart'}</span>
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-porcelain mb-4 text-display">
            Secure Checkout
          </h1>
          <p className="text-nickel text-lg text-body">
            Complete your purchase securely with Stripe
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Order Summary */}
          <div>
            <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {checkoutItems.map((cartItem) => (
                  <div
                    key={cartItem.itemId}
                    className="flex gap-4 pb-4 border-b border-porcelain/10 last:border-0"
                  >
                    {cartItem.item && (
                      <>
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={cartItem.item.images[0]?.url || 'https://placehold.co/200x200/0B0C0E/F5F6F7?text=No+Image'}
                            alt={cartItem.item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-porcelain font-medium">
                            {cartItem.item.title}
                          </h3>
                          <p className="text-nickel text-sm">
                            {cartItem.item.brand}
                          </p>
                          <p className="text-titanium font-medium mt-1">
                            {formatCurrency(cartItem.item.price_cents)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 pt-4 border-t border-porcelain/10">
                <div className="flex justify-between text-nickel">
                  <span>Subtotal ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-nickel">
                  <span>Platform Fee (10%)</span>
                  <span>{formatCurrency(Math.round(totalPrice * 0.10))}</span>
                </div>
                <div className="flex justify-between text-nickel">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-porcelain pt-3 border-t border-porcelain/10">
                  <span>Total</span>
                  <span>{formatCurrency(Math.round(totalPrice * 1.10))}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-nickel text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div>
            <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6">
                Payment Details
              </h2>

              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm orderId={orderId} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


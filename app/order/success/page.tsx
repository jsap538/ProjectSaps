"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-titanium border-r-transparent mb-4"></div>
          <p className="text-porcelain text-lg">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-graphite/60 border border-porcelain/10 rounded-xl p-8 text-center">
          <div className="text-nickel text-5xl mb-4">❓</div>
          <h1 className="text-2xl font-semibold text-porcelain mb-4">
            Order Not Found
          </h1>
          <p className="text-nickel mb-6">
            We couldn't find your order. Please check your email for confirmation.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-titanium text-ink px-6 py-3 font-medium transition-all duration-sap hover:-translate-y-px"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-semibold text-porcelain mb-4 text-display">
            Payment Successful!
          </h1>
          <p className="text-nickel text-lg text-body">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-8 shadow-soft mb-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-porcelain/10">
            <div>
              <p className="text-nickel text-sm mb-1">Order Number</p>
              <p className="text-2xl font-semibold text-porcelain">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-nickel text-sm mb-1">Status</p>
              <span className="inline-block px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
                {order.paymentStatus === 'paid' ? 'Paid' : 'Processing'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-porcelain font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item._id} className="flex gap-4 p-3 rounded-lg bg-ink/40">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || 'https://placehold.co/200x200/0B0C0E/F5F6F7?text=No+Image'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-porcelain font-medium">{item.title}</p>
                    <p className="text-nickel text-sm">{item.brand}</p>
                    <p className="text-titanium font-medium">${(item.price_cents / 100).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 pt-4 border-t border-porcelain/10">
            <div className="flex justify-between text-nickel">
              <span>Subtotal</span>
              <span>${(order.subtotal_cents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-nickel">
              <span>Platform Fee</span>
              <span>${(order.serviceFee_cents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-nickel">
              <span>Shipping</span>
              <span>${(order.shipping_cents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-porcelain pt-2 border-t border-porcelain/10">
              <span>Total Paid</span>
              <span>${(order.total_cents / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6 mb-6">
          <h3 className="text-porcelain font-semibold mb-4">What's Next?</h3>
          <ul className="space-y-3 text-nickel">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-titanium mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-titanium mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>The seller will be notified and will ship your item</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-titanium mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Track your order status in your dashboard</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 text-center rounded-xl bg-titanium text-ink px-6 py-4 font-semibold transition-all duration-sap hover:-translate-y-px shadow-subtle"
          >
            View My Orders
          </Link>
          <Link
            href="/browse"
            className="flex-1 text-center rounded-xl bg-graphite border border-porcelain/20 text-porcelain px-6 py-4 font-semibold transition-all duration-sap hover:bg-graphite/80"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-titanium border-r-transparent mb-4"></div>
          <p className="text-porcelain text-lg">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use, useCallback } from "react";
import type { IItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { ItemDetailSkeleton } from "@/components/Skeletons";
import ImageLightbox from "@/components/ImageLightbox";
import ReportModal from "@/components/ReportModal";
import { Flag } from "lucide-react";

interface PopulatedItem extends Omit<IItem, 'sellerId'> {
  sellerId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    stats?: {
      totalSold?: number;
      averageRating?: number;
    };
  };
}

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<PopulatedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const { addToCart, removeFromCart, isInCart, isItemLoading } = useCart();
  const router = useRouter();

  const fetchItem = useCallback(async () => {
    try {
      const response = await fetch(`/api/items/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Item not found');
      }
      const data = await response.json();
      if (data.success) {
        setItem(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch item');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleCartToggle = async () => {
    if (!item) return;
    
    setIsAddingToCart(true);
    try {
      if (isInCart(item._id)) {
        await removeFromCart(item._id);
      } else {
        await addToCart(item._id, 1);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!item) return;
    
    // Navigate directly to checkout with this item only (skip cart)
    router.push(`/checkout?item=${item._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink">
        <ItemDetailSkeleton />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-4">
            Item Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The item you\'re looking for doesn\'t exist.'}
          </p>
          <Link
            href="/browse"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  const price = (item.price_cents / 100).toFixed(2);
  const shipping = (item.shipping_cents / 100).toFixed(2);
  const total = ((item.price_cents + item.shipping_cents) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-nickel">
          <Link href="/" className="sap-link transition-colors duration-sap hover:text-porcelain">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/browse" className="sap-link transition-colors duration-sap hover:text-porcelain">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span className="text-porcelain">{item.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-onyx ring-1 ring-porcelain/10 cursor-zoom-in hover:ring-2 hover:ring-titanium transition-all group"
            >
              <Image
                src={item.images?.[0]?.url || 'https://placehold.co/800x800/0B0C0E/F5F6F7?text=No+Image'}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <svg className="h-6 w-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
            </button>
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {item.images.slice(1).map((img, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-onyx ring-1 ring-porcelain/10 transition hover:ring-2 hover:ring-titanium group"
                  >
                    <Image
                      src={img.url}
                      alt={`${item.title} ${idx + 2}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="150px"
                      quality={85}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-8">
              <div className="mb-2 text-sm font-medium text-nickel">{item.brand}</div>
              <h1 className="mb-6 text-3xl font-bold text-porcelain md:text-4xl text-display">
                {item.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-titanium">
                  ${price}
                </span>
                <span className="text-sm text-nickel">
                  + ${shipping} shipping
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-nickel">
                <span>{item.stats?.views || 0} views</span>
                <span>•</span>
                <span>{item.condition}</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6 rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
              <h2 className="mb-5 text-lg font-semibold text-porcelain">
                Specifications
              </h2>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-porcelain/10 pb-3">
                  <dt className="text-sm text-nickel">Condition</dt>
                  <dd className="text-sm font-medium text-porcelain">
                    {item.condition}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-porcelain/10 pb-3">
                  <dt className="text-sm text-nickel">Material</dt>
                  <dd className="text-sm font-medium text-porcelain">
                    {item.material}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-porcelain/10 pb-3">
                  <dt className="text-sm text-nickel">Color</dt>
                  <dd className="text-sm font-medium text-porcelain">
                    {item.color}
                  </dd>
                </div>
                {item.dimensions?.width_cm && (
                  <div className="flex justify-between border-b border-porcelain/10 pb-3">
                    <dt className="text-sm text-nickel">Width</dt>
                    <dd className="text-sm font-medium text-porcelain">
                      {item.dimensions.width_cm} cm
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm text-nickel">Location</dt>
                  <dd className="text-sm font-medium text-porcelain">
                    {item.location}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Seller Info */}
            <div className="mb-8 rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
              <h2 className="mb-5 text-lg font-semibold text-porcelain">Seller</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-porcelain">
                     {item.sellerId?.firstName || 'Unknown'} {item.sellerId?.lastName || 'Seller'}
                  </div>
                  <div className="text-sm text-nickel">
                    {item.sellerId?.stats?.totalSold || 0} sales
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="h-5 w-5 text-titanium"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-porcelain">
                     {(item.sellerId?.stats?.averageRating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                disabled={!item.isActive || !item.isApproved || item.isSold}
                className="w-full rounded-xl bg-porcelain text-ink px-6 py-4 text-base font-semibold shadow-soft transition-transform duration-sap hover:-translate-y-px hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {item.isSold ? 'Sold Out' : `Buy Now - $${total}`}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCartToggle}
                  disabled={isAddingToCart || isItemLoading(item._id)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-sap disabled:cursor-not-allowed ${
                    isInCart(item._id)
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40'
                      : 'bg-titanium/10 border border-titanium/20 text-titanium hover:bg-titanium/20 hover:border-titanium/40 disabled:opacity-50'
                  }`}
                >
                  {isInCart(item._id)
                    ? (isAddingToCart || isItemLoading(item._id) ? 'Removing...' : 'Remove from Cart')
                    : (isAddingToCart || isItemLoading(item._id) ? 'Adding...' : 'Add to Cart')
                  }
                </button>
                
                <button className="flex-1 rounded-xl bg-titanium/10 border border-titanium/20 px-4 py-3 text-sm font-medium text-titanium transition-all duration-sap hover:bg-titanium/20 hover:border-titanium/40">
                  Make an Offer
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-nickel">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Buyer Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>

            {/* Report Item Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-sm text-nickel hover:text-red-400 transition-colors duration-sap inline-flex items-center gap-1.5"
              >
                <Flag className="h-4 w-4" />
                Report this item
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-porcelain text-display">Description</h2>
          <p className="leading-relaxed text-nickel text-body">{item.description}</p>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && item.images && (
        <ImageLightbox
          images={item.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportModal
          itemId={item._id}
          itemTitle={item.title}
          onClose={() => setReportModalOpen(false)}
          onReported={() => {
            // Optionally refresh item or show message
            fetchItem();
          }}
        />
      )}
    </div>
  );
}


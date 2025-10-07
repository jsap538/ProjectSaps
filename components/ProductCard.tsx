"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useState } from "react";
import { Heart, HeartOff } from "lucide-react";

interface ProductCardProps {
  item: {
    _id: string;
    title: string;
    brand: string;
    price_cents: number;
    images?: string[];
    condition: string;
  };
}

export default function ProductCard({ item }: ProductCardProps) {
  const price = (item.price_cents / 100).toFixed(2);
  const { cart, addToCart, removeFromCart, isItemLoading: isCartItemLoading } = useCart();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isItemLoading: isWatchlistItemLoading } = useWatchlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);

  const isInCart = cart.some(cartItem => cartItem.itemId === item._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await addToCart(item._id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWatchlistLoading(true);
    try {
      if (isInWatchlist(item._id)) {
        await removeFromWatchlist(item._id);
      } else {
        await addToWatchlist(item._id);
      }
    } finally {
      setIsWatchlistLoading(false);
    }
  };

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      if (isInCart) {
        await removeFromCart(item._id);
      } else {
        await addToCart(item._id, 1);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="group rounded-xl bg-graphite/60 border border-white/8 shadow-subtle overflow-hidden sap-hover-lift"
    >
      <Link href={`/items/${item._id}`} className="block">
        <div className="relative aspect-[4/5] bg-ink">
          <Image
            src={item.images?.[0] || 'https://placehold.co/600x750/0B0C0E/F5F6F7?text=No+Image'}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-sap group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized
          />
          
          {/* Condition badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center rounded-sm bg-ink/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-porcelain shadow-sm">
              {item.condition}
            </span>
          </div>

          {/* Watchlist button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={handleWatchlistToggle}
              disabled={isWatchlistLoading || isWatchlistItemLoading(item._id)}
              className="rounded-full bg-ink/90 backdrop-blur-sm p-2 text-porcelain transition-all duration-sap hover:bg-ink/95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInWatchlist(item._id) ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" strokeWidth={1.75} />
              ) : (
                <HeartOff className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-1 text-sm font-medium text-nickel">
            {item.brand}
          </div>
          
          <h3 className="text-porcelain font-medium mb-2 line-clamp-2 group-hover:text-titanium transition-colors duration-sap">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-light text-porcelain">${price}</span>
            <div className="flex items-center text-sm font-medium text-nickel group-hover:text-titanium transition-colors duration-sap">
              <span className="mr-1">View</span>
              <svg className="h-4 w-4 transition-transform duration-sap group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div className="p-4 pt-0 space-y-2">
        <button
          onClick={handleCartToggle}
          disabled={isAdding || isCartItemLoading(item._id)}
          className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-sap disabled:cursor-not-allowed ${
            isInCart 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40' 
              : 'bg-titanium/10 border border-titanium/20 text-titanium hover:bg-titanium/20 hover:border-titanium/40 disabled:opacity-50'
          }`}
        >
          {isInCart 
            ? (isAdding || isCartItemLoading(item._id) ? 'Removing...' : 'Remove from Cart')
            : (isAdding || isCartItemLoading(item._id) ? 'Adding...' : 'Add to Cart')
          }
        </button>
        
        <Link href={`/items/${item._id}`}>
          <button className="w-full rounded-xl bg-porcelain text-ink px-4 py-2.5 text-sm font-semibold transition-transform duration-sap hover:-translate-y-px shadow-subtle">
            Buy Now
          </button>
        </Link>
      </div>
    </motion.article>
  );
}

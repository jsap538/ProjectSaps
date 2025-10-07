"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    </motion.article>
  );
}

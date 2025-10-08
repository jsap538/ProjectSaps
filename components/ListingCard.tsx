import Link from "next/link";
import Image from "next/image";
import type { IItemImage } from "@/types";

type Item = {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  images?: IItemImage[];
  condition: string;
};

export default function ListingCard({ item }: { item: Item }) {
  const price = (item.price_cents / 100).toFixed(2);

  return (
    <Link
      href={`/items/${item._id}`}
      className="group block bg-gray-800 border border-gray-600 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-gray-500"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-700">
        <Image
          src={item.images?.[0]?.url || 'https://placehold.co/600x750/1a2742/33CC66?text=No+Image'}
          alt={item.title}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized
        />
        
        {/* Clean condition badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-sm bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {item.condition}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2 text-sm font-medium text-gray-400">
          {item.brand}
        </div>
        
        <h3 className="text-lg font-medium text-white mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-200">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-light text-white">${price}</span>
          <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
            <span className="mr-1">View</span>
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}


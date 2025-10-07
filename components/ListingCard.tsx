import Link from "next/link";
import Image from "next/image";

type Item = {
  _id: string;
  title: string;
  brand: string;
  price_cents: number;
  images?: string[];
  condition: string;
};

export default function ListingCard({ item }: { item: Item }) {
  const price = (item.price_cents / 100).toFixed(2);

  return (
    <Link
      href={`/items/${item._id}`}
      className="group relative block overflow-hidden rounded-3xl bg-white shadow-lg shadow-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 dark:bg-[#1f2329] dark:shadow-gray-900/50"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
      
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <Image
          src={item.images?.[0] || 'https://placehold.co/600x750/1a2742/33CC66?text=No+Image'}
          alt={item.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized
        />
        
        {/* Condition Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-white/20">
            {item.condition}
          </span>
        </div>
      </div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {item.brand}
          </span>
          <div className="flex items-center">
            <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-dark dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${price}</span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            View
          </div>
        </div>
      </div>
    </Link>
  );
}


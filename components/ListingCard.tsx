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
      className="group relative block overflow-hidden rounded-2xl bg-black border border-gray-800 shadow-2xl shadow-black/50 transition-all duration-700 hover:shadow-amber-500/20 hover:-translate-y-3 hover:border-amber-400/50"
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"></div>
      
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <Image
          src={item.images?.[0] || 'https://placehold.co/600x750/1a2742/33CC66?text=No+Image'}
          alt={item.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized
        />
        
        {/* Premium condition badge */}
        <div className="absolute top-5 right-5 z-20">
          <span className="inline-flex items-center rounded-full border border-amber-400/50 bg-amber-400/10 backdrop-blur-sm px-4 py-2 text-xs font-bold text-amber-400 shadow-lg">
            {item.condition}
          </span>
        </div>

        {/* Premium brand indicator */}
        <div className="absolute top-5 left-5 z-20">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {item.brand}
          </span>
        </div>
      </div>
      
      <div className="relative p-6 bg-gradient-to-b from-black to-gray-900">
        <h3 className="text-xl font-black text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-amber-400">${price}</span>
            <span className="text-sm font-medium text-gray-400">EXCLUSIVE</span>
          </div>
          <div className="flex items-center text-amber-400 font-bold text-sm group-hover:text-yellow-300 transition-colors duration-300">
            <span className="mr-2">ACQUIRE</span>
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}


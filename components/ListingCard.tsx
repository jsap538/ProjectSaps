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
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-2xl hover:ring-primary/20 dark:bg-[#1f2329] dark:ring-gray-800"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={item.images?.[0] || 'https://placehold.co/600x750/1a2742/33CC66?text=No+Image'}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized
        />
      </div>
      <div className="p-5">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-500">
          {item.brand} • {item.condition}
        </div>
        <div className="mt-2 text-base font-semibold text-dark dark:text-white">
          {item.title}
        </div>
        <div className="mt-3 text-lg font-bold text-primary">${price}</div>
      </div>
    </Link>
  );
}


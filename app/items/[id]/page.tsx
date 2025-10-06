import Image from "next/image";
import Link from "next/link";

// Mock data - in production this would come from your database
const getItemById = (id: string) => {
  const items: any = {
    "1": {
      id: "1",
      title: "Navy Grenadine Tie",
      brand: "Drake's",
      price_cents: 6500,
      shipping_cents: 599,
      images: [
        "https://placehold.co/800x800/1a2742/33CC66?text=Navy+Grenadine+Tie",
        "https://placehold.co/800x800/2a3752/33CC66?text=Detail+View",
      ],
      condition: "Like New",
      category: "Tie",
      color: "Navy",
      material: "Silk",
      width_cm: 8,
      location: "NYC",
      description:
        "Stunning navy grenadine tie from Drake's London. Hand-rolled edges, woven in England. Classic textured grenadine weave that works for business and special occasions. Minimal wear, excellent condition.",
      seller: {
        name: "StyleCollector",
        rating: 4.9,
        sales: 47,
      },
    },
  };
  return items[id] || items["1"];
};

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = getItemById(params.id);
  const price = (item.price_cents / 100).toFixed(2);
  const shipping = (item.shipping_cents / 100).toFixed(2);
  const total = ((item.price_cents + item.shipping_cents) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/browse" className="transition hover:text-primary">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark dark:text-white">{item.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {item.images.slice(1).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 transition hover:ring-2 hover:ring-primary dark:bg-gray-900 dark:ring-gray-800"
                  >
                    <Image
                      src={img}
                      alt={`${item.title} ${idx + 2}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-8">
              <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{item.brand}</div>
              <h1 className="mb-6 text-3xl font-bold text-dark md:text-4xl dark:text-white">
                {item.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${price}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  + ${shipping} shipping
                </span>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1f2329]">
              <h2 className="mb-5 text-lg font-semibold text-dark dark:text-white">
                Specifications
              </h2>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Condition</dt>
                  <dd className="text-sm font-medium text-dark dark:text-white">
                    {item.condition}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Material</dt>
                  <dd className="text-sm font-medium text-dark dark:text-white">
                    {item.material}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Color</dt>
                  <dd className="text-sm font-medium text-dark dark:text-white">
                    {item.color}
                  </dd>
                </div>
                {item.width_cm && (
                  <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Width</dt>
                    <dd className="text-sm font-medium text-dark dark:text-white">
                      {item.width_cm} cm
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Location</dt>
                  <dd className="text-sm font-medium text-dark dark:text-white">
                    {item.location}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Seller Info */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1f2329]">
              <h2 className="mb-5 text-lg font-semibold text-dark dark:text-white">Seller</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-dark dark:text-white">{item.seller.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.seller.sales} sales
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-dark dark:text-white">
                    {item.seller.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button className="w-full rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]">
                Buy Now - ${total}
              </button>
              <button className="w-full rounded-xl border-2 border-gray-300 px-6 py-4 text-base font-semibold text-dark transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:text-white dark:hover:border-primary">
                Make an Offer
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Buyer Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">Description</h2>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">{item.description}</p>
        </div>
      </div>
    </div>
  );
}


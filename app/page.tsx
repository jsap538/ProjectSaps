import Link from "next/link";
import ListingCard from "@/components/ListingCard";

// Mock data for demonstration
const featuredItems = [
  {
    id: "1",
    title: "Navy Grenadine Tie",
    brand: "Drake's",
    price_cents: 6500,
    image: "https://placehold.co/600x750/1a2742/33CC66?text=Navy+Grenadine+Tie",
    condition: "Like New",
  },
  {
    id: "2",
    title: "Bar Stripe Repp Tie",
    brand: "Brooks Brothers",
    price_cents: 3500,
    image: "https://placehold.co/600x750/2a3752/33CC66?text=Bar+Stripe+Tie",
    condition: "Good",
  },
  {
    id: "3",
    title: "Burgundy Silk Tie",
    brand: "Tom Ford",
    price_cents: 8900,
    image: "https://placehold.co/600x750/3a1722/33CC66?text=Burgundy+Silk+Tie",
    condition: "New",
  },
  {
    id: "4",
    title: "Forest Green Knit Tie",
    brand: "Brunello Cucinelli",
    price_cents: 7200,
    image: "https://placehold.co/600x750/1a3725/33CC66?text=Green+Knit+Tie",
    condition: "Like New",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark via-dark to-dark-light text-white dark:from-[#0f1116] dark:via-[#1a1d24] dark:to-[#252932]">
        <div className="mx-auto max-w-7xl px-6 py-32 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Premium Men's
              <span className="block text-primary mt-2">Accessories</span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-gray-300 md:text-xl dark:text-gray-400">
              Discover authenticated luxury ties, cufflinks, and accessories.
              Buy from trusted sellers. Build your collection with confidence.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/browse"
                className="group rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
              >
                Browse Collection
              </Link>
              <Link
                href="/sell"
                className="rounded-xl border-2 border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-white py-20 dark:bg-[#1a1d24]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-dark md:text-4xl dark:text-white">
                Featured Listings
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Curated picks from our collection
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden text-base font-medium text-primary transition hover:text-primary-dark md:block"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
            {featuredItems.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/browse"
              className="text-base font-medium text-primary transition hover:text-primary-dark"
            >
              View all →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20 dark:bg-[#151821]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold text-dark md:text-4xl dark:text-white">
            Why SAPS
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="group rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-xl dark:bg-[#1f2329]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:scale-110 dark:bg-primary/20">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">Authenticated</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Every item verified for authenticity and condition
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-xl dark:bg-[#1f2329]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:scale-110 dark:bg-primary/20">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">Secure Payments</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Stripe-powered checkout with buyer protection
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-xl dark:bg-[#1f2329]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:scale-110 dark:bg-primary/20">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">Fast Shipping</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Tracked delivery with seller accountability
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


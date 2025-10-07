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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
                <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                Premium Marketplace
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Premium Men's
                <span className="block bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mt-2">
                  Accessories
                </span>
              </h1>
              
              <p className="mt-8 text-xl leading-8 text-slate-300">
                Discover authenticated luxury ties, cufflinks, and accessories from the world's finest brands. Quality, style, and sophistication for the modern gentleman.
              </p>
              
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/browse"
                  className="group relative rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <span className="relative z-10">Browse Collection</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-light opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
                <Link
                  href="/sell"
                  className="group rounded-xl border-2 border-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:scale-105"
                >
                  Start Selling
                </Link>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 h-32 w-32 rotate-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/20 backdrop-blur-sm"></div>
                <div className="absolute -bottom-8 -left-8 h-24 w-24 -rotate-12 rounded-2xl bg-gradient-to-br from-primary-light/20 to-primary/20 backdrop-blur-sm"></div>
                
                {/* Main Visual */}
                <div className="relative z-10 mx-auto h-96 w-80 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 p-8 shadow-2xl ring-1 ring-white/10">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 rounded bg-gradient-to-r from-primary to-primary-light"></div>
                      <div className="h-3 w-1/2 rounded bg-slate-600"></div>
                      <div className="h-3 w-2/3 rounded bg-slate-600"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24 dark:from-[#1a1d24] dark:to-[#0f1116]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Curated Collection
            </div>
            <h2 className="text-4xl font-bold text-dark md:text-5xl dark:text-white">
              Featured Listings
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Handpicked luxury accessories from trusted sellers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="group transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ListingCard item={{...item, _id: item.id}} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/browse"
              className="group inline-flex items-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              View All Items
              <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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


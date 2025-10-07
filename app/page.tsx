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
      <section className="relative bg-white">
        <div className="mx-auto max-w-6xl px-8 py-32 md:py-40">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-32">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-8 text-sm font-medium text-gray-600 tracking-wider uppercase">
                Premium Collection
              </div>
              
              <h1 className="text-5xl font-light tracking-tight md:text-6xl lg:text-7xl leading-tight text-gray-900">
                Men's
                <span className="block mt-2 text-gray-700">
                  Accessories
                </span>
              </h1>
              
              <p className="mt-8 text-lg leading-relaxed text-gray-600 max-w-lg">
                Curated selection of premium accessories. Quality craftsmanship meets modern design.
              </p>
              
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/browse"
                  className="group inline-flex items-center justify-center rounded-sm bg-gray-900 px-8 py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                >
                  Browse Collection
                  <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center rounded-sm border border-gray-300 bg-white px-8 py-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                >
                  Sell Items
                </Link>
              </div>
            </div>
            
            {/* Clean Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Simple geometric shapes */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-gray-100"></div>
                <div className="absolute bottom-0 left-0 h-24 w-24 bg-gray-200"></div>
                
                {/* Main showcase */}
                <div className="relative z-10 mx-auto h-[400px] w-[300px] bg-gray-50 border border-gray-200 p-8">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-gray-300"></div>
                      <div className="h-3 w-1/2 bg-gray-300"></div>
                      <div className="h-3 w-2/3 bg-gray-300"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-20 w-20 bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 text-sm font-medium text-gray-600 tracking-wider uppercase">
              Featured Collection
            </div>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl leading-tight text-gray-900">
              Selected Items
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              A carefully curated selection of premium accessories from trusted sellers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="group transform transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ListingCard item={{...item, _id: item.id}} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/browse"
              className="group inline-flex items-center rounded-sm bg-gray-900 px-8 py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
            >
              View All Items
              <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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


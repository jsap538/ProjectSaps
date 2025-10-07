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
      <section className="relative overflow-hidden bg-black text-white">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-900/5"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-8 inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-6 py-3 text-sm font-semibold text-amber-400 backdrop-blur-sm">
                <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
                EXCLUSIVE PREMIUM COLLECTION
              </div>
              
              <h1 className="text-6xl font-black tracking-tight md:text-7xl lg:text-8xl leading-none">
                FORGED FOR
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mt-2">
                  DOMINANCE
                </span>
              </h1>
              
              <p className="mt-10 text-xl leading-relaxed text-gray-300 font-medium max-w-2xl">
                Curated luxury accessories for men who demand excellence. From Savile Row to Wall Street, 
                every piece tells a story of power, precision, and uncompromising quality.
              </p>
              
              <div className="mt-16 flex flex-col gap-6 sm:flex-row">
                <Link
                  href="/browse"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-10 py-5 text-lg font-bold text-black shadow-2xl shadow-amber-500/25 transition-all duration-500 hover:shadow-amber-500/40 hover:scale-105 hover:from-amber-400 hover:to-amber-500"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    EXPLORE COLLECTION
                    <svg className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                </Link>
                <Link
                  href="/sell"
                  className="group rounded-lg border-2 border-gray-600 bg-transparent px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all duration-500 hover:border-amber-400 hover:bg-amber-400/5 hover:scale-105"
                >
                  JOIN THE ELITE
                </Link>
              </div>
            </div>
            
            {/* Premium Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Luxury accent elements */}
                <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-2xl"></div>
                
                {/* Main luxury showcase */}
                <div className="relative z-10 mx-auto h-[500px] w-[400px] rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-10 shadow-2xl ring-1 ring-amber-400/20">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-6">
                      <div className="h-6 w-4/5 rounded bg-gradient-to-r from-amber-400 to-yellow-300 shadow-lg"></div>
                      <div className="h-4 w-3/5 rounded bg-gray-700"></div>
                      <div className="h-4 w-2/3 rounded bg-gray-700"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-700"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 shadow-2xl shadow-amber-400/50"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-amber-400 tracking-widest">PREMIUM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-6 py-3 text-sm font-bold text-amber-400 backdrop-blur-sm">
              <span className="mr-3 h-2 w-2 rounded-full bg-amber-400"></span>
              CURATED EXCELLENCE
            </div>
            <h2 className="text-5xl font-black text-white md:text-6xl leading-tight">
              HAND-SELECTED
              <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mt-2">
                MASTERPIECES
              </span>
            </h2>
            <p className="mt-8 text-xl text-gray-300 font-medium max-w-3xl mx-auto">
              Each piece in our collection has been personally vetted for authenticity, 
              craftsmanship, and the uncompromising standards expected by men of distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ListingCard item={{...item, _id: item.id}} />
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/browse"
              className="group relative inline-flex items-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-12 py-5 text-lg font-bold text-black shadow-2xl shadow-amber-500/25 transition-all duration-500 hover:shadow-amber-500/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                EXPLORE FULL COLLECTION
                <svg className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-lg"></div>
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


import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { PrimaryButton, GhostButton, SecondaryButton } from "@/components/Buttons";
import BrandMark from "@/components/BrandMark";

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
      <section className="relative bg-ink text-porcelain">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-graphite to-ink opacity-70" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <BrandMark className="h-12 w-12 text-titanium mb-6" />
            <div className="mb-8 text-sm font-medium text-nickel tracking-wider uppercase">
              Premium Collection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-wide1 text-display">
              Quiet confidence.
              <span className="block mt-2 text-titanium">
                Crafted for performance.
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-nickel max-w-xl text-body">
              Premium accessories curated for the modern wardrobe. Precision, materials, and minimal design.
            </p>
            
            <div className="mt-8 flex gap-3">
              <Link href="/browse">
                <PrimaryButton>
                  Shop the edit
                </PrimaryButton>
              </Link>
              <Link href="/sell">
                <GhostButton>
                  View collections
                </GhostButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-graphite py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
              Featured Collection
            </div>
            <h2 className="text-4xl font-semibold tracking-wide1 md:text-5xl text-porcelain text-display">
              Selected Items
            </h2>
            <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
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
                <ProductCard item={{...item, _id: item.id}} />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/browse">
              <SecondaryButton>
                View All Items
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-onyx py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-semibold text-porcelain md:text-4xl text-display">
            Why SAPS
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
                <svg
                  className="h-8 w-8 text-titanium"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-porcelain">Authenticated</h3>
              <p className="leading-relaxed text-nickel text-body">
                Every item verified for authenticity and condition
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
                <svg
                  className="h-8 w-8 text-titanium"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-porcelain">Secure Payments</h3>
              <p className="leading-relaxed text-nickel text-body">
                Stripe-powered checkout with buyer protection
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
                <svg
                  className="h-8 w-8 text-titanium"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-porcelain">Fast Shipping</h3>
              <p className="leading-relaxed text-nickel text-body">
                Tracked delivery with seller accountability
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


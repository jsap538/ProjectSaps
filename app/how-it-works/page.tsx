import BrandMark from "@/components/BrandMark";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <BrandMark className="h-12 w-12 text-titanium mx-auto mb-6" />
          <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
            Platform Overview
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            How It Works
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            A trusted marketplace for buying and selling men's premium fashion
          </p>
        </div>

        {/* For Buyers */}
        <section className="mb-20">
          <h2 className="mb-12 text-center text-3xl font-semibold text-porcelain text-display">For Buyers</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Browse & Search</h3>
              <p className="text-nickel text-body">
                Filter by brand, condition, color, material, and price. Every listing is reviewed and photographed by sellers.
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Secure Checkout</h3>
              <p className="text-nickel text-body">
                Pay securely with Stripe. Your payment is protected until the item is delivered.
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Fast Delivery</h3>
              <p className="text-nickel text-body">
                Sellers ship within 3 business days. Track your order and receive updates.
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Buyer Protection</h3>
              <p className="text-nickel text-body">
                Items not as described? We'll make it right. Full refund policy if item doesn't match listing.
              </p>
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section className="mb-20">
          <h2 className="mb-12 text-center text-3xl font-semibold text-porcelain text-display">For Sellers</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">List Your Items</h3>
              <p className="text-nickel text-body">
                Upload photos, add details, set your price. Listings go live after approval (usually within 24 hours).
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Set Your Price</h3>
              <p className="text-nickel text-body">
                You control the price. We take 12% commission plus Stripe fees. Rest goes directly to you.
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Ship When Sold</h3>
              <p className="text-nickel text-body">
                Pack securely and ship within 3 days. Add tracking to keep buyers informed.
              </p>
            </div>

            <div className="group rounded-2xl bg-graphite/60 p-6 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-titanium/10 transition group-hover:scale-110">
                <svg className="h-6 w-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-porcelain">Get Paid</h3>
              <p className="text-nickel text-body">
                Funds transfer to your bank account after delivery confirmation. Fast, secure payouts via Stripe.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section>
          <h2 className="mb-12 text-center text-3xl font-semibold text-porcelain text-display">Trust & Safety</h2>
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 md:p-12 shadow-soft">
            <ul className="space-y-4 text-nickel text-body">
              <li className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                  <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>All listings are reviewed for accuracy and honest descriptions</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                  <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Secure payments powered by Stripe with buyer protection</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                  <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Sellers are vetted and rated by the community</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                  <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Counterfeit policy: instant ban for fraudulent listings</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-titanium/20">
                  <svg className="h-4 w-4 text-titanium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Dispute resolution available for any issues</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}


export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-6 text-4xl font-bold text-dark md:text-5xl">
          How It Works
        </h1>
        <p className="mb-16 text-xl text-gray-600">
          A trusted marketplace for men's premium accessories
        </p>

        {/* For Buyers */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-dark">For Buyers</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Browse & Search</h3>
              <p className="text-gray-600">
                Filter by brand, condition, color, material, and price. Every item is authenticated and photographed.
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Secure Checkout</h3>
              <p className="text-gray-600">
                Pay securely with Stripe. Your payment is protected until the item is delivered.
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Fast Delivery</h3>
              <p className="text-gray-600">
                Sellers ship within 3 business days. Track your order and receive updates.
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Buyer Protection</h3>
              <p className="text-gray-600">
                Items not as described? We'll make it right. Full refund policy for authenticated issues.
              </p>
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-dark">For Sellers</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos, add details, set your price. Listings go live after approval (usually within 24 hours).
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Set Your Price</h3>
              <p className="text-gray-600">
                You control the price. We take 12% commission plus Stripe fees. Rest goes directly to you.
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Ship When Sold</h3>
              <p className="text-gray-600">
                Pack securely and ship within 3 days. Add tracking to keep buyers informed.
              </p>
            </div>

            <div className="rounded-xl border border-gray-medium p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark">Get Paid</h3>
              <p className="text-gray-600">
                Funds transfer to your bank account after delivery confirmation. Fast, secure payouts via Stripe.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section>
          <h2 className="mb-8 text-3xl font-bold text-dark">Trust & Safety</h2>
          <div className="rounded-2xl bg-gray-light p-8">
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>All items are reviewed for authenticity and accurate condition grading</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Secure payments powered by Stripe with buyer protection</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Sellers are vetted and rated by the community</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Counterfeit policy: instant ban for fraudulent listings</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Dispute resolution team available for any issues</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}


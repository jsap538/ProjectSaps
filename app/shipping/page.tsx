import BrandMark from "@/components/BrandMark";
// import { PrimaryButton, GhostButton } from "@/components/Buttons";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Shipping Information
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Everything you need to know about shipping and delivery
          </p>
        </div>

        {/* Quick Info */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">Seller Ships</h3>
            <p className="text-sm text-nickel">Items ship from individual sellers</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">$5.99 Default</h3>
            <p className="text-sm text-nickel">Standard shipping cost per item</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">Tracking Included</h3>
            <p className="text-sm text-nickel">Sellers provide tracking numbers</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            {/* How Shipping Works */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">How Shipping Works</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  SAPS is a marketplace where individual sellers ship their own items directly to buyers. 
                  When you purchase an item, the seller is notified and ships the item from their location.
                </p>
                <p>
                  <strong className="text-porcelain">Shipping Timeframe:</strong> Sellers are expected 
                  to ship within 3 business days of purchase. Most items arrive within 5-10 business 
                  days total, depending on the seller's location and shipping method.
                </p>
                <p>
                  <strong className="text-porcelain">Tracking:</strong> Sellers provide tracking 
                  information when they ship. You'll receive an email notification with tracking 
                  details, and you can view it in your order dashboard.
                </p>
              </div>
            </section>

            {/* Shipping Costs */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Shipping Costs</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  Shipping costs are set by individual sellers. The default shipping cost is 
                  <strong className="text-titanium"> $5.99 per item</strong> for standard domestic shipping.
                </p>
                <p>
                  Some sellers may offer different shipping rates based on item size, weight, or 
                  destination. The exact shipping cost will be displayed at checkout before you 
                  complete your purchase.
                </p>
                <p>
                  <strong className="text-porcelain">Multiple Items:</strong> If you purchase multiple 
                  items from different sellers, each item will have its own shipping cost since they 
                  ship from different locations.
                </p>
              </div>
            </section>

            {/* International Shipping */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">International Shipping</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  International shipping availability depends on the individual seller. Check each 
                  item listing to see if the seller offers international shipping.
                </p>
                <p>
                  <strong className="text-porcelain">Customs & Duties:</strong> International buyers 
                  are responsible for any customs duties, taxes, or fees charged by their country. 
                  These costs are not included in the item price or shipping cost.
                </p>
                <p>
                  <strong className="text-porcelain">Delivery Times:</strong> International shipping 
                  typically takes 7-21 business days depending on destination, shipping method, and 
                  customs processing.
                </p>
              </div>
            </section>

            {/* Seller Responsibilities */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Seller Responsibilities</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  Sellers are responsible for packaging items securely and shipping within 3 business 
                  days. They must provide tracking information once the item ships.
                </p>
                <p>
                  <strong className="text-porcelain">Packaging:</strong> Sellers should package items 
                  appropriately to prevent damage during shipping. This includes adequate padding for 
                  fragile items and secure packaging for all items.
                </p>
                <p>
                  <strong className="text-porcelain">Insurance:</strong> Sellers are encouraged to 
                  purchase shipping insurance for high-value items to protect against loss or damage.
                </p>
              </div>
            </section>

            {/* Shipping Issues */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Shipping Issues</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  If you have issues with your order, contact us at support@saps.com with your 
                  order number and details of the problem.
                </p>
                <p>
                  <strong className="text-porcelain">Late or Missing Package:</strong> If your package 
                  is significantly delayed or hasn't arrived, we'll work with you and the seller to 
                  locate it or arrange a refund.
                </p>
                <p>
                  <strong className="text-porcelain">Damaged Item:</strong> If your item arrives 
                  damaged, take photos of the packaging and item, then contact us within 48 hours. 
                  We'll help facilitate a resolution with the seller.
                </p>
                <p>
                  <strong className="text-porcelain">Wrong Item:</strong> If you receive the wrong item, 
                  contact us immediately with photos. We'll work with the seller to correct the mistake.
                </p>
              </div>
            </section>

            {/* Need Help */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Need Help?</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  For questions about shipping, tracking, or delivery issues, contact us at 
                  <strong className="text-titanium"> support@saps.com</strong>. Include your order 
                  number for faster assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <a
                    href="mailto:support@saps.com"
                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-titanium text-ink font-medium transition-transform duration-sap hover:-translate-y-px"
                  >
                    Contact Support
                  </a>
                  <Link href="/faq">
                    <button className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-porcelain/20 text-porcelain font-medium transition-colors duration-sap hover:bg-porcelain/5">
                      View FAQ
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-nickel">
            Shipping policies may vary by seller. Check individual listings for specific shipping information.
          </p>
        </div>
      </div>
    </div>
  );
}

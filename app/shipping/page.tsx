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
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">1-3 Days</h3>
            <p className="text-sm text-nickel">Processing time</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">5-7 Days</h3>
            <p className="text-sm text-nickel">Delivery time</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">Free Over $100</h3>
            <p className="text-sm text-nickel">Free shipping threshold</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            {/* Shipping Overview */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Shipping Overview</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Processing Time:</strong> Most items ship within 
                  1-3 business days after purchase. Sellers are required to ship promptly to 
                  ensure you receive your items quickly.
                </p>
                <p>
                  <strong className="text-porcelain">Delivery Time:</strong> Standard delivery takes 
                  5-7 business days within the continental United States. International shipping 
                  times vary by destination.
                </p>
                <p>
                  <strong className="text-porcelain">Tracking:</strong> You'll receive tracking 
                  information via email once your item ships. You can also check your order 
                  status in your account dashboard.
                </p>
              </div>
            </section>

            {/* Shipping Rates */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Shipping Rates</h2>
              <div className="space-y-4 text-nickel text-body">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-porcelain/10">
                        <th className="text-left py-3 text-porcelain font-semibold">Order Value</th>
                        <th className="text-left py-3 text-porcelain font-semibold">Standard Shipping</th>
                        <th className="text-left py-3 text-porcelain font-semibold">Express Shipping</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b border-porcelain/5">
                        <td className="py-3 text-nickel">Under $50</td>
                        <td className="py-3 text-nickel">$8.99</td>
                        <td className="py-3 text-nickel">$15.99</td>
                      </tr>
                      <tr className="border-b border-porcelain/5">
                        <td className="py-3 text-nickel">$50 - $99.99</td>
                        <td className="py-3 text-nickel">$5.99</td>
                        <td className="py-3 text-nickel">$12.99</td>
                      </tr>
                      <tr className="border-b border-porcelain/5">
                        <td className="py-3 text-nickel">$100+</td>
                        <td className="py-3 text-titanium font-semibold">FREE</td>
                        <td className="py-3 text-nickel">$8.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-titanium font-medium mt-4">
                  <strong>Note:</strong> International shipping rates vary by destination and 
                  are calculated at checkout.
                </p>
              </div>
            </section>

            {/* International Shipping */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">International Shipping</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Available Countries:</strong> We ship to most 
                  countries worldwide. Check the item listing for specific shipping availability.
                </p>
                <p>
                  <strong className="text-porcelain">Customs & Duties:</strong> International orders 
                  may be subject to customs duties and taxes. These are the responsibility of 
                  the recipient and are not included in the item price or shipping cost.
                </p>
                <p>
                  <strong className="text-porcelain">Delivery Times:</strong> International shipping 
                  typically takes 7-21 business days, depending on the destination and customs 
                  processing time.
                </p>
                <p>
                  <strong className="text-porcelain">Tracking:</strong> International orders include 
                  full tracking from origin to destination.
                </p>
              </div>
            </section>

            {/* Packaging & Handling */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Packaging & Handling</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Professional Packaging:</strong> All items are 
                  carefully packaged to ensure they arrive in perfect condition. We use 
                  appropriate padding and protective materials for each item type.
                </p>
                <p>
                  <strong className="text-porcelain">Luxury Items:</strong> High-value items receive 
                  special attention with premium packaging materials and additional protection.
                </p>
                <p>
                  <strong className="text-porcelain">Fragile Items:</strong> Delicate accessories are 
                  wrapped individually and secured to prevent damage during transit.
                </p>
                <p>
                  <strong className="text-porcelain">Insurance:</strong> All shipments are insured 
                  against loss or damage during transit.
                </p>
              </div>
            </section>

            {/* Delivery Options */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Delivery Options</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Standard Shipping</h3>
                    <p className="text-nickel text-body">
                      Regular delivery service with tracking. Most cost-effective option for 
                      non-urgent purchases.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Express Shipping</h3>
                    <p className="text-nickel text-body">
                      Faster delivery for urgent purchases. Typically 2-3 business days 
                      within the continental US.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Signature Required</h3>
                    <p className="text-nickel text-body">
                      Available for high-value items. Requires signature upon delivery 
                      for added security.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Issues */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Delivery Issues</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Late Delivery:</strong> If your package is 
                  delayed, contact us immediately. We'll work with the shipping carrier to 
                  locate your package and provide updates.
                </p>
                <p>
                  <strong className="text-porcelain">Damaged Package:</strong> If your item arrives 
                  damaged, take photos of the packaging and item, then contact us within 
                  48 hours. We'll arrange for a replacement or refund.
                </p>
                <p>
                  <strong className="text-porcelain">Lost Package:</strong> If your package is lost 
                  in transit, we'll file a claim with the shipping carrier and work to 
                  resolve the issue quickly.
                </p>
                <p>
                  <strong className="text-porcelain">Wrong Address:</strong> If you provided an 
                  incorrect address, contact us immediately. We may be able to redirect 
                  the package if it hasn't been delivered yet.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Shipping Support</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  Need help with shipping or have questions about your order?
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: shipping@saps.com</li>
                  <li>Response time: 24 hours for shipping inquiries</li>
                  <li>Include your order number for faster service</li>
                  <li>We can help track packages and resolve delivery issues</li>
                </ul>
                <div className="flex gap-4 mt-6">
                  <a
                    href="mailto:shipping@saps.com"
                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-titanium text-ink font-medium transition-transform duration-sap hover:-translate-y-px"
                  >
                    Contact Shipping
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

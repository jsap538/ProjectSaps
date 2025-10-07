import BrandMark from "@/components/BrandMark";
import { PrimaryButton, GhostButton } from "@/components/Buttons";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Returns & Refunds
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Our return policy and process for a smooth experience
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
            <h3 className="text-lg font-semibold text-porcelain mb-2">48 Hours</h3>
            <p className="text-sm text-nickel">To report issues after delivery</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">Case-by-Case</h3>
            <p className="text-sm text-nickel">Returns handled individually</p>
          </div>
          
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 text-center shadow-subtle">
            <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-porcelain mb-2">3-5 Days</h3>
            <p className="text-sm text-nickel">Refund processing time</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            {/* Return Policy */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Return Policy</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">General Policy:</strong> Returns are handled on a 
                  case-by-case basis. We want you to be completely satisfied with your purchase, 
                  and we'll work with you to resolve any issues.
                </p>
                <p>
                  <strong className="text-porcelain">Timeframe:</strong> You must report any issues 
                  within 48 hours of delivery. This allows us to quickly address problems and 
                  ensure the best resolution.
                </p>
                <p>
                  <strong className="text-porcelain">Condition Requirements:</strong> Items must be 
                  returned in the same condition as received, with all original packaging and 
                  accessories included.
                </p>
              </div>
            </section>

            {/* Eligible Returns */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Eligible Returns</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">We accept returns for:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items that don't match the description or photos</li>
                  <li>Items with undisclosed damage or defects</li>
                  <li>Items that are significantly different from what was ordered</li>
                  <li>Items that arrive damaged during shipping (when properly packaged)</li>
                  <li>Authenticity issues (rare, but we take this seriously)</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Note:</strong> We may request photos or additional information to 
                  process your return request.
                </p>
              </div>
            </section>

            {/* Return Process */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Return Process</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-titanium">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Contact Support</h3>
                    <p className="text-nickel text-body">
                      Email us at returns@saps.com within 48 hours of delivery. Include your 
                      order number and detailed description of the issue.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-titanium">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Review & Approval</h3>
                    <p className="text-nickel text-body">
                      We'll review your request and may ask for photos or additional information. 
                      Most requests are approved within 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-titanium">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Return Instructions</h3>
                    <p className="text-nickel text-body">
                      We'll provide specific return instructions, including where to send the 
                      item and any special packaging requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-titanium/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-titanium">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-porcelain mb-2">Refund Processing</h3>
                    <p className="text-nickel text-body">
                      Once we receive and inspect the item, we'll process your refund within 
                      3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Costs */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Return Shipping</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Who Pays for Return Shipping:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-porcelain">SAPS covers return shipping</strong> if the item doesn't match the description, has undisclosed damage, or was damaged during shipping</li>
                  <li><strong className="text-porcelain">Buyer pays return shipping</strong> if you simply change your mind or the item doesn't fit as expected</li>
                  <li><strong className="text-porcelain">Case-by-case basis</strong> for other situations - we'll work with you to find a fair solution</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Important:</strong> Always contact us before returning an item. 
                  Unauthorized returns may not be eligible for refunds.
                </p>
              </div>
            </section>

            {/* Refund Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Refund Information</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Processing Time:</strong> Refunds are processed 
                  within 3-5 business days after we receive and inspect the returned item.
                </p>
                <p>
                  <strong className="text-porcelain">Refund Method:</strong> Refunds are issued to 
                  your original payment method. The time it takes to appear in your account 
                  depends on your bank or payment provider.
                </p>
                <p>
                  <strong className="text-porcelain">Partial Refunds:</strong> In some cases, we 
                  may issue partial refunds if the item has minor issues that don't warrant 
                  a full return.
                </p>
                <p>
                  <strong className="text-porcelain">Non-Refundable Items:</strong> Custom or 
                  personalized items, items damaged by the buyer, or items returned after 
                  the 48-hour window may not be eligible for refunds.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Need Help?</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  If you have questions about returns or need assistance:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: returns@saps.com</li>
                  <li>Response time: 24 hours for return inquiries</li>
                  <li>Include your order number for faster service</li>
                  <li>We're here to help resolve any issues</li>
                </ul>
                <div className="flex gap-4 mt-6">
                  <a
                    href="mailto:returns@saps.com"
                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-titanium text-ink font-medium transition-transform duration-sap hover:-translate-y-px"
                  >
                    Contact Returns
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
            This return policy is subject to change. Please check back periodically for updates.
          </p>
        </div>
      </div>
    </div>
  );
}

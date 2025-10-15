import BrandMark from "@/components/BrandMark";
import Link from "next/link";

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Get Help
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Have a question? Check our FAQ or reach out directly.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* FAQ Section */}
          <Link href="/faq">
            <div className="group rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft hover:shadow-medium transition-all duration-sap cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-sap">
                    <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-porcelain mb-1 text-display">
                      Browse FAQ
                    </h2>
                    <p className="text-nickel text-body">
                      Find quick answers to common questions about buying, selling, shipping, and returns.
                    </p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-titanium group-hover:translate-x-1 transition-transform duration-sap" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Email Support */}
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-titanium/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-porcelain mb-2 text-display">
                  Email Support
                </h2>
                <p className="text-nickel text-body mb-4">
                  Can't find what you're looking for? Send us an email and we'll get back to you.
                </p>
                <a 
                  href="mailto:support@encore.com"
                  className="inline-flex items-center gap-2 text-lg font-medium text-titanium hover:text-porcelain transition-colors duration-sap"
                >
                  support@encore.com
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-sm text-nickel mt-3">
                  Typical response time: 24-48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-2xl border border-porcelain/10 bg-onyx/40 p-6">
            <p className="text-sm text-nickel text-center">
              For order-specific questions, please include your order number in your email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import BrandMark from "@/components/BrandMark";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Terms & Disclaimers
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Important information about using Encore marketplace
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            {/* Platform Disclaimer */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Platform Disclaimer</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  Encore is a peer-to-peer marketplace platform that facilitates transactions between buyers and sellers. 
                  We do not own, manufacture, or directly sell the items listed on our platform. All items are sold 
                  by independent sellers who are responsible for their own listings, descriptions, and fulfillment.
                </p>
                <p>
                  <strong className="text-porcelain">We are not responsible for:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The authenticity, condition, or quality of items sold by third-party sellers</li>
                  <li>Seller behavior, shipping delays, or fulfillment issues</li>
                  <li>Disputes between buyers and sellers</li>
                  <li>Any losses or damages resulting from transactions</li>
                </ul>
              </div>
            </section>

            {/* Seller Responsibility Disclaimer */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Seller Responsibility & Item Condition</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  While we strive to provide accurate condition assessments, all items are sold "as-is" based on 
                  seller descriptions and our visual inspection. We do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>100% authenticity of luxury items (buyers should verify independently)</li>
                  <li>Exact condition matches between photos and physical items</li>
                  <li>Items are free from undisclosed defects or wear</li>
                  <li>Items will meet your specific expectations or requirements</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Important:</strong> We recommend buyers conduct their own due diligence, especially for 
                  high-value luxury items. Consider professional authentication for items over $500.
                </p>
              </div>
            </section>

            {/* Transaction Terms */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Transaction Terms</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Payment Processing:</strong> All payments are processed through 
                  secure third-party payment processors. Encore may hold funds temporarily to ensure 
                  transaction completion and dispute resolution.
                </p>
                <p>
                  <strong className="text-porcelain">Shipping & Delivery:</strong> Sellers are responsible for 
                  packaging and shipping items. Delivery times are estimates and not guaranteed. 
                  Encore is not responsible for shipping delays, lost packages, or damage during transit.
                </p>
                <p>
                  <strong className="text-porcelain">Returns & Refunds:</strong> Return policies are set by 
                  individual sellers. Encore may facilitate dispute resolution but does not guarantee 
                  refunds or returns. All sales are considered final unless otherwise specified.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">User Responsibilities</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Buyers must:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Review item descriptions, photos, and condition reports carefully</li>
                  <li>Ask questions before purchasing if uncertain about any aspect</li>
                  <li>Complete transactions promptly and provide accurate shipping information</li>
                  <li>Report any issues within 48 hours of delivery</li>
                </ul>
                <p>
                  <strong className="text-porcelain">Sellers must:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, detailed descriptions and high-quality photos</li>
                  <li>Ship items promptly and with appropriate packaging</li>
                  <li>Respond to buyer inquiries in a timely manner</li>
                  <li>Honor their stated return and refund policies</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Limitation of Liability</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  Encore's liability is limited to the fees we collect from transactions. We are not liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Direct, indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Items that are lost, stolen, or damaged during shipping</li>
                  <li>Disputes between buyers and sellers</li>
                  <li>Any amount exceeding the transaction value</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Maximum Liability:</strong> Our total liability for any claim shall not exceed 
                  the total fees collected by Encore for the specific transaction in question.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Dispute Resolution</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Resolution Process:</strong> Encore may facilitate 
                  communication between buyers and sellers to resolve disputes, but we do not guarantee 
                  outcomes or provide binding arbitration.
                </p>
                <p>
                  <strong className="text-porcelain">Escalation:</strong> For disputes involving amounts 
                  over $500, we recommend seeking professional mediation or legal counsel. Encore reserves 
                  the right to suspend accounts involved in fraudulent activity.
                </p>
                <p>
                  <strong className="text-porcelain">Governing Law:</strong> These terms are governed by 
                  the laws of [Your Jurisdiction] and any disputes will be resolved in the courts of 
                  [Your Jurisdiction].
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Contact & Support</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  For questions about these disclaimers or to report issues:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: support@encore.com</li>
                  <li>Response time: 24-48 hours for general inquiries</li>
                  <li>Urgent disputes: Include "URGENT" in subject line</li>
                  <li>Documentation: Keep records of all communications and transactions</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-nickel">
            By using Encore, you acknowledge that you have read, understood, and agree to be bound by these terms and disclaimers.
          </p>
        </div>
      </div>
    </div>
  );
}

import BrandMark from "@/components/BrandMark";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <BrandMark className="h-16 w-16 text-titanium mx-auto mb-6" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-5xl text-display">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            How we collect, use, and protect your personal information
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            {/* Information We Collect */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Information We Collect</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Account Information:</strong> When you create an account, 
                  we collect your name, email address, and profile information. This helps us provide 
                  personalized service and communicate with you about your transactions.
                </p>
                <p>
                  <strong className="text-porcelain">Transaction Data:</strong> We collect information about 
                  your purchases, sales, and payment methods to process transactions and provide customer 
                  support. This includes item details, prices, and shipping information.
                </p>
                <p>
                  <strong className="text-porcelain">Usage Information:</strong> We automatically collect 
                  information about how you use our platform, including pages visited, items viewed, 
                  and interactions with our services. This helps us improve your experience.
                </p>
                <p>
                  <strong className="text-porcelain">Device Information:</strong> We collect technical 
                  information about your device, browser, and IP address to ensure security and 
                  optimize our platform performance.
                </p>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">How We Use Your Information</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">Service Delivery:</strong> We use your information 
                  to process transactions, facilitate communication between buyers and sellers, and 
                  provide customer support.
                </p>
                <p>
                  <strong className="text-porcelain">Platform Improvement:</strong> We analyze usage 
                  patterns to improve our platform, develop new features, and enhance user experience.
                </p>
                <p>
                  <strong className="text-porcelain">Security:</strong> We use your information to 
                  verify identity, prevent fraud, and maintain the security of our platform.
                </p>
                <p>
                  <strong className="text-porcelain">Communication:</strong> We may send you updates 
                  about your account, transactions, and important platform changes. You can opt out 
                  of marketing communications at any time.
                </p>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Information Sharing</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  <strong className="text-porcelain">We do not sell your personal information.</strong> 
                  We may share your information only in the following limited circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-porcelain">Service Providers:</strong> With trusted third parties who help us operate our platform (payment processors, shipping companies, customer support tools)</li>
                  <li><strong className="text-porcelain">Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                  <li><strong className="text-porcelain">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets (with notice to users)</li>
                  <li><strong className="text-porcelain">Consent:</strong> When you explicitly consent to sharing your information</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Data Security</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-porcelain">Encryption:</strong> All data is encrypted in transit and at rest using AES-256 encryption</li>
                  <li><strong className="text-porcelain">Access Controls:</strong> Strict access controls limit who can view your information</li>
                  <li><strong className="text-porcelain">Regular Audits:</strong> We regularly audit our security practices and update our systems</li>
                  <li><strong className="text-porcelain">Secure Infrastructure:</strong> Our servers are hosted on secure, monitored platforms</li>
                </ul>
                <p className="text-titanium font-medium">
                  <strong>Important:</strong> While we take security seriously, no system is 100% secure. 
                  We recommend using strong passwords and being cautious about sharing personal information.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Your Rights</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-porcelain">Access:</strong> Request a copy of the personal information we have about you</li>
                  <li><strong className="text-porcelain">Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong className="text-porcelain">Deletion:</strong> Request deletion of your personal information (subject to legal and business requirements)</li>
                  <li><strong className="text-porcelain">Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong className="text-porcelain">Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p>
                  To exercise these rights, contact us at privacy@saps.com with your request. 
                  We will respond within 30 days.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Cookies and Tracking</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-porcelain">Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong className="text-porcelain">Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong className="text-porcelain">Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong className="text-porcelain">Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences. 
                  Note that disabling certain cookies may affect platform functionality.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Children's Privacy</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  SAPS is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If we become aware that we 
                  have collected personal information from a child under 13, we will take steps 
                  to delete such information.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with 
                  personal information, please contact us at privacy@saps.com.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-porcelain mb-6 text-display">Contact Us</h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  If you have questions about this Privacy Policy or our data practices:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: privacy@saps.com</li>
                  <li>Response time: 48 hours for privacy-related inquiries</li>
                  <li>Data Protection Officer: dpo@saps.com</li>
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
            This Privacy Policy is effective as of the date listed above and may be updated periodically.
          </p>
        </div>
      </div>
    </div>
  );
}

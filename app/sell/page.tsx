import Link from "next/link";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-8 py-16">
        <h1 className="mb-6 text-4xl font-light tracking-tight text-gray-900 md:text-5xl">
          Start Selling
        </h1>
        <p className="mb-12 text-lg text-gray-600">
          Turn your premium accessories into cash. List in minutes, sell with confidence.
        </p>

        <div className="mb-16 space-y-8">
          <div className="flex gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-gray-900 text-xl font-medium text-white">
              1
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-medium text-gray-900">
                Create Your Account
              </h2>
              <p className="text-gray-600">
                Sign up and complete your seller profile. Connect your Stripe account to receive payouts.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-gray-900 text-xl font-medium text-white">
              2
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-medium text-gray-900">
                List Your Items
              </h2>
              <p className="text-gray-600">
                Upload photos, add details, set your price. Our team reviews each listing for quality.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-gray-900 text-xl font-medium text-white">
              3
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-medium text-gray-900">
                Ship and Get Paid
              </h2>
              <p className="text-gray-600">
                When your item sells, ship within 3 days. Get paid directly to your bank account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-8 md:p-12">
          <h2 className="mb-4 text-2xl font-medium text-gray-900">Seller Terms</h2>
          <ul className="mb-8 space-y-2 text-gray-700">
            <li>• 12% commission on each sale</li>
            <li>• Stripe processing fees apply</li>
            <li>• Ship within 3 business days of sale</li>
            <li>• Provide accurate condition descriptions</li>
            <li>• Authentic items only - counterfeits will be removed</li>
          </ul>
          <div className="flex gap-4">
            <Link
              href="/sign-up"
              className="inline-block rounded-sm bg-gray-900 px-8 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Get Started
            </Link>
            <Link
              href="/sell/form"
              className="inline-block rounded-sm border border-gray-300 px-8 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              List Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


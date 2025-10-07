import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-gray-100">
      <div className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-xl font-medium text-gray-900">SAPS</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Premium men's accessories resale marketplace. Authenticated,
              trusted, refined.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-600">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/browse?category=tie"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Ties
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=cufflinks"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Cufflinks
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=belt"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Belts
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=pocket-square"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Pocket Squares
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-600">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-600">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SAPS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


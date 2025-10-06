import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#151821]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">SAPS</h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Premium men's accessories resale marketplace. Authenticated,
              trusted, refined.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/browse?category=tie"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Ties
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=cufflinks"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Cufflinks
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=belt"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Belts
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=pocket-square"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Pocket Squares
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dark dark:text-gray-400">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} SAPS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


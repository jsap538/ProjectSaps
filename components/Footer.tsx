import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-porcelain/10 bg-graphite/60">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-xl font-medium text-porcelain">SAPS</h3>
            <p className="text-sm leading-relaxed text-nickel">
              Premium men's accessories resale marketplace. Authenticated,
              trusted, refined.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-nickel">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/browse?category=tie"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Ties
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=cufflinks"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Cufflinks
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=belt"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Belts
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?category=pocket-square"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Pocket Squares
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-nickel">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-nickel">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="sap-link text-sm text-nickel transition-colors duration-sap hover:text-porcelain"
                >
                  Terms & Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-porcelain/10 pt-8 text-center">
          <p className="text-sm text-nickel">
            © {new Date().getFullYear()} SAPS. All rights reserved.{" "}
            <Link href="/disclaimer" className="text-titanium hover:text-porcelain transition-colors duration-sap">
              Terms & Disclaimers
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}


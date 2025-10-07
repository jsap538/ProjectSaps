import Link from "next/link";
import { PrimaryButton, GhostButton } from "@/components/Buttons";
import BrandMark from "@/components/BrandMark";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <BrandMark className="h-12 w-12 text-titanium mx-auto mb-6" />
          <div className="mb-6 text-sm font-medium text-nickel tracking-wider uppercase">
            Become a Seller
          </div>
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            Start Selling
          </h1>
          <p className="mt-6 text-lg text-nickel max-w-2xl mx-auto text-body">
            Turn your premium accessories into cash. List in minutes, sell with confidence.
          </p>
        </div>

        <div className="mb-16 grid gap-12 md:grid-cols-3">
          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
              <span className="text-2xl font-bold text-titanium">1</span>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-porcelain">
              Create Your Account
            </h2>
            <p className="text-nickel text-body">
              Sign up and complete your seller profile. Connect your Stripe account to receive payouts.
            </p>
          </div>

          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
              <span className="text-2xl font-bold text-titanium">2</span>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-porcelain">
              List Your Items
            </h2>
            <p className="text-nickel text-body">
              Upload photos, add details, set your price. Our team reviews each listing for quality.
            </p>
          </div>

          <div className="group rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle transition hover:shadow-soft sap-hover-lift">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-titanium/10 transition group-hover:scale-110">
              <span className="text-2xl font-bold text-titanium">3</span>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-porcelain">
              Ship and Get Paid
            </h2>
            <p className="text-nickel text-body">
              When your item sells, ship within 3 days. Get paid directly to your bank account.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 md:p-12 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-porcelain text-display">Seller Terms</h2>
          <ul className="mb-8 space-y-3 text-nickel text-body">
            <li className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-titanium"></div>
              12% commission on each sale
            </li>
            <li className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-titanium"></div>
              Stripe processing fees apply
            </li>
            <li className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-titanium"></div>
              Ship within 3 business days of sale
            </li>
            <li className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-titanium"></div>
              Provide accurate condition descriptions
            </li>
            <li className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-titanium"></div>
              Authentic items only - counterfeits will be removed
            </li>
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <PrimaryButton>
                Get Started
              </PrimaryButton>
            </Link>
            <Link href="/sell/form">
              <GhostButton>
                List Item
              </GhostButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


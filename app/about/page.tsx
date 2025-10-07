import BrandMark from "@/components/BrandMark";
import { PrimaryButton, GhostButton } from "@/components/Buttons";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Hero Section */}
        <div className="mb-24 text-center">
          <BrandMark className="h-20 w-20 text-titanium mx-auto mb-8" />
          <h1 className="text-4xl font-semibold tracking-wide1 text-porcelain md:text-6xl text-display">
            About SAPS
          </h1>
          <p className="mt-6 text-xl text-nickel max-w-3xl mx-auto text-body">
            The premier marketplace for authenticated men's luxury accessories. 
            Where quality meets sophistication.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-24">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-porcelain mb-6 text-display">
                Our Mission
              </h2>
              <p className="text-lg text-nickel mb-6 text-body">
                SAPS was founded on the principle that every man deserves access to 
                exceptional accessories without compromise. We curate a marketplace 
                where quality, authenticity, and style converge.
              </p>
              <p className="text-lg text-nickel mb-8 text-body">
                From handcrafted ties to precision cufflinks, we believe that 
                the right accessory can transform an outfit and elevate confidence. 
                Our platform ensures every piece meets our exacting standards.
              </p>
              <div className="flex gap-4">
                <Link href="/browse">
                  <PrimaryButton>
                    Explore Collection
                  </PrimaryButton>
                </Link>
                <Link href="/sell">
                  <GhostButton>
                    Start Selling
                  </GhostButton>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-graphite/60 p-8 shadow-soft">
              <div className="aspect-video bg-ink rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BrandMark className="h-16 w-16 text-titanium mx-auto mb-4" />
                  <p className="text-nickel">Video: Our Story</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-porcelain mb-6 text-display">
              Our Values
            </h2>
            <p className="text-lg text-nickel max-w-2xl mx-auto text-body">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-subtle text-center">
              <div className="w-16 h-16 bg-titanium/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-4">Authenticity</h3>
              <p className="text-nickel text-body">
                Every item is carefully verified for authenticity. We work with 
                trusted experts to ensure you receive genuine luxury accessories.
              </p>
            </div>

            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-subtle text-center">
              <div className="w-16 h-16 bg-titanium/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-4">Quality</h3>
              <p className="text-nickel text-body">
                We curate only the finest accessories from established brands. 
                Each piece represents the pinnacle of craftsmanship and design.
              </p>
            </div>

            <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-8 shadow-subtle text-center">
              <div className="w-16 h-16 bg-titanium/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-4">Community</h3>
              <p className="text-nickel text-body">
                We foster a community of discerning gentlemen who appreciate 
                fine accessories and the stories they tell.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-24">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="rounded-2xl bg-graphite/60 p-8 shadow-soft">
              <h2 className="text-3xl font-semibold text-porcelain mb-6 text-display">
                Our Story
              </h2>
              <div className="space-y-4 text-nickel text-body">
                <p>
                  SAPS was born from a simple observation: the market for men's 
                  luxury accessories was fragmented and lacked the curation that 
                  discerning gentlemen deserved.
                </p>
                <p>
                  Founded by a team of style enthusiasts and technology experts, 
                  we set out to create a platform that would bring together the 
                  finest accessories from around the world while ensuring 
                  authenticity and quality at every step.
                </p>
                <p>
                  Today, SAPS stands as the premier destination for men who 
                  understand that the right accessory can make all the difference. 
                  From boardroom presentations to special occasions, we provide 
                  the tools for confident, sophisticated style.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
                <h3 className="text-xl font-semibold text-porcelain mb-3">Founded</h3>
                <p className="text-2xl font-light text-titanium mb-2">2024</p>
                <p className="text-nickel text-body">The year SAPS was established</p>
              </div>
              <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
                <h3 className="text-xl font-semibold text-porcelain mb-3">Items Sold</h3>
                <p className="text-2xl font-light text-titanium mb-2">1,000+</p>
                <p className="text-nickel text-body">Authenticated luxury accessories</p>
              </div>
              <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
                <h3 className="text-xl font-semibold text-porcelain mb-3">Community</h3>
                <p className="text-2xl font-light text-titanium mb-2">500+</p>
                <p className="text-nickel text-body">Active buyers and sellers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-porcelain mb-6 text-display">
              Our Team
            </h2>
            <p className="text-lg text-nickel max-w-2xl mx-auto text-body">
              Passionate professionals dedicated to elevating men's style
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-24 h-24 bg-graphite/60 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BrandMark className="h-12 w-12 text-titanium" />
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-2">Style Experts</h3>
              <p className="text-nickel text-body">
                Our team includes fashion industry veterans who understand 
                the nuances of men's luxury accessories.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-graphite/60 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BrandMark className="h-12 w-12 text-titanium" />
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-2">Authentication Specialists</h3>
              <p className="text-nickel text-body">
                Trained professionals who verify the authenticity of every 
                item that passes through our platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-graphite/60 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BrandMark className="h-12 w-12 text-titanium" />
              </div>
              <h3 className="text-xl font-semibold text-porcelain mb-2">Technology Team</h3>
              <p className="text-nickel text-body">
                Engineers and designers who create the seamless experience 
                that makes SAPS a pleasure to use.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-12 shadow-soft">
            <h2 className="text-3xl font-semibold text-porcelain mb-6 text-display">
              Join the SAPS Community
            </h2>
            <p className="text-lg text-nickel mb-8 max-w-2xl mx-auto text-body">
              Whether you're looking to add to your collection or share your 
              favorite pieces with others, SAPS is your destination for 
              authentic luxury accessories.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/browse">
                <PrimaryButton>
                  Start Shopping
                </PrimaryButton>
              </Link>
              <Link href="/sell">
                <GhostButton>
                  Become a Seller
                </GhostButton>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

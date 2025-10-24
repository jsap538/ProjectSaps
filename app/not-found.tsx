import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-titanium/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-porcelain mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-porcelain mb-4">
          Page not found
        </h2>
        <p className="text-nickel mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to browsing our premium collection.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block rounded-xl bg-titanium text-ink px-6 py-3 font-medium transition-colors duration-sap hover:bg-titanium/90"
          >
            Go to homepage
          </Link>
          
          <Link
            href="/browse"
            className="inline-block rounded-xl bg-graphite/60 border border-porcelain/20 text-porcelain px-6 py-3 font-medium transition-colors duration-sap hover:bg-graphite/80 ml-4"
          >
            Browse items
          </Link>
        </div>
      </div>
    </div>
  );
}


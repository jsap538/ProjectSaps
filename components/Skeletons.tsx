export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-graphite/60 border border-white/8 shadow-subtle overflow-hidden">
      <div className="relative aspect-[4/5] bg-onyx animate-pulse" />
      
      <div className="p-4 space-y-3">
        <div className="h-4 bg-onyx rounded animate-pulse w-1/3" />
        <div className="h-5 bg-onyx rounded animate-pulse w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-onyx rounded animate-pulse w-1/4" />
          <div className="h-4 bg-onyx rounded animate-pulse w-1/5" />
        </div>
      </div>
      
      <div className="p-4 pt-0 flex gap-2">
        <div className="flex-1 h-10 bg-onyx/50 rounded-xl animate-pulse" />
        <div className="flex-1 h-10 bg-onyx/50 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export function ItemDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex gap-2">
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-12" />
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-12" />
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-onyx animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative aspect-square rounded-xl bg-onyx animate-pulse" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-onyx/50 rounded animate-pulse w-24" />
            <div className="h-8 bg-onyx/50 rounded animate-pulse w-3/4" />
            <div className="h-10 bg-onyx/50 rounded animate-pulse w-1/3" />
          </div>

          <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6">
            <div className="h-6 bg-onyx/50 rounded animate-pulse w-32 mb-5" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-onyx/50 rounded animate-pulse w-20" />
                  <div className="h-4 bg-onyx/50 rounded animate-pulse w-24" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-14 bg-onyx/50 rounded-xl animate-pulse" />
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-onyx/50 rounded-xl animate-pulse" />
              <div className="flex-1 h-12 bg-onyx/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="mt-16 space-y-4">
        <div className="h-8 bg-onyx/50 rounded animate-pulse w-40" />
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-full" />
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-4/5" />
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="block bg-gray-800 border border-gray-600 shadow-lg">
      <div className="relative aspect-[4/5] w-full bg-gray-700 animate-pulse" />
      
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3" />
        <div className="h-5 bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-700 rounded animate-pulse w-1/4" />
          <div className="h-4 bg-gray-700 rounded animate-pulse w-1/5" />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
      <div className="flex gap-6">
        <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-onyx animate-pulse" />
        
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-onyx/50 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-onyx/50 rounded animate-pulse w-1/4" />
          <div className="h-6 bg-onyx/50 rounded animate-pulse w-1/3" />
        </div>
        
        <div className="h-8 w-8 bg-onyx/50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function WatchlistItemSkeleton() {
  return (
    <div className="rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
      <div className="relative aspect-[4/5] bg-onyx mb-4 rounded-xl animate-pulse" />
      
      <div className="space-y-3">
        <div className="h-4 bg-onyx/50 rounded animate-pulse w-1/3" />
        <div className="h-5 bg-onyx/50 rounded animate-pulse w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-onyx/50 rounded animate-pulse w-1/4" />
          <div className="h-10 bg-onyx/50 rounded-xl animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="rounded-2xl bg-graphite/60 p-8 text-center shadow-subtle">
      <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-onyx/50 animate-pulse" />
      <div className="h-4 bg-onyx/50 rounded animate-pulse w-24 mx-auto mb-2" />
      <div className="h-8 bg-onyx/50 rounded animate-pulse w-16 mx-auto" />
    </div>
  );
}

export function DashboardItemSkeleton() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-onyx/50 rounded animate-pulse w-1/2" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-onyx/50 rounded animate-pulse w-20" />
            <div className="h-4 bg-onyx/50 rounded animate-pulse w-16" />
            <div className="h-6 bg-onyx/50 rounded-xl animate-pulse w-24" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 bg-onyx/50 rounded animate-pulse w-16" />
          <div className="h-8 bg-onyx/50 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}


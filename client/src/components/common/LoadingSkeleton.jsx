// ============================================================================
// The Indian Rasoi — Loading Skeletons
// Elegant dark shimmering skeletons for cards, menu grids, and banners.
// ============================================================================

export function FoodCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#161514] border border-stone-850 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] sm:aspect-[4/3] bg-stone-800/60" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-stone-800 rounded" />
          <div className="h-3 w-12 bg-stone-800 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-stone-800 rounded" />
        <div className="h-3 w-full bg-stone-850 rounded" />
        <div className="h-3 w-2/3 bg-stone-850 rounded" />
        <div className="pt-3 flex justify-between items-center">
          <div className="h-6 w-16 bg-stone-800 rounded" />
          <div className="h-8 w-8 bg-stone-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MenuGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}

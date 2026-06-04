import { Skeleton } from "@/components/ui/Skeleton";

export default function ArtistLoading() {
  return (
    <div className="pb-32">
      {/* Cover */}
      <Skeleton className="h-52 md:h-64 w-full rounded-none" />

      <div className="px-4 md:px-6 -mt-16 relative">
        <div className="flex items-end gap-4 mb-6">
          <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
          <div className="pb-1 space-y-2">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>

        <Skeleton className="h-9 w-28 rounded-xl mb-6" />
        <Skeleton className="h-16 w-full max-w-2xl rounded mb-4" />

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-5 w-32 mb-4 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 mb-1">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-1/3 rounded" />
            </div>
            <Skeleton className="h-3 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
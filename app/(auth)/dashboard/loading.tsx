import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-[#0a0a0a]/80 border-b border-white/5">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* Artistes */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Songs */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-10 h-10 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/3 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
              <Skeleton className="h-3 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
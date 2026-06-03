import { Skeleton } from "@/components/ui/Skeleton";

export default function StudioLoading() {
  return (
    <div className="pb-32">
      <div className="sticky top-0 z-30 h-14 px-4 md:px-6 flex items-center border-b border-white/5 bg-[#0a0a0a]/80">
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="px-4 md:px-6 py-6 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
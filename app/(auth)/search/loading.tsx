import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="pb-32">
      <div className="sticky top-0 z-30 h-14 px-4 md:px-6 flex items-center border-b border-white/5 bg-[#0a0a0a]/80">
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="px-4 md:px-6 py-6 space-y-6">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-1/3 rounded" />
              <Skeleton className="h-3 w-1/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
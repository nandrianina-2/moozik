import { Skeleton } from "@/components/ui/Skeleton";

export default function LibraryLoading() {
  return (
    <div className="pb-32">
      <div className="sticky top-0 z-30 h-14 px-4 md:px-6 flex items-center border-b border-white/5 bg-[#0a0a0a]/80">
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="px-4 md:px-6 py-6 space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/5 rounded" />
              <Skeleton className="h-3 w-1/4 rounded" />
            </div>
            <Skeleton className="h-3 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
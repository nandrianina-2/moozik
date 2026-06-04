import { Skeleton } from "@/components/ui/Skeleton";

export default function AlbumLoading() {
  return (
    <div className="pb-32">
      <div className="px-4 md:px-6 pt-8 pb-6">
        <div className="flex gap-5 items-end">
          <Skeleton className="w-36 h-36 md:w-44 md:h-44 rounded-xl flex-shrink-0" />
          <div className="pb-1 space-y-2 flex-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-8 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
      <div className="px-4 md:px-6 space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
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
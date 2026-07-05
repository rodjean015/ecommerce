import { Skeleton, ListSkeleton } from "@/app/component/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <ListSkeleton count={4} />
    </div>
  );
}

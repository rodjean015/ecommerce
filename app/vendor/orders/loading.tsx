import { Skeleton, ListSkeleton } from "@/app/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Skeleton className="h-7 w-24" />
      <Skeleton className="mb-6 mt-2 h-4 w-48" />
      <ListSkeleton count={4} />
    </div>
  );
}

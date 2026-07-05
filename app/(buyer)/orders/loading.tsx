import { Skeleton, ListSkeleton } from "@/app/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Skeleton className="mb-6 h-7 w-32" />
      <ListSkeleton count={3} rounded />
    </div>
  );
}

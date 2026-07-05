import { Skeleton, ProductGridSkeleton } from "@/app/component/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Skeleton className="mb-6 h-7 w-20" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  );
}

import { Skeleton } from "@/app/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-1 h-7 w-48" />
      <Skeleton className="mb-6 h-4 w-40" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
      <Skeleton className="mt-6 h-14 w-full rounded-xl" />
    </div>
  );
}

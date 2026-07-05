import { PublicHeader } from "@/app/public-header";
import { PublicFooter } from "@/app/public-footer";
import { Skeleton, ProductGridSkeleton } from "@/app/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-8">
        <Skeleton className="mb-2 h-7 w-24" />
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="mb-6 flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <ProductGridSkeleton />
      </main>
      <PublicFooter />
    </div>
  );
}

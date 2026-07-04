import { PublicHeader } from "@/app/public-header";
import { PublicFooter } from "@/app/public-footer";
import { Skeleton, ProductGridSkeleton } from "@/app/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <section className="border-b border-black/[.08] bg-white px-6 py-24 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <Skeleton className="h-12 w-3/4 max-w-md" />
          <Skeleton className="h-5 w-full max-w-lg" />
          <div className="mt-2 flex gap-3">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-8">
        <Skeleton className="mb-6 h-6 w-40" />
        <ProductGridSkeleton />
      </section>
      <PublicFooter />
    </div>
  );
}

import { PublicHeader } from "@/app/component/public-header";
import { PublicFooter } from "@/app/component/public-footer";
import { Skeleton } from "@/app/component/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-8">
        <Skeleton className="mb-6 h-4 w-24" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

import Link from "next/link";
import { requireBuyer } from "@/lib/supabase/dal";
import { signOut } from "@/app/auth/actions";
import { BuyerNav } from "@/app/(buyer)/buyer-nav";
import { SubmitButton } from "@/app/submit-button";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireBuyer();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-white/[.145] dark:bg-black/80 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-base font-semibold text-black dark:text-zinc-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
              E
            </span>
            <span className="hidden sm:inline">Ecomerce</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <BuyerNav />
            <form action={signOut}>
              <SubmitButton
                pendingText="Signing out…"
                className="text-sm font-medium text-zinc-600 underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-400"
              >
                Sign out
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-6 sm:p-8">{children}</main>
    </div>
  );
}

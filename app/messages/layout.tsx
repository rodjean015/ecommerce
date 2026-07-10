import Link from "next/link";
import { requireProfile } from "@/lib/supabase/dal";
import { signOut } from "@/app/auth/actions";
import { SubmitButton } from "@/app/component/submit-button";
import { Logo } from "@/app/component/logo";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  const homeHref = profile.role === "vendor" ? "/vendor/products" : "/shop";

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-white/[.145] dark:bg-black/80 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href={homeHref} className="flex items-center">
            <Logo height={32} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={homeHref}
              className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
            >
              Back to {profile.role === "vendor" ? "dashboard" : "shop"}
            </Link>
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
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}

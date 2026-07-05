import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/dal";
import { CartBadge } from "@/app/(buyer)/cart-badge";
import { Logo } from "@/app/component/logo";

export async function PublicHeader() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-white/[.145] dark:bg-black/80 sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo height={32} />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-black dark:text-zinc-50">
          <Link href="/products">Shop</Link>
          <Link href="/cart" aria-label="Cart" className="relative flex items-center">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4.5h2.25l1.5 12.75h10.5l1.5-9H6.375M9 21a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
            <CartBadge />
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {user ? "Sign out" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

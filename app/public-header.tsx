import Link from "next/link";
import { getAuthUser } from "@/lib/supabase/dal";
import { CartBadge } from "@/app/(buyer)/cart-badge";

export async function PublicHeader() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-white/[.145] dark:bg-black/80 sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-black dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
            E
          </span>
          Ecomerce
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-black dark:text-zinc-50">
          <Link href="/products">Shop</Link>
          <Link href="/cart">
            Cart
            <CartBadge />
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-black/[.08] px-6 py-10 dark:border-white/[.145] sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-black dark:text-zinc-50">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
            E
          </span>
          Ecomerce
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/products">Shop</Link>
          <Link href="/login">Sign in</Link>
        </nav>
        <span>© {new Date().getFullYear()} Ecomerce. All rights reserved.</span>
      </div>
    </footer>
  );
}

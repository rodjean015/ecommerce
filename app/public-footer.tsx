import Link from "next/link";
import { Logo } from "@/app/logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-black/[.08] px-6 py-10 dark:border-white/[.145] sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
        <Logo height={24} responsive={false} />
        <nav className="flex items-center gap-6">
          <Link href="/products">Shop</Link>
          <Link href="/login">Sign in</Link>
        </nav>
        <span>© {new Date().getFullYear()} CheckMeOutPH. All rights reserved.</span>
      </div>
    </footer>
  );
}

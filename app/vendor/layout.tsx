import Link from "next/link";
import { requireVendor } from "@/lib/supabase/dal";
import { signOut } from "@/app/auth/actions";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireVendor();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-black/[.08] px-8 py-4 dark:border-white/[.145]">
        <nav className="flex gap-6 text-sm font-medium text-black dark:text-zinc-50">
          <Link href="/vendor/products">Products</Link>
          <Link href="/vendor/orders">Sales</Link>
        </nav>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="flex flex-1 flex-col p-8">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "@/app/(buyer)/cart-badge";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "My orders" },
];

export function BuyerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm font-medium">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center rounded-full px-4 py-2 transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-black hover:bg-black/[.04] dark:text-zinc-50 dark:hover:bg-white/[.06]"
            }`}
          >
            {link.label}
            {link.href === "/cart" ? <CartBadge /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

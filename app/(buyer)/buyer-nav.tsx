"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "@/app/(buyer)/cart-badge";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
];

export function BuyerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 text-sm font-medium sm:gap-1">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center rounded-full px-2.5 py-1.5 transition-colors sm:px-4 sm:py-2 ${
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

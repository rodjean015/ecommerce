"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "@/app/(buyer)/cart-badge";
import { UnreadBadge } from "@/app/messages/unread-badge";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/messages", label: "Messages" },
  { href: "/orders", label: "Orders" },
  { href: "/addresses", label: "Addresses" },
];

export function BuyerNav({
  userId,
  initialUnread,
}: {
  userId: string;
  initialUnread: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5 text-sm font-medium sm:gap-1">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        const isCart = link.href === "/cart";
        const isMessages = link.href === "/messages";
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={isCart ? "Cart" : isMessages ? "Messages" : undefined}
            className={`flex items-center rounded-full px-2.5 py-1.5 transition-colors sm:px-4 sm:py-2 ${
              active
                ? "bg-foreground text-background"
                : "text-black hover:bg-black/[.04] dark:text-zinc-50 dark:hover:bg-white/[.06]"
            }`}
          >
            {isCart ? (
              <span className="relative flex items-center">
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
              </span>
            ) : isMessages ? (
              <span className="relative flex items-center">
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
                    d="M3.75 4.5h16.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H8.25L4.5 20.25V16.5h-.75a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>
                <UnreadBadge userId={userId} initialCount={initialUnread} />
              </span>
            ) : (
              link.label
            )}
          </Link>
        );
      })}
    </nav>
  );
}

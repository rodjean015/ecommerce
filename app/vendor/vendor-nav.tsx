"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UnreadBadge } from "@/app/messages/unread-badge";

const LINKS = [
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/orders", label: "Sales" },
  { href: "/messages", label: "Messages" },
  { href: "/vendor/settings", label: "Settings" },
];

export function VendorNav({
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
        const isMessages = link.href === "/messages";
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-full px-2.5 py-1.5 transition-colors sm:px-4 sm:py-2 ${
              active
                ? "bg-foreground text-background"
                : "text-black hover:bg-black/[.04] dark:text-zinc-50 dark:hover:bg-white/[.06]"
            }`}
          >
            {link.label}
            {isMessages && (
              <UnreadBadge userId={userId} initialCount={initialUnread} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

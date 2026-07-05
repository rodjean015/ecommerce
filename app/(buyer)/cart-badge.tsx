"use client";

import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

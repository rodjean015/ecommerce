"use client";

import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { count } = useCart();
  if (count === 0) return null;
  return <span className="ml-1 text-zinc-500">({count})</span>;
}

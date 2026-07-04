"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  inStock,
}: {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <span className="text-sm font-medium text-zinc-500">Out of stock</span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ productId, name, price, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      {added ? (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : null}
      {added ? "Added" : "Add to cart"}
    </button>
  );
}

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
      className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}

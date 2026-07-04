"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { checkout } from "@/app/(buyer)/cart/actions";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await checkout(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      if ("error" in result) {
        setError(result.error);
        return;
      }

      clear();
      router.push(`/orders/${result.orderId}`);
    });
  }

  if (!items.length) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Cart
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Cart
      </h1>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
          >
            <div>
              <p className="font-medium text-black dark:text-zinc-50">
                {item.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  setQuantity(item.productId, Number(e.target.value))
                }
                className="w-16 rounded-md border border-black/[.08] bg-white px-2 py-1 text-black dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50"
              />
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm font-medium text-red-600 underline dark:text-red-400"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-black/[.08] pt-4 dark:border-white/[.145]">
        <span className="text-lg font-medium text-black dark:text-zinc-50">
          Total: ${total.toFixed(2)}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleCheckout}
          className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {isPending ? "Placing order..." : "Checkout"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}

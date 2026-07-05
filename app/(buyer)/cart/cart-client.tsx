"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { checkout } from "@/app/(buyer)/cart/actions";
import { PH_REGIONS } from "@/lib/ph-locations";
import { formatPrice } from "@/lib/format";
import type { Address } from "@/lib/addresses";

const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-sm text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function CartClient({ addresses }: { addresses: Address[] }) {
  const { items, setQuantity, removeItem, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id ?? "",
  );
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const [region, setRegion] = useState(selectedAddress?.region ?? "");
  const [province, setProvince] = useState(selectedAddress?.province ?? "");
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const provinces = PH_REGIONS.find((r) => r.name === region)?.provinces ?? [];

  function handleSelectAddress(id: string) {
    setSelectedAddressId(id);
    const address = addresses.find((a) => a.id === id);
    setRegion(address?.region ?? "");
    setProvince(address?.province ?? "");
  }

  function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const phoneDigits = String(formData.get("phone_local") ?? "").replace(
      /\D/g,
      "",
    );
    const delivery = {
      recipientName: String(formData.get("recipient_name") ?? ""),
      phone: phoneDigits ? `+63${phoneDigits}` : "",
      region,
      province,
      addressLine: String(formData.get("address_line") ?? ""),
      city: String(formData.get("city") ?? ""),
      postalCode: String(formData.get("postal_code") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    startTransition(async () => {
      const result = await checkout(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        delivery
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
        <div className="flex flex-col items-center gap-3 border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-zinc-400 dark:text-zinc-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h2.25l1.5 12.75h10.5l1.5-9H6.375M9 21a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
          <p className="font-medium text-black dark:text-zinc-50">
            Your cart is empty
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Add a few products to get started.
          </p>
          <Link
            href="/shop"
            className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Browse products
          </Link>
        </div>
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
            className="flex flex-col gap-3 border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-600">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-black dark:text-zinc-50">
                  {item.name}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatPrice(item.price)} each
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 pl-[4.5rem] sm:pl-0">
              <div className="flex items-center rounded-full border border-black/[.08] dark:border-white/[.145]">
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center text-black transition-colors hover:bg-black/[.04] dark:text-zinc-50 dark:hover:bg-white/[.06]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium text-black dark:text-zinc-50">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center text-black transition-colors hover:bg-black/[.04] dark:text-zinc-50 dark:hover:bg-white/[.06]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
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

      <form onSubmit={handleCheckout} className="mt-6 flex flex-col gap-4">
        <div className="border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950">
          <h2 className="mb-4 text-base font-semibold text-black dark:text-zinc-50">
            Delivery details
          </h2>

          {addresses.length ? (
            <div className="mb-4">
              <label className={labelClasses} htmlFor="saved_address">
                Use a saved address
              </label>
              <select
                id="saved_address"
                value={selectedAddressId}
                onChange={(e) => handleSelectAddress(e.target.value)}
                className={inputClasses}
              >
                <option value="">Enter a new address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label ? `${address.label} — ` : ""}
                    {address.recipient_name}, {address.city}
                    {address.is_default ? " (default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div key={selectedAddressId} className="flex flex-col gap-4">
            <div>
              <label className={labelClasses} htmlFor="recipient_name">
                Full name
              </label>
              <input
                id="recipient_name"
                name="recipient_name"
                required
                defaultValue={selectedAddress?.recipient_name ?? ""}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="phone_local">
                Phone number
              </label>
              <div className="flex items-stretch">
                <span className="flex items-center border border-r-0 border-black/[.08] bg-black/[.02] px-3 text-sm text-zinc-600 dark:border-white/[.145] dark:bg-white/[.04] dark:text-zinc-400">
                  +63
                </span>
                <input
                  id="phone_local"
                  name="phone_local"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="9171234567"
                  required
                  defaultValue={
                    selectedAddress?.phone?.replace(/^\+63/, "") ?? ""
                  }
                  className={`${inputClasses} flex-1`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="region">
                  Region
                </label>
                <select
                  id="region"
                  name="region"
                  required
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setProvince("");
                  }}
                  className={inputClasses}
                >
                  <option value="">Select region</option>
                  {PH_REGIONS.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses} htmlFor="province">
                  Province
                </label>
                <select
                  id="province"
                  name="province"
                  required
                  disabled={!region}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">
                    {region ? "Select province" : "Select region first"}
                  </option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClasses} htmlFor="address_line">
                Address
              </label>
              <input
                id="address_line"
                name="address_line"
                required
                placeholder="House no., street, barangay"
                defaultValue={selectedAddress?.address_line ?? ""}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="city">
                  City / Municipality
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  defaultValue={selectedAddress?.city ?? ""}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="postal_code">
                  Postal code
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  defaultValue={selectedAddress?.postal_code ?? ""}
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses} htmlFor="notes">
                Delivery notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className={inputClasses}
              />
            </div>
          </div>

          <Link
            href="/addresses/new"
            className="mt-3 inline-block text-xs font-medium text-zinc-500 underline dark:text-zinc-500"
          >
            Save a new address for next time
          </Link>
        </div>

        <div className="border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950">
          <h2 className="mb-3 text-base font-semibold text-black dark:text-zinc-50">
            Payment method
          </h2>
          <label className="flex items-center gap-3 border border-black/[.08] bg-black/[.02] px-3 py-2.5 text-sm font-medium text-black dark:border-white/[.145] dark:bg-white/[.04] dark:text-zinc-50">
            <input
              type="radio"
              name="payment_method"
              value="cod"
              checked
              readOnly
              className="h-4 w-4"
            />
            Cash on Delivery (COD)
          </label>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            Pay in cash when your order arrives. This is currently the only
            payment method available.
          </p>
        </div>

        <div className="flex items-center justify-between border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950">
          <span className="text-lg font-medium text-black dark:text-zinc-50">
            Total: {formatPrice(total)}
          </span>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      ) : null}
    </div>
  );
}

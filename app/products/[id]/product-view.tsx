"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/app/(buyer)/shop/add-to-cart-button";
import { formatPrice } from "@/lib/format";

export function ProductView({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    image_urls: string[] | null;
    category: string | null;
    vendor_id: string;
    vendor_name: string;
  };
}) {
  const images = product.image_urls?.length
    ? product.image_urls
    : product.image_url
      ? [product.image_url]
      : [];
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {images.length ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[active]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {product.category ? (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {product.category}
          </span>
        ) : null}
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          {product.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sold by{" "}
          <Link href={`/store/${product.vendor_id}`} className="underline">
            {product.vendor_name}
          </Link>
        </p>
        <p className="text-xl font-medium text-black dark:text-zinc-50">
          {formatPrice(product.price)}
        </p>
        {product.description ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
        ) : null}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <div>
          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.image_url}
            inStock={product.stock > 0}
          />
        </div>
        {images.length > 1 ? (
          <div className="flex gap-2 mt-5">
            {images.map((url, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-16 w-16 shrink-0 overflow-hidden bg-zinc-100 transition-opacity dark:bg-zinc-900 ${
                  index === active
                    ? "opacity-100 ring-2 ring-black dark:ring-white"
                    : "opacity-70 hover:opacity-100 shadow-md"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

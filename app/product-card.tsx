import Link from "next/link";
import { AddToCartButton } from "@/app/(buyer)/shop/add-to-cart-button";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="animate-fade-in-up flex flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[.145] dark:bg-zinc-950"
    >
      <Link href={`/products/${product.id}`} className="flex flex-col gap-3">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
              No image
            </div>
          )}
        </div>
        <div>
          {product.category ? (
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {product.category}
            </span>
          ) : null}
          <p className="font-medium text-black dark:text-zinc-50">
            {product.name}
          </p>
          {product.description ? (
            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          ) : null}
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-medium text-black dark:text-zinc-50">
          ${product.price.toFixed(2)}
        </span>
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.image_url}
          inStock={product.stock > 0}
        />
      </div>
    </div>
  );
}

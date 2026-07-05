import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { AddToCartButton } from "@/app/(buyer)/shop/add-to-cart-button";
import { PublicHeader } from "@/app/public-header";
import { PublicFooter } from "@/app/public-footer";
import { formatPrice } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-8 py-12">
        <Link
          href="/products"
          className="mb-6 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Back to shop
        </Link>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
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
          <div className="flex flex-col gap-4">
            {product.category ? (
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {product.category}
              </span>
            ) : null}
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {product.name}
            </h1>
            <p className="text-xl font-medium text-black dark:text-zinc-50">
              {formatPrice(product.price)}
            </p>
            {product.description ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                {product.description}
              </p>
            ) : null}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
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
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

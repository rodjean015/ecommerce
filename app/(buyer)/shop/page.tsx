import { createClient } from "@/lib/supabase/server";
import { AddToCartButton } from "@/app/(buyer)/shop/add-to-cart-button";

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, price, stock, image_url")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Shop
      </h1>

      {!products?.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
            >
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-32 w-full rounded object-cover"
                />
              ) : null}
              <div>
                <p className="font-medium text-black dark:text-zinc-50">
                  {product.name}
                </p>
                {product.description ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {product.description}
                  </p>
                ) : null}
              </div>
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
          ))}
        </div>
      )}
    </div>
  );
}

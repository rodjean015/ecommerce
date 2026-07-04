import Link from "next/link";
import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/app/vendor/products/actions";

export default async function VendorProductsPage() {
  const vendor = await requireVendor();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock, image_url")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Your products
        </h1>
        <Link
          href="/vendor/products/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Add product
        </Link>
      </div>

      {!products?.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          You haven&apos;t listed any products yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
            >
              <div className="flex items-center gap-4">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-medium text-black dark:text-zinc-50">
                    {product.name}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ${product.price.toFixed(2)} · {product.stock} in stock
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/vendor/products/${product.id}/edit`}
                  className="text-sm font-medium underline text-black dark:text-zinc-50"
                >
                  Edit
                </Link>
                <form action={deleteProduct.bind(null, product.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

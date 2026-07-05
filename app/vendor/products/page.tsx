import Link from "next/link";
import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import {
  deactivateProduct,
  reactivateProduct,
} from "@/app/vendor/products/actions";
import { SubmitButton } from "@/app/submit-button";
import { formatPrice } from "@/lib/format";

export default async function VendorProductsPage() {
  const vendor = await requireVendor();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock, image_url, is_active")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  const activeCount = products?.filter((p) => p.is_active).length ?? 0;
  const inactiveCount = (products?.length ?? 0) - activeCount;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {vendor.shop_name ? (
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {vendor.shop_name}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Your products
          </h1>
          {products?.length ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {activeCount} active
              {inactiveCount > 0 ? ` · ${inactiveCount} inactive` : ""}
            </p>
          ) : null}
        </div>
        <Link
          href="/vendor/products/new"
          className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add product
        </Link>
      </div>

      {!products?.length ? (
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
              d="M3 9.75 12 4l9 5.75M4.5 10.5v9h15v-9M9.75 19.5v-6h4.5v6"
            />
          </svg>
          <p className="font-medium text-black dark:text-zinc-50">
            No products yet
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            List your first product to start selling on the marketplace.
          </p>
          <Link
            href="/vendor/products/new"
            className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add product
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className={`flex flex-col gap-3 border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between ${
                product.is_active ? "" : "opacity-60"
              }`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-600">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-black dark:text-zinc-50">
                    {product.name}
                    {!product.is_active ? (
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Inactive
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {formatPrice(product.price)} · {product.stock} in stock
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-[4.5rem] sm:pl-0">
                <Link
                  href={`/vendor/products/${product.id}/edit`}
                  className="text-sm font-medium underline text-black dark:text-zinc-50"
                >
                  Edit
                </Link>
                {product.is_active ? (
                  <form action={deactivateProduct.bind(null, product.id)}>
                    <SubmitButton
                      pendingText="Removing…"
                      className="text-sm font-medium text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                    >
                      Remove
                    </SubmitButton>
                  </form>
                ) : (
                  <form action={reactivateProduct.bind(null, product.id)}>
                    <SubmitButton
                      pendingText="Restoring…"
                      className="text-sm font-medium text-black underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-50"
                    >
                      Restore
                    </SubmitButton>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

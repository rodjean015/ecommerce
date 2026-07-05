import Link from "next/link";
import { notFound } from "next/navigation";
import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/app/vendor/products/product-form";
import {
  updateProduct,
  deactivateProduct,
  reactivateProduct,
} from "@/app/vendor/products/actions";
import { listCategories } from "@/lib/products";
import { SubmitButton } from "@/app/component/submit-button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await requireVendor();
  const supabase = await createClient();

  const [{ data: product }, categories] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, description, price, stock, image_url, category, is_active",
      )
      .eq("id", id)
      .eq("vendor_id", vendor.id)
      .maybeSingle(),
    listCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-md">
      <Link
        href="/vendor/products"
        className="mb-4 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Back to products
      </Link>
      <div className="border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950 sm:p-8">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Edit product
        </h1>
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          defaultValues={product}
          categories={categories}
          submitLabel="Save changes"
        />
        {product.is_active ? (
          <form
            action={deactivateProduct.bind(null, product.id)}
            className="mt-4"
          >
            <SubmitButton
              pendingText="Removing…"
              className="text-sm font-medium text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
            >
              Remove from shop
            </SubmitButton>
          </form>
        ) : (
          <form
            action={reactivateProduct.bind(null, product.id)}
            className="mt-4"
          >
            <SubmitButton
              pendingText="Restoring…"
              className="text-sm font-medium text-black underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-50"
            >
              Restore product
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}

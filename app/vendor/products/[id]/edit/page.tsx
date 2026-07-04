import { notFound } from "next/navigation";
import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/app/vendor/products/product-form";
import { updateProduct, deleteProduct } from "@/app/vendor/products/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await requireVendor();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price, stock, image_url")
    .eq("id", id)
    .eq("vendor_id", vendor.id)
    .maybeSingle();

  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Edit product
      </h1>
      <ProductForm
        action={updateProduct.bind(null, product.id)}
        defaultValues={product}
        submitLabel="Save changes"
      />
      <form action={deleteProduct.bind(null, product.id)} className="mt-4">
        <button
          type="submit"
          className="text-sm font-medium text-red-600 underline dark:text-red-400"
        >
          Delete product
        </button>
      </form>
    </div>
  );
}

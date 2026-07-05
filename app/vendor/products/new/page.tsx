import Link from "next/link";
import { ProductForm } from "@/app/vendor/products/product-form";
import { createProduct } from "@/app/vendor/products/actions";
import { listCategories } from "@/lib/products";

export default async function NewProductPage() {
  const categories = await listCategories();

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
          Add product
        </h1>
        <ProductForm
          action={createProduct}
          categories={categories}
          submitLabel="Create product"
        />
      </div>
    </div>
  );
}

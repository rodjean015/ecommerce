import { ProductForm } from "@/app/vendor/products/product-form";
import { createProduct } from "@/app/vendor/products/actions";
import { listCategories } from "@/lib/products";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Add product
      </h1>
      <ProductForm
        action={createProduct}
        categories={categories}
        submitLabel="Create product"
      />
    </div>
  );
}

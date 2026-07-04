import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/app/product-card";
import { ProductFilterForm } from "@/app/product-filter-form";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts({ q, category }),
    listCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Shop
      </h1>

      <ProductFilterForm
        action="/shop"
        categories={categories}
        q={q}
        category={category}
      />

      {!products.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

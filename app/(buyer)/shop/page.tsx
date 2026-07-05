import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/app/component/product-card";
import { ProductFilterForm } from "@/app/component/product-filter-form";

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
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
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
              d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm0 0 6 6M15 15l6 6"
            />
          </svg>
          <p className="font-medium text-black dark:text-zinc-50">
            No products match your search
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Try a different search term or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

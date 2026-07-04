import Link from "next/link";
import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/app/product-card";
import { ProductFilterForm } from "@/app/product-filter-form";
import { PublicHeader } from "@/app/public-header";
import { PublicFooter } from "@/app/public-footer";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts({ q, category }),
    listCategories(),
  ]);

  const isFiltered = Boolean(q || category);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Shop
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {products.length} product{products.length === 1 ? "" : "s"}
            {category ? ` in ${category}` : ""}
            {q ? ` matching “${q}”` : ""}
          </p>
        </div>

        <ProductFilterForm
          action="/products"
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
              {isFiltered ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm0 0 6 6M15 15l6 6"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75 12 4l9 5.75M4.5 10.5v9h15v-9M9.75 19.5v-6h4.5v6"
                />
              )}
            </svg>
            <p className="font-medium text-black dark:text-zinc-50">
              {isFiltered
                ? "No products match your search"
                : "No products available yet"}
            </p>
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              {isFiltered
                ? "Try a different search term or clear the filters."
                : "Check back soon — new listings show up here."}
            </p>
            {isFiltered ? (
              <Link
                href="/products"
                className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}

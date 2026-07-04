import Link from "next/link";

const inputClasses =
  "rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";

function buildHref(base: string, params: { q?: string; category?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export function ProductFilterForm({
  action,
  categories,
  q,
  category,
}: {
  action: string;
  categories: string[];
  q?: string;
  category?: string;
}) {
  const hasFilters = Boolean(q || category);

  return (
    <div className="mb-6">
      <form action={action} className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="q"
          placeholder="Search products..."
          defaultValue={q}
          className={`${inputClasses} min-w-[12rem] flex-1`}
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className={inputClasses}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Search
        </button>
      </form>

      {hasFilters ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {q ? (
            <Link
              href={buildHref(action, { category })}
              className="flex items-center gap-1 rounded-full bg-black/[.05] px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[.08] dark:bg-white/[.08] dark:text-zinc-300 dark:hover:bg-white/[.12]"
            >
              &ldquo;{q}&rdquo; ×
            </Link>
          ) : null}
          {category ? (
            <Link
              href={buildHref(action, { q })}
              className="flex items-center gap-1 rounded-full bg-black/[.05] px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[.08] dark:bg-white/[.08] dark:text-zinc-300 dark:hover:bg-white/[.12]"
            >
              {category} ×
            </Link>
          ) : null}
          <Link
            href={action}
            className="text-xs font-medium text-zinc-500 underline dark:text-zinc-400"
          >
            Clear all
          </Link>
        </div>
      ) : null}
    </div>
  );
}

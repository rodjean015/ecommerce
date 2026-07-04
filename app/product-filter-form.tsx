import Link from "next/link";

const inputClasses =
  "rounded-md border border-black/[.08] bg-white px-3 py-2 text-sm text-black dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50";

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
    <form
      action={action}
      className="mb-6 flex flex-wrap items-center gap-3"
    >
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
      {hasFilters ? (
        <Link
          href={action}
          className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}

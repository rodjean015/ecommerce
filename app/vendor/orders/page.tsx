import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export default async function VendorOrdersPage() {
  const vendor = await requireVendor();
  const supabase = await createClient();

  const { data: sales } = await supabase
    .from("order_items")
    .select("id, quantity, unit_price, created_at, products(name)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  const totalRevenue = (sales ?? []).reduce(
    (sum, sale) => sum + sale.quantity * sale.unit_price,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Sales
      </h1>
      <p className="mb-6 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {sales?.length
          ? `${sales.length} sale${sales.length === 1 ? "" : "s"} · ${formatPrice(totalRevenue)} total revenue`
          : "Your sales history will show up here."}
      </p>

      {!sales?.length ? (
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
              d="M3 4.5h2.25l1.5 12.75h10.5l1.5-9H6.375M9 21a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
          <p className="font-medium text-black dark:text-zinc-50">
            No sales yet
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Sales will show up here once buyers start checking out your
            products.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sales.map((sale) => (
            <li
              key={sale.id}
              className="flex flex-col gap-1 border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-black dark:text-zinc-50">
                  {sale.products?.[0]?.name ?? "Deleted product"}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {sale.quantity} × {formatPrice(sale.unit_price)} ·{" "}
                  {new Date(sale.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="shrink-0 font-medium text-black dark:text-zinc-50">
                {formatPrice(sale.quantity * sale.unit_price)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

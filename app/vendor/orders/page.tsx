import { requireVendor } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export default async function VendorOrdersPage() {
  const vendor = await requireVendor();
  const supabase = await createClient();

  const { data: sales } = await supabase
    .from("order_items")
    .select("id, quantity, unit_price, created_at, products(name)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Sales
      </h1>

      {!sales?.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">No sales yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sales.map((sale) => (
            <li
              key={sale.id}
              className="flex items-center justify-between rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
            >
              <div>
                <p className="font-medium text-black dark:text-zinc-50">
                  {sale.products?.[0]?.name ?? "Deleted product"}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {sale.quantity} × ${sale.unit_price.toFixed(2)} ·{" "}
                  {new Date(sale.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="font-medium text-black dark:text-zinc-50">
                ${(sale.quantity * sale.unit_price).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

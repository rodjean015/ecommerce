import Link from "next/link";
import { requireBuyer } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const buyer = await requireBuyer();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("buyer_id", buyer.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        My orders
      </h1>

      {!orders?.length ? (
        <p className="text-zinc-600 dark:text-zinc-400">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
              >
                <div>
                  <p className="font-medium text-black dark:text-zinc-50">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {order.status}
                  </p>
                </div>
                <span className="font-medium text-black dark:text-zinc-50">
                  ${order.total.toFixed(2)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

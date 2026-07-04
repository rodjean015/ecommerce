import Link from "next/link";
import { requireBuyer } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusBadge } from "@/app/(buyer)/order-status-badge";
import { formatPrice } from "@/lib/format";

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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6.172a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 19 8.828V19a2 2 0 0 1-2 2Z"
            />
          </svg>
          <p className="font-medium text-black dark:text-zinc-50">
            No orders yet
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Your order history will show up here after your first purchase.
          </p>
          <Link
            href="/shop"
            className="mt-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-black/[.08] bg-white p-4 transition-shadow hover:shadow-md dark:border-white/[.145] dark:bg-zinc-950"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium text-black dark:text-zinc-50">
                    Order #{order.id.slice(0, 8)}
                    <OrderStatusBadge status={order.status} />
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-medium text-black dark:text-zinc-50">
                  {formatPrice(order.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

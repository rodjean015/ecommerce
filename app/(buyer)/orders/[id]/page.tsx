import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBuyer } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusBadge } from "@/app/(buyer)/order-status-badge";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await requireBuyer();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("id", id)
    .eq("buyer_id", buyer.id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, quantity, unit_price, products(name)")
    .eq("order_id", order.id);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/orders"
        className="mb-4 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Back to orders
      </Link>
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Order #{order.id.slice(0, 8)}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Placed {new Date(order.created_at).toLocaleString()}
      </p>

      <ul className="flex flex-col gap-3">
        {items?.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
          >
            <span className="text-black dark:text-zinc-50">
              {item.products?.[0]?.name ?? "Deleted product"} × {item.quantity}
            </span>
            <span className="font-medium text-black dark:text-zinc-50">
              {formatPrice(item.quantity * item.unit_price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end rounded-xl border border-black/[.08] bg-white p-4 text-lg font-medium text-black dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50">
        Total: {formatPrice(order.total)}
      </div>
    </div>
  );
}

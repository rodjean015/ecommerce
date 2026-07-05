import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBuyer } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusBadge } from "@/app/(buyer)/order-status-badge";
import { cancelOrder } from "@/app/(buyer)/orders/actions";
import { SubmitButton } from "@/app/component/submit-button";
import { formatPrice } from "@/lib/format";

function unwrapEmbed<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await requireBuyer();
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, total, status, created_at, recipient_name, phone, address_line, city, postal_code, notes, payment_method",
    )
    .eq("id", id)
    .eq("buyer_id", buyer.id)
    .maybeSingle();

  if (error) {
    console.error("OrderDetailPage: orders select failed", error);
  }

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
        {items?.map((item) => {
          const product = unwrapEmbed(item.products);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
            >
              <span className="text-black dark:text-zinc-50">
                {product?.name ?? "Deleted product"} × {item.quantity}
              </span>
              <span className="font-medium text-black dark:text-zinc-50">
                {formatPrice(item.quantity * item.unit_price)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-end border border-black/[.08] bg-white p-4 text-lg font-medium text-black dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50">
        Total: {formatPrice(order.total)}
      </div>

      <div className="mt-6 border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950">
        <h2 className="mb-2 text-base font-semibold text-black dark:text-zinc-50">
          Delivery details
        </h2>
        <p className="text-sm text-black dark:text-zinc-50">
          {order.recipient_name} · {order.phone}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {order.address_line}, {order.city}
          {order.postal_code ? ` ${order.postal_code}` : ""}
        </p>
        {order.notes ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Note: {order.notes}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Payment method: Cash on Delivery
        </p>
      </div>

      {order.status === "packaging" ? (
        <form action={cancelOrder.bind(null, order.id)} className="mt-4">
          <SubmitButton
            pendingText="Cancelling…"
            className="text-sm font-medium text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
          >
            Cancel order
          </SubmitButton>
        </form>
      ) : null}
    </div>
  );
}

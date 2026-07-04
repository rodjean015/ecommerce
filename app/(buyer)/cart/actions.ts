"use server";

import { createClient } from "@/lib/supabase/server";
import { requireBuyer } from "@/lib/supabase/dal";

export async function checkout(
  items: { productId: string; quantity: number }[]
): Promise<{ orderId: string } | { error: string }> {
  await requireBuyer();

  if (!items.length) {
    return { error: "Your cart is empty" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  });

  if (error) {
    return { error: error.message };
  }

  return { orderId: data as string };
}

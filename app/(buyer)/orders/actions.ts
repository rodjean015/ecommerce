"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireBuyer } from "@/lib/supabase/dal";

export async function cancelOrder(orderId: string) {
  await requireBuyer();

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_order_status", {
    p_order_id: orderId,
    p_new_status: "cancelled",
  });

  if (error) {
    console.error("cancelOrder: rpc failed", error);
    throw new Error("Could not cancel this order. Please try again.");
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  revalidatePath("/vendor/orders");
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVendor } from "@/lib/supabase/dal";

export async function updateOrderStatus(orderId: string, status: string) {
  await requireVendor();

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_order_status", {
    p_order_id: orderId,
    p_new_status: status,
  });

  if (error) {
    console.error("updateOrderStatus: rpc failed", error);
    throw new Error("Could not update this order. Please try again.");
  }

  revalidatePath("/vendor/orders");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

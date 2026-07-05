"use server";

import { createClient } from "@/lib/supabase/server";
import { requireBuyer } from "@/lib/supabase/dal";

export type DeliveryDetails = {
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  notes?: string;
};

export async function checkout(
  items: { productId: string; quantity: number }[],
  delivery: DeliveryDetails
): Promise<{ orderId: string } | { error: string }> {
  await requireBuyer();

  if (!items.length) {
    return { error: "Your cart is empty" };
  }

  if (!delivery.recipientName.trim()) {
    return { error: "Recipient name is required" };
  }
  if (!delivery.phone.trim()) {
    return { error: "Phone number is required" };
  }
  if (!delivery.addressLine.trim()) {
    return { error: "Delivery address is required" };
  }
  if (!delivery.city.trim()) {
    return { error: "City is required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
    recipient_name: delivery.recipientName.trim(),
    phone: delivery.phone.trim(),
    address_line: delivery.addressLine.trim(),
    city: delivery.city.trim(),
    postal_code: delivery.postalCode?.trim() || null,
    notes: delivery.notes?.trim() || null,
    payment_method: "cod",
  });

  if (error) {
    return { error: error.message };
  }

  return { orderId: data as string };
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireBuyer } from "@/lib/supabase/dal";

function parseAddressInput(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const recipientName = String(formData.get("recipient_name") ?? "").trim();
  const phoneDigits = String(formData.get("phone_local") ?? "").replace(
    /\D/g,
    "",
  );
  const region = String(formData.get("region") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const addressLine = String(formData.get("address_line") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();
  const isDefault = formData.get("is_default") === "on";

  if (!recipientName) throw new Error("Recipient name is required");
  if (!phoneDigits) throw new Error("Phone number is required");
  if (!region) throw new Error("Region is required");
  if (!province) throw new Error("Province is required");
  if (!addressLine) throw new Error("Delivery address is required");
  if (!city) throw new Error("City is required");

  return {
    label: label || null,
    recipient_name: recipientName,
    phone: `+63${phoneDigits}`,
    region,
    province,
    address_line: addressLine,
    city,
    postal_code: postalCode || null,
    is_default: isDefault,
  };
}

export async function createAddress(formData: FormData) {
  const buyer = await requireBuyer();
  const input = parseAddressInput(formData);

  const supabase = await createClient();

  if (input.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("buyer_id", buyer.id);
  }

  const { error } = await supabase
    .from("addresses")
    .insert({ ...input, buyer_id: buyer.id });

  if (error) {
    console.error("createAddress: insert failed", error);
    throw new Error("Could not save this address. Please try again.");
  }

  revalidatePath("/addresses");
  revalidatePath("/cart");
  redirect("/addresses");
}

export async function updateAddress(addressId: string, formData: FormData) {
  const buyer = await requireBuyer();
  const input = parseAddressInput(formData);

  const supabase = await createClient();

  if (input.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("buyer_id", buyer.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update(input)
    .eq("id", addressId)
    .eq("buyer_id", buyer.id);

  if (error) {
    console.error("updateAddress: update failed", error);
    throw new Error("Could not save this address. Please try again.");
  }

  revalidatePath("/addresses");
  revalidatePath("/cart");
  redirect("/addresses");
}

export async function deleteAddress(addressId: string) {
  const buyer = await requireBuyer();
  const supabase = await createClient();

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("buyer_id", buyer.id);

  if (error) {
    console.error("deleteAddress: delete failed", error);
    throw new Error("Could not delete this address. Please try again.");
  }

  revalidatePath("/addresses");
  revalidatePath("/cart");
}

export async function setDefaultAddress(addressId: string) {
  const buyer = await requireBuyer();
  const supabase = await createClient();

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("buyer_id", buyer.id);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("buyer_id", buyer.id);

  if (error) {
    console.error("setDefaultAddress: update failed", error);
    throw new Error("Could not update your default address.");
  }

  revalidatePath("/addresses");
  revalidatePath("/cart");
}

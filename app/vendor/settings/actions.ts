"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVendor } from "@/lib/supabase/dal";

export async function updateVendorProfile(formData: FormData) {
  const vendor = await requireVendor();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const shopName = String(formData.get("shop_name") ?? "").trim();

  if (!fullName) throw new Error("Name is required");
  if (!shopName) throw new Error("Shop name is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, shop_name: shopName })
    .eq("id", vendor.id);

  if (error) {
    console.error("updateVendorProfile: update failed", error);
    throw new Error("Could not save your details. Please try again.");
  }

  revalidatePath("/vendor/settings");
  revalidatePath("/vendor/products");
  revalidatePath("/vendor/orders");
  revalidatePath("/products");
  revalidatePath("/shop");
  revalidatePath("/");

  redirect("/vendor/settings?saved=1");
}

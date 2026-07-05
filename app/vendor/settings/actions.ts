"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVendor } from "@/lib/supabase/dal";

const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;

function parseOptionalImage(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return null;
  if (!value.startsWith("data:image/")) throw new Error("Invalid image");
  if (value.length > MAX_IMAGE_DATA_URL_LENGTH)
    throw new Error("Image is too large");
  return value;
}

export async function updateVendorProfile(formData: FormData) {
  const vendor = await requireVendor();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const shopName = String(formData.get("shop_name") ?? "").trim();
  const logoUrl = parseOptionalImage(formData, "logo_url");
  const coverUrl = parseOptionalImage(formData, "cover_url");

  if (!fullName) throw new Error("Name is required");
  if (!shopName) throw new Error("Shop name is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      shop_name: shopName,
      logo_url: logoUrl,
      cover_url: coverUrl,
    })
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
  revalidatePath(`/store/${vendor.id}`);

  redirect("/vendor/settings?saved=1");
}

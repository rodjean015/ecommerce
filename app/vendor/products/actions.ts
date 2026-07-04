"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVendor } from "@/lib/supabase/dal";

const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;

function parseProductInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(price) || price < 0) throw new Error("Invalid price");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Invalid stock");
  if (imageUrl && !imageUrl.startsWith("data:image/"))
    throw new Error("Invalid image");
  if (imageUrl.length > MAX_IMAGE_DATA_URL_LENGTH)
    throw new Error("Image is too large");

  return {
    name,
    description: description || null,
    image_url: imageUrl || null,
    price,
    stock,
  };
}

export async function createProduct(formData: FormData) {
  const vendor = await requireVendor();
  const input = parseProductInput(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    ...input,
    vendor_id: vendor.id,
  });

  if (error) throw new Error("Could not create product");

  revalidatePath("/vendor/products");
  redirect("/vendor/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const vendor = await requireVendor();
  const input = parseProductInput(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update(input)
    .eq("id", productId)
    .eq("vendor_id", vendor.id);

  if (error) throw new Error("Could not update product");

  revalidatePath("/vendor/products");
  redirect("/vendor/products");
}

export async function deleteProduct(productId: string) {
  const vendor = await requireVendor();

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("vendor_id", vendor.id);

  if (error) throw new Error("Could not delete product");

  revalidatePath("/vendor/products");
  redirect("/vendor/products");
}

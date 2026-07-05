"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireVendor } from "@/lib/supabase/dal";

const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;
const MAX_IMAGES = 5;

function parseProductInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrls = formData
    .getAll("image_url")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(price) || price < 0) throw new Error("Invalid price");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Invalid stock");
  if (imageUrls.length > MAX_IMAGES)
    throw new Error(`You can upload up to ${MAX_IMAGES} images`);
  for (const imageUrl of imageUrls) {
    if (!imageUrl.startsWith("data:image/")) throw new Error("Invalid image");
    if (imageUrl.length > MAX_IMAGE_DATA_URL_LENGTH)
      throw new Error("Image is too large");
  }

  return {
    name,
    description: description || null,
    image_url: imageUrls[0] || null,
    image_urls: imageUrls.length ? imageUrls : null,
    category: category || null,
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

  if (error) {
    console.error("createProduct: insert failed", error);
    throw new Error("Could not create product");
  }

  revalidatePath("/vendor/products");
  revalidatePath("/products");
  revalidatePath("/");
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

  if (error) {
    console.error("updateProduct: update failed", error);
    throw new Error("Could not update product");
  }

  revalidatePath("/vendor/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/vendor/products");
}

export async function deactivateProduct(productId: string) {
  const vendor = await requireVendor();

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", productId)
    .eq("vendor_id", vendor.id);

  if (error) {
    console.error("deactivateProduct: update failed", error);
    throw new Error("Could not remove product");
  }

  revalidatePath("/vendor/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/vendor/products");
}

export async function reactivateProduct(productId: string) {
  const vendor = await requireVendor();

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: true })
    .eq("id", productId)
    .eq("vendor_id", vendor.id);

  if (error) {
    console.error("reactivateProduct: update failed", error);
    throw new Error("Could not restore product");
  }

  revalidatePath("/vendor/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/vendor/products");
}

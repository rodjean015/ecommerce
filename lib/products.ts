import { createClient } from "@/lib/supabase/server";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  vendor_name: string;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  vendor_id: string;
};

const PRODUCT_COLUMNS =
  "id, name, description, price, stock, image_url, category, vendor_id";

async function attachVendorNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: ProductRow[],
): Promise<Product[]> {
  const vendorIds = Array.from(new Set(rows.map((row) => row.vendor_id)));
  const { data: vendors } = vendorIds.length
    ? await supabase
        .from("profiles")
        .select("id, shop_name, full_name")
        .in("id", vendorIds)
    : { data: [] };

  const nameById = new Map(
    (vendors ?? []).map((v) => [v.id, v.shop_name ?? v.full_name ?? "Vendor"]),
  );

  return rows.map(({ vendor_id, ...product }) => ({
    ...product,
    vendor_name: nameById.get(vendor_id) ?? "Vendor",
  }));
}

export async function listProducts({
  q,
  category,
  limit,
}: { q?: string; category?: string; limit?: number } = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (limit) query = query.limit(limit);

  const { data } = await query;
  return attachVendorNames(supabase, data ?? []);
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return null;
  const [product] = await attachVendorNames(supabase, [data]);
  return product;
}

export async function listCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  const extra = new Set(
    (data ?? [])
      .map((row) => row.category)
      .filter((c): c is string => !!c && !PRODUCT_CATEGORIES.includes(c)),
  );

  return [...PRODUCT_CATEGORIES, ...Array.from(extra).sort()];
}

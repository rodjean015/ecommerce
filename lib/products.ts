import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
};

const PRODUCT_COLUMNS = "id, name, description, price, stock, image_url, category";

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
  return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  return data;
}

export async function listCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  const categories = new Set(
    (data ?? []).map((row) => row.category).filter((c): c is string => !!c),
  );
  return Array.from(categories).sort();
}

import { createClient } from "@/lib/supabase/server";

export type VendorProfile = {
  id: string;
  shop_name: string | null;
  full_name: string | null;
  logo_url: string | null;
  cover_url: string | null;
};

export async function getVendorProfile(
  id: string,
): Promise<VendorProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, shop_name, full_name, logo_url, cover_url")
    .eq("id", id)
    .eq("role", "vendor")
    .maybeSingle();

  return data;
}

export async function listVendors(): Promise<VendorProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, shop_name, full_name, logo_url, cover_url")
    .eq("role", "vendor")
    .order("shop_name", { ascending: true });

  return data ?? [];
}

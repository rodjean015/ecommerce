import { createClient } from "@/lib/supabase/server";

export type Address = {
  id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  region: string;
  province: string;
  address_line: string;
  city: string;
  postal_code: string | null;
  is_default: boolean;
};

const ADDRESS_COLUMNS =
  "id, label, recipient_name, phone, region, province, address_line, city, postal_code, is_default";

export async function listAddresses(buyerId: string): Promise<Address[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("addresses")
    .select(ADDRESS_COLUMNS)
    .eq("buyer_id", buyerId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAddress(
  buyerId: string,
  id: string,
): Promise<Address | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("addresses")
    .select(ADDRESS_COLUMNS)
    .eq("id", id)
    .eq("buyer_id", buyerId)
    .maybeSingle();

  return data;
}

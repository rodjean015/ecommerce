import { requireBuyer } from "@/lib/supabase/dal";
import { listAddresses } from "@/lib/addresses";
import { CartClient } from "@/app/(buyer)/cart/cart-client";

export default async function CartPage() {
  const buyer = await requireBuyer();
  const addresses = await listAddresses(buyer.id);

  return <CartClient addresses={addresses} />;
}

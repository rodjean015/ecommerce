import Link from "next/link";
import { requireProfile } from "@/lib/supabase/dal";
import { listVendors } from "@/lib/vendors";
import { listVendorCustomers } from "@/lib/chat";
import { RecipientList } from "@/app/messages/new/recipient-list";

export default async function NewMessagePage() {
  const profile = await requireProfile();

  const recipients =
    profile.role === "buyer"
      ? (await listVendors()).map((vendor) => ({
          id: vendor.id,
          name: vendor.shop_name ?? vendor.full_name ?? "Vendor",
          logoUrl: vendor.logo_url,
        }))
      : (await listVendorCustomers(profile.id)).map((buyer) => ({
          id: buyer.id,
          name: buyer.full_name ?? "Buyer",
          logoUrl: null,
        }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          New message
        </h1>
        <Link
          href="/messages"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          Cancel
        </Link>
      </div>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {profile.role === "buyer"
          ? "Choose a shop to message."
          : "Choose a customer who's ordered from you to message."}
      </p>
      <RecipientList recipients={recipients} />
    </div>
  );
}

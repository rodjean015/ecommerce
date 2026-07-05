import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBuyer } from "@/lib/supabase/dal";
import { getAddress } from "@/lib/addresses";
import { AddressForm } from "@/app/(buyer)/addresses/address-form";
import { updateAddress } from "@/app/(buyer)/addresses/actions";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await requireBuyer();
  const address = await getAddress(buyer.id, id);

  if (!address) notFound();

  return (
    <div className="mx-auto w-full max-w-md">
      <Link
        href="/addresses"
        className="mb-4 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Back to addresses
      </Link>
      <div className="border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950 sm:p-8">
        <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Edit address
        </h1>
        <AddressForm
          action={updateAddress.bind(null, address.id)}
          defaultValues={address}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import { AddressForm } from "@/app/(buyer)/addresses/address-form";
import { createAddress } from "@/app/(buyer)/addresses/actions";

export default function NewAddressPage() {
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
          Add address
        </h1>
        <AddressForm action={createAddress} submitLabel="Save address" />
      </div>
    </div>
  );
}

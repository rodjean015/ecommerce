import Link from "next/link";
import { requireBuyer } from "@/lib/supabase/dal";
import { listAddresses } from "@/lib/addresses";
import { deleteAddress, setDefaultAddress } from "@/app/(buyer)/addresses/actions";
import { SubmitButton } from "@/app/component/submit-button";

export default async function AddressesPage() {
  const buyer = await requireBuyer();
  const addresses = await listAddresses(buyer.id);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Addresses
        </h1>
        <Link
          href="/addresses/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Add address
        </Link>
      </div>

      {!addresses.length ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
          <p className="font-medium text-black dark:text-zinc-50">
            No saved addresses
          </p>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Save an address to speed up checkout next time.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col gap-2 border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-medium text-black dark:text-zinc-50">
                  {address.label || "Address"}
                  {address.is_default ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      Default
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-black dark:text-zinc-50">
                  {address.recipient_name} · {address.phone}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {address.address_line}, {address.city}, {address.province}
                  {address.postal_code ? ` ${address.postal_code}` : ""}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {address.region}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {!address.is_default ? (
                  <form action={setDefaultAddress.bind(null, address.id)}>
                    <SubmitButton
                      pendingText="Setting…"
                      className="text-sm font-medium text-black underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-50"
                    >
                      Set default
                    </SubmitButton>
                  </form>
                ) : null}
                <Link
                  href={`/addresses/${address.id}/edit`}
                  className="text-sm font-medium underline text-black dark:text-zinc-50"
                >
                  Edit
                </Link>
                <form action={deleteAddress.bind(null, address.id)}>
                  <SubmitButton
                    pendingText="Removing…"
                    className="text-sm font-medium text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

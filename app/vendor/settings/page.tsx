import { requireVendor } from "@/lib/supabase/dal";
import { updateVendorProfile } from "@/app/vendor/settings/actions";
import { SubmitButton } from "@/app/component/submit-button";

const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default async function VendorSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const vendor = await requireVendor();
  const { saved } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Shop settings
      </h1>

      {saved ? (
        <div className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          Your details have been saved.
        </div>
      ) : null}

      <div className="border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950 sm:p-8">
        <form action={updateVendorProfile} className="flex flex-col gap-4">
          <div>
            <label className={labelClasses} htmlFor="full_name">
              Your name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              defaultValue={vendor.full_name ?? ""}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses} htmlFor="shop_name">
              Shop name
            </label>
            <input
              id="shop_name"
              name="shop_name"
              required
              defaultValue={vendor.shop_name ?? ""}
              className={inputClasses}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Shown to buyers on your product listings.
            </p>
          </div>
          <SubmitButton
            pendingText="Saving…"
            className="mt-2 h-12 rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            Save changes
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

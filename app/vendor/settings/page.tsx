import Link from "next/link";
import { requireVendor } from "@/lib/supabase/dal";
import { SettingsForm } from "@/app/vendor/settings/settings-form";

export default async function VendorSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const vendor = await requireVendor();
  const { saved } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Shop settings
        </h1>
        <Link
          href={`/store/${vendor.id}`}
          target="_blank"
          className="text-sm font-medium text-black underline dark:text-zinc-50"
        >
          Visit your shop
        </Link>
      </div>

      {saved ? (
        <div className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          Your details have been saved.
        </div>
      ) : null}

      <div className="border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950 sm:p-8">
        <SettingsForm
          defaultValues={{
            full_name: vendor.full_name,
            shop_name: vendor.shop_name,
            logo_url: vendor.logo_url,
            cover_url: vendor.cover_url,
          }}
        />
      </div>
    </div>
  );
}

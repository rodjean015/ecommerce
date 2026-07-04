import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";
import { chooseRole } from "@/app/onboarding/actions";

export default async function OnboardingPage() {
  const profile = await getProfile();
  if (profile) {
    redirect(profile.role === "vendor" ? "/vendor/products" : "/shop");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-black/[.08] bg-white p-8 text-center dark:border-white/[.145] dark:bg-zinc-950">
        <h1 className="mb-2 text-2xl font-semibold text-black dark:text-zinc-50">
          How will you use this store?
        </h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          You can&apos;t change this later, so pick the one that fits.
        </p>
        <div className="flex flex-col gap-3">
          <form
            action={async () => {
              "use server";
              await chooseRole("buyer");
            }}
          >
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              I want to buy
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await chooseRole("vendor");
            }}
          >
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full border border-black/[.08] px-5 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
            >
              I want to sell
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

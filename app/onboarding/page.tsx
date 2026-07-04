import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";
import { chooseRole } from "@/app/onboarding/actions";
import { SubmitButton } from "@/app/submit-button";

const cardClasses =
  "flex h-full flex-col items-center gap-3 rounded-xl border border-black/[.08] bg-white p-6 text-center transition-colors hover:border-black/[.2] hover:bg-black/[.02] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.3] dark:hover:bg-white/[.03]";

export default async function OnboardingPage() {
  const profile = await getProfile();
  if (profile) {
    redirect(profile.role === "vendor" ? "/vendor/products" : "/shop");
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-6 py-16 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(23,23,23,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]"
      />

      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
          E
        </span>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            How will you use this store?
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You can&apos;t change this later, so pick the one that fits.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <form
            action={async () => {
              "use server";
              await chooseRole("buyer");
            }}
          >
            <SubmitButton
              pendingText="Setting up…"
              className={`${cardClasses} w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-black dark:text-zinc-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4.5h2.25l1.5 12.75h10.5l1.5-9H6.375M9 21a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
              <span className="text-base font-semibold text-black dark:text-zinc-50">
                I want to buy
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Browse the catalog and check out from independent vendors.
              </span>
            </SubmitButton>
          </form>

          <form
            action={async () => {
              "use server";
              await chooseRole("vendor");
            }}
          >
            <SubmitButton
              pendingText="Setting up…"
              className={`${cardClasses} w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-black dark:text-zinc-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75 12 4l9 5.75M4.5 10.5v9h15v-9M9.75 19.5v-6h4.5v6"
                />
              </svg>
              <span className="text-base font-semibold text-black dark:text-zinc-50">
                I want to sell
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                List products and manage orders as a vendor.
              </span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}

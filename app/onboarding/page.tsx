import { redirect } from "next/navigation";
import { getProfile, getAuthUser } from "@/lib/supabase/dal";
import { OnboardingForm } from "@/app/onboarding/onboarding-form";
import { Logo } from "@/app/logo";

export default async function OnboardingPage() {
  const profile = await getProfile();
  if (profile) {
    redirect(profile.role === "vendor" ? "/vendor/products" : "/shop");
  }

  const user = await getAuthUser();
  const defaultFullName =
    (user?.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-6 py-16 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(23,23,23,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]"
      />

      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <Logo height={40} responsive={false} />

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            How will you use this store?
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You can&apos;t change this later, so pick the one that fits.
          </p>
        </div>

        <OnboardingForm defaultFullName={defaultFullName} />
      </div>
    </div>
  );
}

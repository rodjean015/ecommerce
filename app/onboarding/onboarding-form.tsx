"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/onboarding/actions";
import { SubmitButton } from "@/app/submit-button";

const cardClasses =
  "flex h-full flex-col items-center gap-3 rounded-xl border border-black/[.08] bg-white p-6 text-center transition-colors hover:border-black/[.2] hover:bg-black/[.02] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.3] dark:hover:bg-white/[.03]";
const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

type Role = "buyer" | "vendor";

export function OnboardingForm({
  defaultFullName,
}: {
  defaultFullName: string;
}) {
  const [role, setRole] = useState<Role | null>(null);

  if (!role) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setRole("buyer")}
          className={`${cardClasses} w-full`}
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
        </button>

        <button
          type="button"
          onClick={() => setRole("vendor")}
          className={`${cardClasses} w-full`}
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
        </button>
      </div>
    );
  }

  return (
    <form
      action={completeOnboarding}
      className="w-full max-w-sm rounded-xl border border-black/[.08] bg-white p-6 text-left dark:border-white/[.145] dark:bg-zinc-950"
    >
      <input type="hidden" name="role" value={role} />

      <div className="mb-4">
        <label className={labelClasses} htmlFor="full_name">
          Your name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          autoFocus
          defaultValue={defaultFullName}
          placeholder="Jane Doe"
          className={inputClasses}
        />
      </div>

      {role === "vendor" ? (
        <div className="mb-4">
          <label className={labelClasses} htmlFor="shop_name">
            Shop name
          </label>
          <input
            id="shop_name"
            name="shop_name"
            required
            placeholder="Jane's Ceramics"
            className={inputClasses}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setRole(null)}
          className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Back
        </button>
        <SubmitButton
          pendingText="Setting up…"
          className="ml-auto rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          Continue
        </SubmitButton>
      </div>
    </form>
  );
}

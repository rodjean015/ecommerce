"use client";

import { useState } from "react";
import { PH_REGIONS } from "@/lib/ph-locations";
import { SubmitButton } from "@/app/component/submit-button";
import type { Address } from "@/lib/addresses";

const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function AddressForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Address;
  submitLabel: string;
}) {
  const [region, setRegion] = useState(defaultValues?.region ?? "");
  const [province, setProvince] = useState(defaultValues?.province ?? "");
  const provinces = PH_REGIONS.find((r) => r.name === region)?.provinces ?? [];
  const phoneLocal = defaultValues?.phone?.replace(/^\+63/, "") ?? "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className={labelClasses} htmlFor="label">
          Label (optional)
        </label>
        <input
          id="label"
          name="label"
          placeholder="Home, Office, etc."
          defaultValue={defaultValues?.label ?? ""}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses} htmlFor="recipient_name">
          Full name
        </label>
        <input
          id="recipient_name"
          name="recipient_name"
          required
          defaultValue={defaultValues?.recipient_name ?? ""}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses} htmlFor="phone_local">
          Phone number
        </label>
        <div className="flex items-stretch">
          <span className="flex items-center border border-r-0 border-black/[.08] bg-black/[.02] px-3 text-sm text-zinc-600 dark:border-white/[.145] dark:bg-white/[.04] dark:text-zinc-400">
            +63
          </span>
          <input
            id="phone_local"
            name="phone_local"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="9171234567"
            required
            defaultValue={phoneLocal}
            className={`${inputClasses} flex-1`}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="region">
            Region
          </label>
          <select
            id="region"
            name="region"
            required
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setProvince("");
            }}
            className={inputClasses}
          >
            <option value="">Select region</option>
            {PH_REGIONS.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="province">
            Province
          </label>
          <select
            id="province"
            name="province"
            required
            disabled={!region}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className={inputClasses}
          >
            <option value="">
              {region ? "Select province" : "Select region first"}
            </option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClasses} htmlFor="address_line">
          Address
        </label>
        <input
          id="address_line"
          name="address_line"
          required
          placeholder="House no., street, barangay"
          defaultValue={defaultValues?.address_line ?? ""}
          className={inputClasses}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="city">
            City / Municipality
          </label>
          <input
            id="city"
            name="city"
            required
            defaultValue={defaultValues?.city ?? ""}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="postal_code">
            Postal code
          </label>
          <input
            id="postal_code"
            name="postal_code"
            defaultValue={defaultValues?.postal_code ?? ""}
            className={inputClasses}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="is_default"
          defaultChecked={defaultValues?.is_default ?? false}
          className="h-4 w-4"
        />
        Set as default address
      </label>
      <SubmitButton
        pendingText="Saving…"
        className="mt-2 h-12 rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

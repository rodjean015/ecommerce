"use client";

import { useState } from "react";
import { compressImageToDataUrl } from "@/lib/image";
import { updateVendorProfile } from "@/app/vendor/settings/actions";
import { SubmitButton } from "@/app/component/submit-button";

const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

function ImageDropzone({
  id,
  label,
  hint,
  defaultValue,
  previewClassName,
}: {
  id: string;
  label: string;
  hint: string;
  defaultValue: string | null;
  previewClassName: string;
}) {
  const [dataUrl, setDataUrl] = useState(defaultValue ?? "");
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError(null);
    setCompressing(true);
    try {
      const url = await compressImageToDataUrl(file);
      setDataUrl(url);
    } catch {
      setError("Could not process that image. Try a different file.");
    } finally {
      setCompressing(false);
    }
  }

  return (
    <div>
      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void processFile(file);
        }}
        className={`border border-dashed p-3 transition-colors ${
          isDragging
            ? "border-black/40 bg-black/[.02] dark:border-white/40 dark:bg-white/[.04]"
            : "border-black/[.15] dark:border-white/[.2]"
        }`}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void processFile(file);
          }}
          className="w-full text-sm text-black dark:text-zinc-50"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          {hint}
        </p>
      </div>
      <input type="hidden" name={id} value={dataUrl} />
      {compressing ? (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Compressing image…
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`${label} preview`}
          className={`mt-2 object-cover ${previewClassName}`}
        />
      ) : null}
    </div>
  );
}

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: {
    full_name: string | null;
    shop_name: string | null;
    logo_url: string | null;
    cover_url: string | null;
  };
}) {
  return (
    <form action={updateVendorProfile} className="flex flex-col gap-4">
      <div>
        <label className={labelClasses} htmlFor="full_name">
          Your name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultValues.full_name ?? ""}
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
          defaultValue={defaultValues.shop_name ?? ""}
          className={inputClasses}
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Shown to buyers on your product listings.
        </p>
      </div>
      <ImageDropzone
        id="logo_url"
        label="Shop logo"
        hint="Square image works best"
        defaultValue={defaultValues.logo_url}
        previewClassName="h-20 w-20 rounded-full"
      />
      <ImageDropzone
        id="cover_url"
        label="Cover photo"
        hint="Wide banner shown at the top of your shop page"
        defaultValue={defaultValues.cover_url}
        previewClassName="h-32 w-full"
      />
      <SubmitButton
        pendingText="Saving…"
        className="mt-2 h-12 rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        Save changes
      </SubmitButton>
    </form>
  );
}

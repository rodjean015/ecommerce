"use client";

import { useState } from "react";
import { compressImageToDataUrl } from "@/lib/image";

const inputClasses =
  "w-full rounded-md border border-black/[.08] bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
  };
  submitLabel: string;
}) {
  const [imageDataUrl, setImageDataUrl] = useState(
    defaultValues?.image_url ?? "",
  );
  const [compressing, setCompressing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setCompressing(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setImageDataUrl(dataUrl);
    } catch {
      setImageError("Could not process that image. Try a different file.");
    } finally {
      setCompressing(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className={labelClasses} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className={inputClasses}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.price}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={defaultValues?.stock}
            className={inputClasses}
          />
        </div>
      </div>
      <div>
        <label className={labelClasses} htmlFor="image">
          Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={inputClasses}
        />
        <input type="hidden" name="image_url" value={imageDataUrl} />
        {compressing ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Compressing image…
          </p>
        ) : null}
        {imageError ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {imageError}
          </p>
        ) : null}
        {imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageDataUrl}
            alt="Product preview"
            className="mt-2 h-24 w-24 rounded object-cover"
          />
        ) : null}
      </div>
      <button
        type="submit"
        disabled={compressing}
        className="mt-2 h-12 rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {submitLabel}
      </button>
    </form>
  );
}

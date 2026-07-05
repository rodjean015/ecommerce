"use client";

import { useState } from "react";
import { compressImageToDataUrl } from "@/lib/image";
import { SubmitButton } from "@/app/component/submit-button";

const inputClasses =
  "w-full border border-black/[.08] bg-white px-3 py-2 text-black transition-colors focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/30 dark:focus:ring-white/20";
const labelClasses =
  "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const MAX_IMAGES = 5;

export function ProductForm({
  action,
  defaultValues,
  categories = [],
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    image_urls?: string[] | null;
    category: string | null;
  };
  categories?: string[];
  submitLabel: string;
}) {
  const [imageDataUrls, setImageDataUrls] = useState<string[]>(
    defaultValues?.image_urls?.length
      ? defaultValues.image_urls
      : defaultValues?.image_url
        ? [defaultValues.image_url]
        : [],
  );
  const [compressing, setCompressing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const allCategories =
    defaultValues?.category && !categories.includes(defaultValues.category)
      ? [...categories, defaultValues.category]
      : categories;

  async function processImageFiles(files: File[]) {
    const room = MAX_IMAGES - imageDataUrls.length;
    if (room <= 0) {
      setImageError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const [toAdd, overflow] = [files.slice(0, room), files.slice(room)];

    const nonImage = toAdd.find((file) => !file.type.startsWith("image/"));
    if (nonImage) {
      setImageError("Please choose image files only.");
      return;
    }

    setImageError(
      overflow.length ? `You can upload up to ${MAX_IMAGES} images.` : null,
    );
    setCompressing(true);
    try {
      const dataUrls = await Promise.all(
        toAdd.map((file) => compressImageToDataUrl(file)),
      );
      setImageDataUrls((prev) => [...prev, ...dataUrls]);
    } catch {
      setImageError("Could not process that image. Try a different file.");
    } finally {
      setCompressing(false);
    }
  }

  function removeImage(index: number) {
    setImageDataUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    await processImageFiles(files);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (!files.length) return;
    await processImageFiles(files);
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
      <div>
        <label className={labelClasses} htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? ""}
          className={inputClasses}
        >
          <option value="">No category</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses} htmlFor="price">
            Price (PHP)
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
          Images ({imageDataUrls.length}/{MAX_IMAGES})
        </label>
        {imageDataUrls.length < MAX_IMAGES ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed p-3 transition-colors ${
              isDragging
                ? "border-black/40 bg-black/[.02] dark:border-white/40 dark:bg-white/[.04]"
                : "border-black/[.15] dark:border-white/[.2]"
            }`}
          >
            <input
              id="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-black dark:text-zinc-50"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Or drag up to {MAX_IMAGES - imageDataUrls.length} more image
              {MAX_IMAGES - imageDataUrls.length === 1 ? "" : "s"} here
            </p>
          </div>
        ) : null}
        {imageDataUrls.map((url, index) => (
          <input key={index} type="hidden" name="image_url" value={url} />
        ))}
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
        {imageDataUrls.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {imageDataUrls.map((url, index) => (
              <div key={index} className="group relative h-24 w-24 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Product preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white hover:bg-black dark:bg-white/80 dark:text-black dark:hover:bg-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <SubmitButton
        disabled={compressing}
        pendingText={submitLabel}
        className="mt-2 h-12 rounded-full bg-foreground px-5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

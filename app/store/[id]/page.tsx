import { notFound } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";
import { getVendorProfile } from "@/lib/vendors";
import { listProducts } from "@/lib/products";
import { createConversation } from "@/app/messages/actions";
import { ProductCard } from "@/app/component/product-card";
import { PublicHeader } from "@/app/component/public-header";
import { PublicFooter } from "@/app/component/public-footer";
import { SubmitButton } from "@/app/component/submit-button";

const COVER_GRADIENTS = [
  "from-rose-400 to-orange-300",
  "from-amber-400 to-yellow-300",
  "from-emerald-400 to-teal-300",
  "from-sky-400 to-blue-300",
  "from-indigo-400 to-violet-300",
  "from-fuchsia-400 to-pink-300",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1_000_000_007;
  }
  return hash;
}

function getInitials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await getVendorProfile(id);

  if (!vendor) notFound();

  const [products, viewer] = await Promise.all([
    listProducts({ vendorId: id }),
    getProfile(),
  ]);
  const shopName = vendor.shop_name ?? vendor.full_name ?? "Shop";
  const initials = getInitials(shopName);
  const gradient = COVER_GRADIENTS[hashString(vendor.id) % COVER_GRADIENTS.length];
  const canMessage = (!viewer || viewer.role === "buyer") && viewer?.id !== vendor.id;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <div className="h-40 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:h-56">
        {vendor.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.cover_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-4xl font-semibold text-white/40 sm:text-6xl">
              {initials}
            </span>
          </div>
        )}
      </div>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 sm:px-8">
        <div className="-mt-10 mb-8 flex items-end gap-4 sm:-mt-12">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-zinc-50 bg-zinc-100 dark:border-black dark:bg-zinc-900 sm:h-24 sm:w-24">
            {vendor.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendor.logo_url}
                alt={shopName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-foreground text-xl font-semibold text-background">
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-1 items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
                {shopName}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {products.length} product{products.length === 1 ? "" : "s"}
              </p>
            </div>
            {canMessage && (
              <form action={createConversation.bind(null, vendor.id)}>
                <SubmitButton
                  pendingText="Opening…"
                  className="rounded-full border border-black/[.15] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.2] dark:text-zinc-50 dark:hover:bg-white/[.06]"
                >
                  Message
                </SubmitButton>
              </form>
            )}
          </div>
        </div>

        {!products.length ? (
          <div className="flex flex-col items-center gap-3 border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-400 dark:text-zinc-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9.75 12 4l9 5.75M4.5 10.5v9h15v-9M9.75 19.5v-6h4.5v6"
              />
            </svg>
            <p className="font-medium text-black dark:text-zinc-50">
              No products yet
            </p>
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              This shop hasn&apos;t listed any products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}

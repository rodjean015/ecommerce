import { notFound } from "next/navigation";
import { getVendorProfile } from "@/lib/vendors";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/app/component/product-card";
import { PublicHeader } from "@/app/component/public-header";
import { PublicFooter } from "@/app/component/public-footer";

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await getVendorProfile(id);

  if (!vendor) notFound();

  const products = await listProducts({ vendorId: id });
  const shopName = vendor.shop_name ?? vendor.full_name ?? "Shop";

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
        ) : null}
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
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {shopName}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
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

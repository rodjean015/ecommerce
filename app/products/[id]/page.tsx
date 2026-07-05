import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { PublicHeader } from "@/app/component/public-header";
import { PublicFooter } from "@/app/component/public-footer";
import { ProductView } from "@/app/products/[id]/product-view";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-8 py-12">
        <Link
          href="/products"
          className="mb-6 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Back to shop
        </Link>
        <ProductView product={product} />
      </main>
      <PublicFooter />
    </div>
  );
}

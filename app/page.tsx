import Link from "next/link";
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/app/product-card";
import { PublicHeader } from "@/app/public-header";
import { PublicFooter } from "@/app/public-footer";

const VALUE_PROPS = [
  {
    title: "Independent vendors",
    description:
      "Every listing comes from a small, independent seller — not a warehouse.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9.75 12 4l9 5.75M4.5 10.5v9h15v-9M9.75 19.5v-6h4.5v6"
      />
    ),
  },
  {
    title: "Browse without an account",
    description:
      "Look through the full catalog anytime — sign in only when you're ready to buy.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm0 0 6 6M15 15l6 6"
      />
    ),
  },
  {
    title: "Simple checkout",
    description:
      "Add items to your cart and check out in a couple of clicks, no clutter.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4.5h2.25l1.5 12.75h10.5l1.5-9H6.375M9 21a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm7.5 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    ),
  },
];

export default async function Home() {
  const featured = await listProducts({ limit: 8 });

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />

      <section className="relative overflow-hidden border-b border-black/[.08] bg-white px-6 py-24 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(23,23,23,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]"
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
            A marketplace for independent vendors
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-black sm:text-6xl dark:text-zinc-50">
            Shop unique products from independent vendors
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Browse a growing catalog of goods listed by small vendors, or
            sign in to start selling your own.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background shadow-sm transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Browse products
            </Link>
            <Link
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-black/[.08] px-6 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/[.08] bg-white px-6 py-16 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-black dark:text-zinc-50"
              >
                {item.icon}
              </svg>
              <h3 className="font-medium text-black dark:text-zinc-50">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Featured
            </span>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              Featured products
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
          >
            View all
          </Link>
        </div>

        {!featured.length ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}

import Link from "next/link";
import { listProducts, listCategories } from "@/lib/products";
import { ProductCard } from "@/app/component/product-card";
import { PublicHeader } from "@/app/component/public-header";
import { PublicFooter } from "@/app/component/public-footer";

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

const STEPS = [
  {
    title: "Browse the catalog",
    description: "Look through listings from independent vendors — no account needed.",
  },
  {
    title: "Add items to your cart",
    description: "Your cart is saved in your browser, so it's there when you come back.",
  },
  {
    title: "Sign in and check out",
    description: "Sign in with Google or X only when you're ready to complete your order.",
  },
];

const FAQS = [
  {
    question: "Do I need an account to browse?",
    answer:
      "No — you can look through the full catalog and add items to your cart without signing in. You'll only need an account to check out.",
  },
  {
    question: "How do I sign in?",
    answer:
      "Sign in with your Google or X account — there's no separate password to create or remember.",
  },
  {
    question: "How do I start selling?",
    answer:
      "Sign in and choose \"I want to sell\" during onboarding. You'll get access to a vendor dashboard where you can list products and track sales.",
  },
  {
    question: "Can I switch between buying and selling later?",
    answer:
      "Your role is chosen once the first time you sign in and can't be changed afterward, so pick the one that fits before continuing.",
  },
];

export default async function Home() {
  const [featured, categories] = await Promise.all([
    listProducts({ limit: 8 }),
    listCategories(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />

      <section className="relative overflow-hidden border-b border-black/[.08] bg-white px-6 py-24 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(23,23,23,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]"
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="animate-fade-in-up rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
            A marketplace for independent vendors
          </span>
          <h1
            style={{ animationDelay: "80ms" }}
            className="animate-fade-in-up text-4xl font-semibold leading-[1.1] tracking-tight text-black sm:text-6xl dark:text-zinc-50"
          >
            Shop unique products from independent vendors
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="animate-fade-in-up max-w-xl text-lg text-zinc-600 dark:text-zinc-400"
          >
            Browse a growing catalog of goods listed by small vendors, or
            sign in to start selling your own.
          </p>
          <div
            style={{ animationDelay: "240ms" }}
            className="animate-fade-in-up mt-2 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background shadow-sm transition-all hover:bg-[#383838] active:scale-95 dark:hover:bg-[#ccc]"
            >
              Browse products
            </Link>
            <Link
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-black/[.08] px-6 text-base font-medium text-black transition-all hover:bg-black/[.04] active:scale-95 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
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

      <section className="border-b border-black/[.08] px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-xl font-semibold text-black dark:text-zinc-50">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <h3 className="font-medium text-black dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {categories.length ? (
        <section className="border-b border-black/[.08] bg-white px-6 py-16 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
              Shop by category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
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
              No products available yet
            </p>
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              Check back soon — new listings show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-black/[.08] bg-white px-6 py-16 dark:border-white/[.145] dark:bg-zinc-950 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              Have something to sell?
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Sign in and list your first product in minutes — no setup fees.
            </p>
          </div>
          <Link
            href="/login"
            className="flex h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background shadow-sm transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Become a vendor
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
            Frequently asked questions
          </h2>
          <div className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-black dark:text-zinc-50">
                  {faq.question}
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 transition-transform group-open:rotate-45"
                  >
                    <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

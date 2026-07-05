import Link from "next/link";
import { signInWithGoogle, signInWithDiscord, signInWithX } from "@/app/auth/actions";
import { SubmitButton } from "@/app/component/submit-button";
import { Logo } from "@/app/component/logo";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 px-6 py-16 dark:bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(23,23,23,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]"
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Link href="/" className="flex items-center">
          <Logo height={40} responsive={false} />
        </Link>

        <div className="w-full rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Sign in to start shopping or manage your store.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <form action={signInWithGoogle}>
              <SubmitButton
                pendingText="Redirecting…"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/[.08] px-5 text-base font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11C3.24 21.3 7.28 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.26a12 12 0 0 0 0 10.76z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.26 6.62l4.01 3.11c.95-2.85 3.6-4.98 6.73-4.98z"
                  />
                </svg>
                Continue with Google
              </SubmitButton>
            </form>
            <form action={signInWithDiscord}>
              <SubmitButton
                pendingText="Redirecting…"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/[.08] px-5 text-base font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                <svg
                  viewBox="0 0 127.14 96.36"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="#5865F2"
                    d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                  />
                </svg>
                Continue with Discord
              </SubmitButton>
            </form>
            <form action={signInWithX}>
              <SubmitButton
                pendingText="Redirecting…"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/[.08] px-5 text-base font-medium text-black transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.48 3.24H4.3z" />
                </svg>
                Continue with X
              </SubmitButton>
            </form>
          </div>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
        >
          Continue browsing without an account
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Sign-in failed
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t complete the sign-in. Please try again.
      </p>
      <Link
        href="/login"
        className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Back to login
      </Link>
    </div>
  );
}

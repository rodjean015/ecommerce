export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
      {status}
    </span>
  );
}

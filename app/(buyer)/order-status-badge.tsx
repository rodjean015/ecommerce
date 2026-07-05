const STATUS_LABELS: Record<string, string> = {
  packaging: "Packaging",
  in_transit: "In transit",
  received: "Received",
  cancelled: "Cancelled",
};

const STATUS_CLASSES: Record<string, string> = {
  packaging:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  in_transit: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  received:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        STATUS_CLASSES[status] ??
        "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

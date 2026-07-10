"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isUnread, type ConversationSummary } from "@/lib/chat-types";

function displayName(other: ConversationSummary["other"]) {
  if (!other) return "Deleted user";
  return other.shop_name ?? other.full_name ?? "User";
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function formatTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString();
}

type ConversationPatch = {
  id: string;
  buyer_id: string;
  vendor_id: string;
  last_message_at: string | null;
  last_message_body: string | null;
  last_message_sender_id: string | null;
  buyer_last_read_at: string | null;
  vendor_last_read_at: string | null;
};

export function ConversationsList({
  conversations,
  userId,
}: {
  conversations: ConversationSummary[];
  userId: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(conversations);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("conversations-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        (payload) => {
          const row = (payload.new ?? payload.old) as ConversationPatch | null;
          if (!row || (row.buyer_id !== userId && row.vendor_id !== userId)) {
            return;
          }

          const exists = itemsRef.current.some((c) => c.id === row.id);
          if (!exists) {
            router.refresh();
            return;
          }

          setItems((prev) => {
            const index = prev.findIndex((c) => c.id === row.id);
            if (index === -1) return prev;

            const updated = { ...prev[index], ...row };
            const next = [...prev];
            next.splice(index, 1);
            return [updated, ...next];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
        <p className="font-medium text-black dark:text-zinc-50">
          No conversations yet
        </p>
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Visit a shop and tap &quot;Message&quot; to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-black/[.08] border border-black/[.08] dark:divide-white/[.08] dark:border-white/[.08]">
      {items.map((conversation) => {
        const name = displayName(conversation.other);
        const unread = isUnread(conversation, userId);

        return (
          <li key={conversation.id}>
            <Link
              href={`/messages/${conversation.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.05]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-sm font-semibold text-background">
                {conversation.other?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={conversation.other.logo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(name)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                    {name}
                  </p>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-500">
                    {formatTime(conversation.last_message_at)}
                  </span>
                </div>
                <p
                  className={`truncate text-sm ${
                    unread
                      ? "font-medium text-black dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {conversation.last_message_body ?? "Say hello 👋"}
                </p>
              </div>
              {unread && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"
                  aria-hidden
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

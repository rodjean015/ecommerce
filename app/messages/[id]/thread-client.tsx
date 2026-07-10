"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { markConversationRead } from "@/app/messages/actions";
import type { ConversationSummary, Message } from "@/lib/chat-types";

function displayName(other: ConversationSummary["other"]) {
  if (!other) return "Deleted user";
  return other.shop_name ?? other.full_name ?? "User";
}

export function ThreadClient({
  conversation,
  initialMessages,
  userId,
}: {
  conversation: ConversationSummary;
  initialMessages: Message[];
  userId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const otherIsVendor = conversation.vendor_id !== userId;
  const name = displayName(conversation.other);

  useEffect(() => {
    markConversationRead(conversation.id);
  }, [conversation.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const message = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === message.id) ? prev : [...prev, message]
          );
          if (message.sender_id !== userId) {
            markConversationRead(conversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: userId,
      body: text,
    });

    if (error) setDraft(text);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center gap-3 border-b border-black/[.08] pb-4 dark:border-white/[.08]">
        <Link
          href="/messages"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Back
        </Link>
        {otherIsVendor && conversation.other ? (
          <Link
            href={`/store/${conversation.other.id}`}
            className="text-base font-semibold text-black hover:underline dark:text-zinc-50"
          >
            {name}
          </Link>
        ) : (
          <span className="text-base font-semibold text-black dark:text-zinc-50">
            {name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {messages.map((message) => {
          const mine = message.sender_id === userId;
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] break-words px-4 py-2 text-sm ${
                  mine
                    ? "bg-foreground text-background"
                    : "bg-black/[.05] text-black dark:bg-white/[.08] dark:text-zinc-50"
                }`}
              >
                {message.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 border-t border-black/[.08] pt-4 dark:border-white/[.08]"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message…"
          className="flex-1 border border-black/[.15] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/[.3] dark:border-white/[.2] dark:focus:border-white/[.4]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { createConversation } from "@/app/messages/actions";
import { SubmitButton } from "@/app/component/submit-button";

type Recipient = {
  id: string;
  name: string;
  logoUrl: string | null;
};

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

export function RecipientList({ recipients }: { recipients: Recipient[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return recipients;
    return recipients.filter((recipient) =>
      recipient.name.toLowerCase().includes(term)
    );
  }, [query, recipients]);

  if (!recipients.length) {
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-black/[.15] py-16 text-center dark:border-white/[.2]">
        <p className="font-medium text-black dark:text-zinc-50">
          Nobody to message yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search…"
        className="border border-black/[.15] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/[.3] dark:border-white/[.2] dark:focus:border-white/[.4]"
      />

      {!filtered.length ? (
        <p className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          No matches.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-black/[.08] border border-black/[.08] dark:divide-white/[.08] dark:border-white/[.08]">
          {filtered.map((recipient) => (
            <li key={recipient.id}>
              <form action={createConversation.bind(null, recipient.id)}>
                <SubmitButton
                  pendingText="Opening…"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[.03] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/[.05]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-sm font-semibold text-background">
                    {recipient.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={recipient.logoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials(recipient.name)
                    )}
                  </span>
                  <span className="text-sm font-medium text-black dark:text-zinc-50">
                    {recipient.name}
                  </span>
                </SubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

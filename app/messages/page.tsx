import Link from "next/link";
import { requireProfile } from "@/lib/supabase/dal";
import { listConversations } from "@/lib/chat";
import { ConversationsList } from "@/app/messages/conversations-list";

export default async function MessagesPage() {
  const profile = await requireProfile();
  const conversations = await listConversations(profile.id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Messages
        </h1>
        <Link
          href="/messages/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          New message
        </Link>
      </div>
      <ConversationsList
        key={conversations.map((c) => c.id).join(",")}
        conversations={conversations}
        userId={profile.id}
      />
    </div>
  );
}

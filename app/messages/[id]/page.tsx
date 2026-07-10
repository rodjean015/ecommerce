import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/supabase/dal";
import { getConversation, getMessages } from "@/lib/chat";
import { ThreadClient } from "@/app/messages/[id]/thread-client";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const conversation = await getConversation(id, profile.id);

  if (!conversation) notFound();
  if (conversation.buyer_id !== profile.id && conversation.vendor_id !== profile.id) {
    notFound();
  }

  const messages = await getMessages(id);

  return (
    <ThreadClient
      conversation={conversation}
      initialMessages={messages}
      userId={profile.id}
    />
  );
}

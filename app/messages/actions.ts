"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/supabase/dal";
import { countUnreadConversations } from "@/lib/chat";
import { createClient } from "@/lib/supabase/server";

// Finds (or creates) the conversation with `otherUserId` and jumps straight
// into it. Used both by the "Message" button on a vendor's store page and
// by the /messages/new recipient picker.
export async function createConversation(otherUserId: string) {
  const profile = await requireProfile();
  if (profile.id === otherUserId) return;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("start_conversation", {
    target_user_id: otherUserId,
  });

  if (error || !data) {
    redirect("/messages");
  }

  redirect(`/messages/${data}`);
}

export async function markConversationRead(conversationId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversationId,
  });
  revalidatePath("/messages");
}

export async function getUnreadCount() {
  const profile = await requireProfile();
  return countUnreadConversations(profile.id);
}

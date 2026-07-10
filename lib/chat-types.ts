export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type OtherParty = {
  id: string;
  full_name: string | null;
  shop_name: string | null;
  logo_url: string | null;
};

export type ConversationSummary = {
  id: string;
  buyer_id: string;
  vendor_id: string;
  last_message_at: string | null;
  last_message_body: string | null;
  last_message_sender_id: string | null;
  buyer_last_read_at: string | null;
  vendor_last_read_at: string | null;
  other: OtherParty | null;
};

export function isUnread(conversation: ConversationSummary, userId: string) {
  if (!conversation.last_message_at) return false;
  if (conversation.last_message_sender_id === userId) return false;

  const lastRead =
    conversation.buyer_id === userId
      ? conversation.buyer_last_read_at
      : conversation.vendor_last_read_at;

  if (!lastRead) return true;
  return new Date(conversation.last_message_at) > new Date(lastRead);
}

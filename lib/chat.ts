import { createClient } from "@/lib/supabase/server";
import {
  isUnread,
  type ConversationSummary,
  type Message,
  type OtherParty,
} from "@/lib/chat-types";

export type { ConversationSummary, Message, OtherParty };

type ConversationRow = {
  id: string;
  buyer_id: string;
  vendor_id: string;
  last_message_at: string | null;
  last_message_body: string | null;
  last_message_sender_id: string | null;
  buyer_last_read_at: string | null;
  vendor_last_read_at: string | null;
  buyer: OtherParty | OtherParty[] | null;
  vendor: OtherParty | OtherParty[] | null;
};

const CONVERSATION_SELECT =
  "id, buyer_id, vendor_id, last_message_at, last_message_body, last_message_sender_id, buyer_last_read_at, vendor_last_read_at, " +
  "buyer:profiles!conversations_buyer_id_fkey(id, full_name, shop_name, logo_url), " +
  "vendor:profiles!conversations_vendor_id_fkey(id, full_name, shop_name, logo_url)";

function unwrapEmbed<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

function toSummary(row: ConversationRow, userId: string): ConversationSummary {
  const buyer = unwrapEmbed(row.buyer) ?? null;
  const vendor = unwrapEmbed(row.vendor) ?? null;
  return {
    id: row.id,
    buyer_id: row.buyer_id,
    vendor_id: row.vendor_id,
    last_message_at: row.last_message_at,
    last_message_body: row.last_message_body,
    last_message_sender_id: row.last_message_sender_id,
    buyer_last_read_at: row.buyer_last_read_at,
    vendor_last_read_at: row.vendor_last_read_at,
    other: row.buyer_id === userId ? vendor : buyer,
  };
}

export async function listConversations(
  userId: string
): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  return ((data ?? []) as unknown as ConversationRow[]).map((row) =>
    toSummary(row, userId)
  );
}

export async function getConversation(
  conversationId: string,
  userId: string
): Promise<ConversationSummary | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("id", conversationId)
    .maybeSingle();

  if (!data) return null;
  return toSummary(data as unknown as ConversationRow, userId);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function countUnreadConversations(userId: string) {
  const conversations = await listConversations(userId);
  return conversations.filter((conversation) => isUnread(conversation, userId))
    .length;
}

export type Customer = { id: string; full_name: string | null };

// Buyer profiles aren't public, so a vendor can only message buyers who have
// actually ordered from them; `order_items.buyer_id` is the source of truth
// for that (see the `profiles_select_buyer_by_vendor` RLS policy).
export async function listVendorCustomers(vendorId: string): Promise<Customer[]> {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("order_items")
    .select("buyer_id")
    .eq("vendor_id", vendorId);

  const buyerIds = Array.from(
    new Set(
      (items ?? [])
        .map((item) => item.buyer_id)
        .filter((id): id is string => Boolean(id))
    )
  );
  if (!buyerIds.length) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", buyerIds)
    .order("full_name", { ascending: true });

  return profiles ?? [];
}

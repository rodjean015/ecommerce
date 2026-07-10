-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: uses "if not exists" / "or replace" where possible, but DROP
-- statements are intentionally omitted so it won't wipe existing data.

-- ============================================================================
-- profiles: one row per user, created at onboarding, decides vendor vs buyer
-- ============================================================================

do $$ begin
  create type user_role as enum ('vendor', 'buyer');
exception
  when duplicate_object then null;
end $$;

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null,
  full_name text,
  shop_name text,
  logo_url text,
  cover_url text,
  created_at timestamptz not null default now()
);

alter table profiles add column if not exists shop_name text;
alter table profiles add column if not exists logo_url text;
alter table profiles add column if not exists cover_url text;

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

-- Vendor name/shop_name/logo/cover are shown publicly (catalog "Sold by X"
-- and the public /store/[id] shop page), so anyone must be able to read
-- vendor profiles, not just the vendor themself.
drop policy if exists "profiles_select_vendor_public" on profiles;
create policy "profiles_select_vendor_public" on profiles
  for select using (role = 'vendor');

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- ============================================================================
-- products: owned by a vendor, browsable by any authenticated user
-- ============================================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  image_urls text[],
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products add column if not exists category text;
alter table products add column if not exists is_active boolean not null default true;

-- image_urls holds up to 5 photos (data URLs); image_url is kept in sync as
-- image_urls[1] for the many places (cards, cart, order rows) that only
-- ever show a single thumbnail.
alter table products add column if not exists image_urls text[];
alter table products drop constraint if exists products_image_urls_check;
alter table products add constraint products_image_urls_check
  check (image_urls is null or array_length(image_urls, 1) <= 5);

create index if not exists products_vendor_id_idx on products (vendor_id);
create index if not exists products_category_idx on products (category);

alter table products enable row level security;

-- Products are public: the landing page and catalog must work for signed-out
-- visitors, so select is open to everyone rather than gated to authenticated.
drop policy if exists "products_select_authenticated" on products;
drop policy if exists "products_select_public" on products;
create policy "products_select_public" on products
  for select using (true);

drop policy if exists "products_insert_own_vendor" on products;
create policy "products_insert_own_vendor" on products
  for insert with check (
    auth.uid() = vendor_id
    and exists (
      select 1 from profiles where id = auth.uid() and role = 'vendor'
    )
  );

drop policy if exists "products_update_own" on products;
create policy "products_update_own" on products
  for update using (auth.uid() = vendor_id);

drop policy if exists "products_delete_own" on products;
create policy "products_delete_own" on products
  for delete using (auth.uid() = vendor_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

-- ============================================================================
-- orders / order_items: created only via place_order() below, never directly
-- ============================================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'packaging',
  total numeric(10, 2) not null default 0 check (total >= 0),
  recipient_name text not null default '',
  phone text not null default '',
  region text not null default '',
  province text not null default '',
  address_line text not null default '',
  city text not null default '',
  postal_code text,
  notes text,
  payment_method text not null default 'cod',
  created_at timestamptz not null default now()
);

alter table orders add column if not exists recipient_name text not null default '';
alter table orders add column if not exists phone text not null default '';
alter table orders add column if not exists region text not null default '';
alter table orders add column if not exists province text not null default '';
alter table orders add column if not exists address_line text not null default '';
alter table orders add column if not exists city text not null default '';
alter table orders add column if not exists postal_code text;
alter table orders add column if not exists notes text;
alter table orders add column if not exists payment_method text not null default 'cod';

alter table orders drop constraint if exists orders_payment_method_check;
alter table orders add constraint orders_payment_method_check check (payment_method = 'cod');

-- status is a delivery lifecycle, not a payment state (COD is paid on
-- delivery, not at checkout): packaging -> in_transit -> received, with
-- cancellation possible before it's received.
update orders set status = 'packaging' where status = 'paid';
alter table orders alter column status set default 'packaging';
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('packaging', 'in_transit', 'received', 'cancelled'));

alter table orders enable row level security;

drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own" on orders
  for select using (auth.uid() = buyer_id);

-- A vendor needs the delivery details of any order that contains one of
-- their items, so they know where to ship it (COD has no other paper trail).
drop policy if exists "orders_select_vendor" on orders;
create policy "orders_select_vendor" on orders
  for select using (
    exists (
      select 1 from order_items
      where order_items.order_id = orders.id
        and order_items.vendor_id = auth.uid()
    )
  );

-- Intentionally no insert/update/delete policy: rows are only ever written by
-- place_order() and update_order_status(), both SECURITY DEFINER functions
-- that bypass RLS internally.
-- This means even a compromised anon key cannot fabricate a "paid" order.

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  vendor_id uuid not null references auth.users (id),
  buyer_id uuid references auth.users (id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

alter table order_items add column if not exists buyer_id uuid references auth.users (id);

-- Backfill from orders for rows written before buyer_id existed on this table.
update order_items oi
set buyer_id = o.buyer_id
from orders o
where oi.order_id = o.id
  and oi.buyer_id is null;

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists order_items_vendor_id_idx on order_items (vendor_id);

alter table order_items enable row level security;

-- buyer_id is denormalized here (rather than joining back to orders) because
-- orders_select_vendor below queries order_items: if this policy queried
-- orders in turn, the two would recurse into each other and Postgres would
-- raise "infinite recursion detected in policy for relation orders".
drop policy if exists "order_items_select_buyer" on order_items;
create policy "order_items_select_buyer" on order_items
  for select using (auth.uid() = buyer_id);

drop policy if exists "order_items_select_vendor" on order_items;
create policy "order_items_select_vendor" on order_items
  for select using (auth.uid() = vendor_id);

-- ============================================================================
-- place_order: the only way to create an order. Re-reads price/stock from
-- the products table (never trusts client-submitted prices), locks rows to
-- avoid overselling under concurrent checkouts, and does all writes
-- atomically in one transaction. Delivery details are required because the
-- only payment method is Cash on Delivery: there is no other record of
-- where to ship the order.
-- ============================================================================

drop function if exists place_order(jsonb);
drop function if exists place_order(jsonb, text, text, text, text, text, text, text);

create or replace function place_order(
  items jsonb,
  recipient_name text,
  phone text,
  region text,
  province text,
  address_line text,
  city text,
  postal_code text default null,
  notes text default null,
  payment_method text default 'cod'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric(10, 2) := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty integer;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if jsonb_array_length(items) = 0 then
    raise exception 'Cart is empty';
  end if;

  if payment_method <> 'cod' then
    raise exception 'Only Cash on Delivery is supported';
  end if;

  if coalesce(trim(recipient_name), '') = '' then
    raise exception 'Recipient name is required';
  end if;

  if coalesce(trim(phone), '') = '' then
    raise exception 'Phone number is required';
  end if;

  if coalesce(trim(region), '') = '' then
    raise exception 'Region is required';
  end if;

  if coalesce(trim(province), '') = '' then
    raise exception 'Province is required';
  end if;

  if coalesce(trim(address_line), '') = '' then
    raise exception 'Delivery address is required';
  end if;

  if coalesce(trim(city), '') = '' then
    raise exception 'City is required';
  end if;

  insert into orders (
    buyer_id, status, total, recipient_name, phone, region, province,
    address_line, city, postal_code, notes, payment_method
  )
  values (
    auth.uid(), 'packaging', 0, trim(recipient_name), trim(phone),
    trim(region), trim(province), trim(address_line), trim(city),
    nullif(trim(postal_code), ''), nullif(trim(notes), ''), payment_method
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(items)
  loop
    v_qty := (v_item ->> 'quantity')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product
    from products
    where id = (v_item ->> 'product_id')::uuid
    for update;

    if not found then
      raise exception 'Product not found';
    end if;

    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    update products
    set stock = stock - v_qty
    where id = v_product.id;

    insert into order_items (order_id, product_id, vendor_id, buyer_id, quantity, unit_price)
    values (v_order_id, v_product.id, v_product.vendor_id, auth.uid(), v_qty, v_product.price);

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update orders set total = v_total where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function place_order(jsonb, text, text, text, text, text, text, text, text, text) to authenticated;

-- ============================================================================
-- update_order_status: the only way to change an order's delivery status.
-- Buyers may only cancel, and only while it's still packaging (before it
-- ships). Vendors may advance packaging -> in_transit -> received, or cancel
-- any time before it's received. Cancelling restores the stock that
-- place_order() reserved. Runs as security definer so neither role needs
-- direct update access to orders.
-- ============================================================================

create or replace function update_order_status(p_order_id uuid, p_new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_is_vendor boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_new_status not in ('packaging', 'in_transit', 'received', 'cancelled') then
    raise exception 'Invalid status';
  end if;

  select * into v_order from orders where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  v_is_vendor := exists (
    select 1 from order_items
    where order_items.order_id = v_order.id
      and order_items.vendor_id = auth.uid()
  );

  if auth.uid() = v_order.buyer_id then
    if p_new_status <> 'cancelled' or v_order.status <> 'packaging' then
      raise exception 'Buyers can only cancel an order while it is still packaging';
    end if;
  elsif v_is_vendor then
    if v_order.status = 'packaging' and p_new_status in ('in_transit', 'cancelled') then
      -- allowed
    elsif v_order.status = 'in_transit' and p_new_status in ('received', 'cancelled') then
      -- allowed
    else
      raise exception 'Invalid status transition';
    end if;
  else
    raise exception 'Not authorized';
  end if;

  if p_new_status = 'cancelled' then
    update products p
    set stock = p.stock + oi.quantity
    from order_items oi
    where oi.order_id = v_order.id
      and oi.product_id = p.id;
  end if;

  update orders set status = p_new_status where id = p_order_id;
end;
$$;

grant execute on function update_order_status(uuid, text) to authenticated;

-- ============================================================================
-- addresses: a buyer's saved delivery addresses, reusable at checkout.
-- Plain owner-only CRUD (no security definer function needed here, unlike
-- orders, since nobody but the buyer themself ever needs to touch these).
-- ============================================================================

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  label text,
  recipient_name text not null,
  phone text not null,
  region text not null,
  province text not null,
  address_line text not null,
  city text not null,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_buyer_id_idx on addresses (buyer_id);

alter table addresses enable row level security;

drop policy if exists "addresses_select_own" on addresses;
create policy "addresses_select_own" on addresses
  for select using (auth.uid() = buyer_id);

drop policy if exists "addresses_insert_own" on addresses;
create policy "addresses_insert_own" on addresses
  for insert with check (auth.uid() = buyer_id);

drop policy if exists "addresses_update_own" on addresses;
create policy "addresses_update_own" on addresses
  for update using (auth.uid() = buyer_id);

drop policy if exists "addresses_delete_own" on addresses;
create policy "addresses_delete_own" on addresses
  for delete using (auth.uid() = buyer_id);

-- ============================================================================
-- conversations / messages: realtime buyer <-> vendor inbox. Any buyer can
-- message any vendor (and vice versa) once a conversation exists between
-- them. Writes to `conversations` only ever happen via security definer
-- functions/trigger below, so no insert/update policy is needed on it.
-- ============================================================================

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users (id) on delete cascade,
  vendor_id uuid not null references auth.users (id) on delete cascade,
  last_message_at timestamptz,
  last_message_body text,
  last_message_sender_id uuid,
  buyer_last_read_at timestamptz,
  vendor_last_read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (buyer_id, vendor_id)
);

create index if not exists conversations_buyer_id_idx on conversations (buyer_id);
create index if not exists conversations_vendor_id_idx on conversations (vendor_id);

alter table conversations enable row level security;

drop policy if exists "conversations_select_participant" on conversations;
create policy "conversations_select_participant" on conversations
  for select using (auth.uid() = buyer_id or auth.uid() = vendor_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on messages (conversation_id, created_at);

alter table messages enable row level security;

drop policy if exists "messages_select_participant" on messages;
create policy "messages_select_participant" on messages
  for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.vendor_id = auth.uid())
    )
  );

drop policy if exists "messages_insert_participant" on messages;
create policy "messages_insert_participant" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.buyer_id = auth.uid() or c.vendor_id = auth.uid())
    )
  );

-- Bumps the parent conversation's last-message preview whenever a message is
-- inserted. Security definer because the inserting user only has an insert
-- policy on `messages`, not an update policy on `conversations`.
create or replace function touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update conversations
  set last_message_at = new.created_at,
      last_message_body = new.body,
      last_message_sender_id = new.sender_id
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on messages;
create trigger messages_touch_conversation
  after insert on messages
  for each row execute function touch_conversation_on_message();

-- Finds (or lazily creates) the single conversation between the caller and
-- `target_user_id`. Security definer so it can look up the target's role and
-- insert into `conversations` without needing a direct insert policy.
create or replace function start_conversation(target_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role user_role;
  v_target_role user_role;
  v_buyer_id uuid;
  v_vendor_id uuid;
  v_id uuid;
begin
  if target_user_id = auth.uid() then
    raise exception 'Cannot start a conversation with yourself';
  end if;

  select role into v_caller_role from profiles where id = auth.uid();
  select role into v_target_role from profiles where id = target_user_id;

  if v_caller_role is null or v_target_role is null then
    raise exception 'Both users must have a profile';
  end if;

  if v_caller_role = 'buyer' and v_target_role = 'vendor' then
    v_buyer_id := auth.uid();
    v_vendor_id := target_user_id;
  elsif v_caller_role = 'vendor' and v_target_role = 'buyer' then
    v_buyer_id := target_user_id;
    v_vendor_id := auth.uid();
  else
    raise exception 'Conversations are only between a buyer and a vendor';
  end if;

  insert into conversations (buyer_id, vendor_id)
  values (v_buyer_id, v_vendor_id)
  on conflict (buyer_id, vendor_id) do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id from conversations
    where buyer_id = v_buyer_id and vendor_id = v_vendor_id;
  end if;

  return v_id;
end;
$$;

grant execute on function start_conversation(uuid) to authenticated;

-- Marks the caller's side of a conversation as read up to now. Security
-- definer since there's no general update policy on `conversations`.
create or replace function mark_conversation_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update conversations
  set buyer_last_read_at = case when buyer_id = auth.uid() then now() else buyer_last_read_at end,
      vendor_last_read_at = case when vendor_id = auth.uid() then now() else vendor_last_read_at end
  where id = p_conversation_id
    and (buyer_id = auth.uid() or vendor_id = auth.uid());
end;
$$;

grant execute on function mark_conversation_read(uuid) to authenticated;

-- Enable realtime delivery for the inbox (respects the select policies
-- above, so a client only ever receives rows it's allowed to see).
do $$ begin
  alter publication supabase_realtime add table conversations;
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table messages;
exception
  when duplicate_object then null;
end $$;

-- A vendor starting a new message needs to see the names of buyers who have
-- actually bought from them (the "New message" picker), even though buyer
-- profiles aren't public like vendor profiles are.
drop policy if exists "profiles_select_buyer_by_vendor" on profiles;
create policy "profiles_select_buyer_by_vendor" on profiles
  for select using (
    role = 'buyer'
    and exists (
      select 1 from order_items
      where order_items.buyer_id = profiles.id
        and order_items.vendor_id = auth.uid()
    )
  );

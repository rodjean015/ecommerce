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
  created_at timestamptz not null default now()
);

alter table profiles add column if not exists shop_name text;

alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

-- Vendor name/shop_name are shown publicly on the catalog ("Sold by X"), so
-- anyone must be able to read vendor profiles, not just the vendor themself.
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
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products add column if not exists category text;
alter table products add column if not exists is_active boolean not null default true;

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
  status text not null default 'paid',
  total numeric(10, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own" on orders
  for select using (auth.uid() = buyer_id);

-- Intentionally no insert/update/delete policy: rows are only ever written by
-- place_order(), a SECURITY DEFINER function that bypasses RLS internally.
-- This means even a compromised anon key cannot fabricate a "paid" order.

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  vendor_id uuid not null references auth.users (id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists order_items_vendor_id_idx on order_items (vendor_id);

alter table order_items enable row level security;

drop policy if exists "order_items_select_buyer" on order_items;
create policy "order_items_select_buyer" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.buyer_id = auth.uid()
    )
  );

drop policy if exists "order_items_select_vendor" on order_items;
create policy "order_items_select_vendor" on order_items
  for select using (auth.uid() = vendor_id);

-- ============================================================================
-- place_order: the only way to create an order. Re-reads price/stock from
-- the products table (never trusts client-submitted prices), locks rows to
-- avoid overselling under concurrent checkouts, and does all writes
-- atomically in one transaction.
-- ============================================================================

create or replace function place_order(items jsonb)
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

  insert into orders (buyer_id, status, total)
  values (auth.uid(), 'paid', 0)
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

    insert into order_items (order_id, product_id, vendor_id, quantity, unit_price)
    values (v_order_id, v_product.id, v_product.vendor_id, v_qty, v_product.price);

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update orders set total = v_total where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function place_order(jsonb) to authenticated;

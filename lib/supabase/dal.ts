import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "vendor" | "buyer";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
};

export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return data;
});

export async function requireUser() {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireProfile() {
  await requireUser();
  const profile = await getProfile();
  if (!profile) redirect("/onboarding");
  return profile;
}

export async function requireVendor() {
  const profile = await requireProfile();
  if (profile.role !== "vendor") redirect("/shop");
  return profile;
}

export async function requireBuyer() {
  const profile = await requireProfile();
  if (profile.role !== "buyer") redirect("/vendor/products");
  return profile;
}

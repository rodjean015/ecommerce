"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import type { UserRole } from "@/lib/supabase/dal";

export async function chooseRole(role: UserRole) {
  if (role !== "vendor" && role !== "buyer") {
    throw new Error("Invalid role");
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    role,
    full_name: user.user_metadata?.full_name ?? null,
  });

  if (error) {
    console.error("chooseRole: profiles insert failed", error);
    throw new Error("Could not save your role. Please try again.");
  }

  redirect(role === "vendor" ? "/vendor/products" : "/shop");
}

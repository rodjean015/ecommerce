"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import type { UserRole } from "@/lib/supabase/dal";

export async function completeOnboarding(formData: FormData) {
  const role = formData.get("role") as UserRole | null;
  if (role !== "vendor" && role !== "buyer") {
    throw new Error("Invalid role");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) {
    throw new Error("Name is required");
  }

  const shopName = String(formData.get("shop_name") ?? "").trim();
  if (role === "vendor" && !shopName) {
    throw new Error("Shop name is required");
  }

  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    role,
    full_name: fullName,
    shop_name: role === "vendor" ? shopName : null,
  });

  if (error) {
    console.error("completeOnboarding: profiles insert failed", error);
    throw new Error("Could not save your details. Please try again.");
  }

  redirect(role === "vendor" ? "/vendor/products" : "/shop");
}

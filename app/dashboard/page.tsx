import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/dal";

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) redirect("/onboarding");
  redirect(profile.role === "vendor" ? "/vendor/products" : "/shop");
}

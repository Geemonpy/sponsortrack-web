import "server-only";
import { supabase } from "@/lib/supabaseServer";

export async function getUserTier(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("tier, status")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  return data.status === "active" ? (data.tier as string) : null;
}

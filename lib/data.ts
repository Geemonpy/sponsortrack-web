import "server-only";
import { supabase } from "./supabaseServer";
import type { Job, JobFilters, Stats } from "./types";

export const MAIN_SOURCES = ["Adzuna", "Active Jobs DB"] as const;

export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  try {
    let q = supabase.from("jobs").select("*");

    if (filters.badge) q = q.eq("badge", filters.badge);
    if (filters.category) q = q.eq("category", filters.category);
    if (filters.location) q = q.ilike("location", `%${filters.location}%`);
    if (filters.days) {
      const cutoff = new Date(Date.now() - filters.days * 86400000)
        .toISOString()
        .slice(0, 10);
      q = q.gte("posted_date", cutoff);
    }
    if (filters.search) {
      q = q.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }
    if (filters.salaryThreshold) q = q.eq("meets_general_threshold", "meets");

    q = q.order("posted_date", { ascending: false }).limit(filters.limit ?? 200);

    const { data, error } = await q;
    if (error) {
      console.error("getJobs error:", error.message);
      return [];
    }
    let result = (data ?? []) as Job[];
    if (filters.sourceType === "main") {
      result = result.filter(
        (j) => j.source === null || (MAIN_SOURCES as readonly string[]).includes(j.source)
      );
    } else if (filters.sourceType === "test") {
      result = result.filter(
        (j) => j.source !== null && !(MAIN_SOURCES as readonly string[]).includes(j.source)
      );
    }
    return result;
  } catch (e) {
    console.error("getJobs failed:", e);
    return [];
  }
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error(`getJob error for id=${id}:`, error.message);
      return null;
    }
    if (!data) {
      console.warn(`getJob: no row found for id=${id}`);
    }
    return (data as Job) ?? null;
  } catch (e) {
    console.error(`getJob failed for id=${id}:`, e);
    return null;
  }
}

export async function getStats(): Promise<Stats> {
  const empty: Stats = { total: 0, sponsor_confirmed: 0, licensed_sponsor: 0, today: 0 };
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [totalRes, confirmedRes, licensedRes, todayRes] = await Promise.all([
      supabase.from("jobs").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("badge", "sponsor_confirmed"),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("badge", "licensed_sponsor"),
      supabase.from("jobs").select("id", { count: "exact", head: true }).gte("posted_date", today),
    ]);
    return {
      total: totalRes.count ?? 0,
      sponsor_confirmed: confirmedRes.count ?? 0,
      licensed_sponsor: licensedRes.count ?? 0,
      today: todayRes.count ?? 0,
    };
  } catch (e) {
    console.error("getStats failed:", e);
    return empty;
  }
}

export async function getRecentJobIds(limit = 1000): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("id")
      .order("posted_date", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((r: { id: string }) => r.id);
  } catch (e) {
    console.error("getRecentJobIds failed:", e);
    return [];
  }
}

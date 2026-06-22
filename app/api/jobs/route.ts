import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/data";
import { getUserTier } from "@/lib/stripe/subscription";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// In-memory rate limiter: 60 requests per IP per minute
const ipBuckets = new Map<string, { hits: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune stale entries occasionally to avoid unbounded growth
  if (ipBuckets.size > 5_000) {
    ipBuckets.forEach((v, k) => {
      if (now > v.reset) ipBuckets.delete(k);
    });
  }

  const bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.reset) {
    ipBuckets.set(ip, { hits: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (bucket.hits >= MAX_HITS) return true;
  bucket.hits++;
  return false;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.ip ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please slow down." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Check subscriber status from Bearer token
  let isSubscriber = false;
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      const tier = await getUserTier(user.id);
      isSubscriber = tier === "job_access" || tier === "alerts";
    }
  }

  const sp = req.nextUrl.searchParams;
  const badgeParam = sp.get("badge") || "";
  const includeUnconfirmed = sp.get("includeUnconfirmed") === "1";

  // Resolve badge filter server-side so the 200-row limit applies to the correct set.
  // - Specific badge (incl. "sponsor_not_verified" for the unverified tab): use as-is.
  // - Default verified view: sponsor_confirmed + licensed_sponsor.
  // - Verified + includeUnconfirmed: everything except sponsor_not_verified.
  let badgeFilter: string | undefined;
  let badgesFilter: string[] | undefined;
  if (badgeParam) {
    badgeFilter = badgeParam;
  } else if (includeUnconfirmed) {
    badgesFilter = ["sponsor_confirmed", "licensed_sponsor", "sponsorship_mentioned"];
  } else {
    badgesFilter = ["sponsor_confirmed", "licensed_sponsor"];
  }

  if (isSubscriber) {
    const daysRaw = sp.get("days");
    const jobs = await getJobs({
      badge: badgeFilter,
      badges: badgesFilter,
      category: sp.get("category") || undefined,
      location: sp.get("location") || undefined,
      search: sp.get("search") || undefined,
      days: daysRaw ? Number(daysRaw) : undefined,
      salaryThreshold: sp.get("salaryThreshold") === "1" || undefined,
      limit: 200,
      sourceType: "main",
    });
    return NextResponse.json({ count: jobs.length, jobs, capped: false });
  }

  // Free / unauthenticated: 20 most-recent verified jobs (default badge filter applied)
  const jobs = await getJobs({ badges: ["sponsor_confirmed", "licensed_sponsor"], limit: 20, sourceType: "main" });
  return NextResponse.json({ count: jobs.length, jobs, capped: true });
}

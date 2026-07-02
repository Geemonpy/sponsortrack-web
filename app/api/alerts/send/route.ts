import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "alerts@sponsorroute.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sponsorroute.com";
const CRON_SECRET = process.env.CRON_SECRET;

interface Pref {
  user_id: string;
  email: string;
  categories: string[];
  keyword: string | null;
  location: string | null;
  last_sent_at: string | null;
}

interface JobRow {
  id: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  apply_url: string | null;
  badge: string;
  posted_date: string | null;
}

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildEmail(jobs: JobRow[], userEmail: string): string {
  const cards = jobs.map(j => `
    <div style="border:1px solid #e8e4f3;border-radius:12px;padding:18px 20px;margin-bottom:14px;background:#fff;">
      <div style="font-size:16px;font-weight:700;color:#1c1440;margin-bottom:3px;">${esc(j.title)}</div>
      <div style="font-size:13px;color:#6b6b8a;margin-bottom:10px;">
        ${esc(j.company)}${j.location ? ` &middot; ${esc(j.location)}` : ""}${j.salary ? ` &middot; ${esc(j.salary)}` : ""}
      </div>
      ${j.apply_url
        ? `<a href="${esc(j.apply_url)}" style="display:inline-block;background:#5b43e8;color:#fff;font-size:13px;font-weight:600;padding:7px 16px;border-radius:8px;text-decoration:none;">Apply →</a>`
        : ""}
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f6fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:32px auto;padding:0 16px 40px;">
    <div style="margin-bottom:24px;">
      <span style="font-size:20px;font-weight:800;color:#1c1440;">Sponsor<span style="color:#5b43e8;">Route</span></span>
    </div>
    <h1 style="font-size:22px;font-weight:800;color:#1c1440;margin:0 0 6px;">
      ${jobs.length} new sponsor job${jobs.length === 1 ? "" : "s"} for you
    </h1>
    <p style="font-size:14px;color:#6b6b8a;margin:0 0 24px;">
      Fresh roles matching your alert preferences — apply before the crowd.
    </p>
    ${cards}
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e8e4f3;">
      <p style="font-size:12px;color:#9999b2;margin:0;">
        You're receiving this because you set up job alerts on SponsorRoute.
        <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(userEmail)}" style="color:#5b43e8;">Unsubscribe</a>
        or <a href="${SITE_URL}/alerts" style="color:#5b43e8;">manage your preferences</a>.
      </p>
      <p style="font-size:12px;color:#9999b2;margin:6px 0 0;">
        SponsorRoute does not guarantee sponsorship or employment. Listings are guidance only — always verify directly with the employer.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  if (!CRON_SECRET || req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 503 });
  }

  const { data: allPrefs, error: prefsError } = await supabase
    .from("alert_preferences")
    .select("user_id, email, categories, keyword, location, last_sent_at")
    .eq("is_active", true);

  if (prefsError) return NextResponse.json({ error: prefsError.message }, { status: 500 });
  if (!allPrefs || allPrefs.length === 0) return NextResponse.json({ sent: 0, skipped: 0 });

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("user_id")
    .in("user_id", allPrefs.map(p => p.user_id))
    .eq("status", "active")
    .eq("tier", "alerts");

  const paidIds = new Set((subs ?? []).map(s => s.user_id));
  const prefs = (allPrefs as Pref[]).filter(p => paidIds.has(p.user_id));

  const results = { sent: 0, skipped: 0, errors: [] as string[] };

  for (const pref of prefs) {
    const cutoff = pref.last_sent_at
      ? new Date(pref.last_sent_at).toISOString()
      : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    let q = supabase
      .from("jobs")
      .select("id, title, company, location, salary, apply_url, badge, posted_date")
      .gt("created_at", cutoff)
      .or("source.is.null,source.eq.Adzuna,source.eq.Fantastic Jobs")
      .order("created_at", { ascending: false })
      .limit(20);

    if (pref.categories && pref.categories.length > 0) {
      q = q.in("category", pref.categories);
    }
    if (pref.location) {
      q = q.ilike("location", `%${pref.location}%`);
    }
    if (pref.keyword) {
      const kw = pref.keyword.replace(/%/g, "\\%").replace(/_/g, "\\_");
      q = q.or(`title.ilike.%${kw}%,company.ilike.%${kw}%`);
    }

    const { data: jobs, error: jobsError } = await q;

    if (jobsError) {
      results.errors.push(`${pref.email}: query failed — ${jobsError.message}`);
      continue;
    }

    if (!jobs || jobs.length === 0) {
      results.skipped++;
      continue;
    }

    try {
      const { error: sendError } = await resend.emails.send({
        from: FROM,
        to: pref.email,
        subject: `${jobs.length} new sponsor job${jobs.length === 1 ? "" : "s"} matching your alerts`,
        html: buildEmail(jobs as JobRow[], pref.email),
      });

      if (sendError) throw new Error(sendError.message);

      await supabase
        .from("alert_preferences")
        .update({ last_sent_at: new Date().toISOString() })
        .eq("user_id", pref.user_id);

      results.sent++;
    } catch (err) {
      results.errors.push(`${pref.email}: send failed — ${String(err)}`);
    }
  }

  return NextResponse.json(results);
}

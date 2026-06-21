"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Job, Stats } from "@/lib/types";
import JobCard from "./JobCard";
import { supabaseBrowser } from "@/lib/supabaseClient";

const CATS = [
  { key: "", label: "All" },
  { key: "IT", label: "IT" },
  { key: "care", label: "Care" },
  { key: "graduate", label: "Graduate" },
];

const PAGE_SIZE = 20;

function SkeletonCard() {
  return (
    <div className="bg-white border border-v-line rounded-[18px] p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_14px_44px_rgba(28,20,64,.07)] animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 bg-v-line rounded-full" />
        <div className="h-5 w-3/4 bg-v-line rounded-lg" />
        <div className="h-4 w-1/3 bg-v-line rounded-lg" />
        <div className="flex gap-4">
          <div className="h-3 w-20 bg-v-line rounded" />
          <div className="h-3 w-16 bg-v-line rounded" />
        </div>
      </div>
      <div className="shrink-0 flex sm:flex-col gap-2">
        <div className="h-10 w-20 bg-v-line rounded-xl" />
        <div className="h-10 w-20 bg-v-line rounded-xl" />
      </div>
    </div>
  );
}

export default function JobBoard({
  initialJobs,
  stats,
  initialCategory = "",
  initialSearch = "",
}: {
  initialJobs: Job[];
  stats: Stats;
  initialCategory?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"verified" | "unverified">("verified");
  const [category, setCategory] = useState(initialCategory);
  const [badge, setBadge] = useState("");
  const [includeUnconfirmed, setIncludeUnconfirmed] = useState(false);
  const [days, setDays] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page") || 1)));

  const [salaryThreshold, setSalaryThreshold] = useState(false);

  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // null = unknown (before first fetch), false = subscriber, true = free/capped
  const [isCapped, setIsCapped] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Reset page when filters change (but not on initial mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setPage(1);
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    const qs = params.toString();
    router.replace(`/jobs${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [category, badge, days, location, search, includeUnconfirmed, salaryThreshold, viewMode, router]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "graduate") params.set("category", category);
    if (viewMode === "unverified") {
      params.set("badge", "sponsor_not_verified");
    } else if (badge) {
      params.set("badge", badge);
    }
    if (days) params.set("days", days);
    if (location) params.set("location", location);
    if (search) params.set("search", search);
    if (salaryThreshold) params.set("salaryThreshold", "1");
    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) headers["authorization"] = `Bearer ${session.access_token}`;

      const r = await fetch(`/api/jobs?${params.toString()}`, { headers });
      const data = await r.json();
      let list: Job[] = data.jobs || [];
      if (category === "graduate") {
        list = list.filter((j) => /graduate|junior|trainee|entry/i.test(j.title || ""));
      }
      setJobs(list);
      setIsCapped(data.capped === true);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [category, badge, days, location, search, salaryThreshold, viewMode]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 350);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  async function subscribe() {
    if (honeypot) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setAlertMsg("Please enter a valid email address.");
      return;
    }
    setAlertMsg("…");
    try {
      const r = await fetch("/api/alerts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error();
      setAlertMsg("✓ Subscribed. Fresh sponsor jobs every morning.");
      setEmail("");
    } catch {
      setAlertMsg("Something went wrong — please try again.");
    }
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(next));
    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  }

  function guardFilter(fn: () => void) {
    if (isCapped === true) { setShowModal(true); return; }
    fn();
  }

  const statItems = [
    { n: stats.total, l: "Total jobs" },
    { n: stats.licensed_sponsor, l: "Licensed sponsors" },
    { n: stats.today, l: "New today" },
  ];

  // Unverified tab: server already filtered to sponsor_not_verified, show all.
  // Verified tab: sponsor_not_verified is never shown, regardless of other filters.
  const withBadge =
    viewMode === "unverified"
      ? jobs
      : badge !== ""
      ? jobs.filter((j) => j.badge !== "sponsor_not_verified")
      : includeUnconfirmed
      ? jobs.filter((j) => j.badge !== "sponsor_not_verified")
      : jobs.filter(
          (j) => j.badge === "sponsor_confirmed" || j.badge === "licensed_sponsor"
        );
  const filteredJobs = salaryThreshold
    ? withBadge.filter((j) => j.meets_general_threshold === "meets")
    : withBadge;

  const visibleJobs = filteredJobs.slice(0, page * PAGE_SIZE);
  const hasMore = visibleJobs.length < filteredJobs.length;

  // Build back-URL that encodes current filter state for "← Back to jobs" on detail pages
  const backQs = (() => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (search) p.set("search", search);
    if (days) p.set("days", days);
    if (location) p.set("location", location);
    if (badge) p.set("badge", badge);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  })();

  const controlCls =
    "bg-white border border-v-line rounded-xl px-3.5 py-2 text-[14px] font-medium text-v-ink focus:outline-none focus:border-violet transition-colors";

  return (
    <>
      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-5 pt-[120px] pb-8">
        <h1 className="font-jakarta font-extrabold text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] tracking-[-0.02em] max-w-2xl text-v-ink">
          UK jobs from{" "}
          <span className="text-violet">licensed visa sponsors.</span>
        </h1>
        <p className="mt-4 text-v-muted text-[17px] max-w-xl leading-relaxed">
          Every listing is checked against the Home Office sponsor register. We remove jobs that
          clearly say sponsorship is unavailable, and label the rest by sponsorship confidence.
        </p>

        {/* Stat cards */}
        <div className="mt-7 grid grid-cols-3 gap-3 max-w-xl">
          {statItems.map((item) => (
            <div
              key={item.l}
              className="bg-white border border-v-line rounded-[18px] px-5 py-4 shadow-[0_14px_44px_rgba(28,20,64,.07)]"
            >
              <div className="font-jakarta font-extrabold text-[1.9rem] text-violet leading-none">
                {item.n}
              </div>
              <div className="text-[12px] uppercase tracking-wide text-v-muted font-semibold mt-1">
                {item.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="max-w-5xl mx-auto px-5 sticky top-0 z-10 bg-v-bg/95 backdrop-blur-sm py-4 border-y border-v-line">
        {/* View mode tabs */}
        <div className="flex gap-1.5 p-1 bg-v-line/60 rounded-full w-fit mb-3">
          <button
            onClick={() => setViewMode("verified")}
            className={`px-4 py-1.5 text-[13.5px] font-jakarta font-semibold rounded-full transition-all duration-200 ${
              viewMode === "verified"
                ? "bg-white shadow text-violet"
                : "text-v-muted hover:text-v-ink"
            }`}
          >
            Verified sponsor jobs
          </button>
          <button
            onClick={() => setViewMode("unverified")}
            className={`px-4 py-1.5 text-[13.5px] font-jakarta font-semibold rounded-full transition-all duration-200 ${
              viewMode === "unverified"
                ? "bg-white shadow text-v-muted"
                : "text-v-muted hover:text-v-ink"
            }`}
          >
            Other UK jobs · sponsor not verified
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category tabs */}
          <div className="flex gap-1.5 p-1 bg-v-line/60 rounded-full">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  if (c.key === category) return;
                  guardFilter(() => setCategory(c.key));
                }}
                className={`px-3.5 py-1.5 text-[13.5px] font-jakarta font-semibold rounded-full transition-all duration-200 ${
                  category === c.key
                    ? "bg-white shadow text-violet"
                    : "text-v-muted hover:text-v-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Badge filter — only in verified mode */}
          {viewMode === "verified" && (
            <select
              className={controlCls}
              value={badge}
              onChange={(e) => guardFilter(() => setBadge(e.target.value))}
            >
              <option value="">All sponsor-safe jobs</option>
              <option value="licensed_sponsor">Licensed sponsor employer</option>
              <option value="sponsorship_mentioned">Sponsorship mentioned</option>
            </select>
          )}

          {/* Include unconfirmed — only in verified mode */}
          {viewMode === "verified" && (
            <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-v-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUnconfirmed}
                onChange={(e) => guardFilter(() => setIncludeUnconfirmed(e.target.checked))}
                className="rounded accent-violet"
              />
              Include unconfirmed
            </label>
          )}

          {/* Salary threshold */}
          <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-v-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={salaryThreshold}
              onChange={(e) => guardFilter(() => setSalaryThreshold(e.target.checked))}
              className="rounded accent-violet"
            />
            Salary meets threshold
          </label>

          {/* Days filter */}
          <select
            className={controlCls}
            value={days}
            onChange={(e) => guardFilter(() => setDays(e.target.value))}
          >
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>

          {/* Location */}
          <input
            className={`${controlCls} w-32 placeholder:text-v-muted/60`}
            placeholder="Location…"
            value={location}
            onChange={(e) => guardFilter(() => setLocation(e.target.value))}
          />

          {/* Search */}
          <input
            className={`${controlCls} w-44 placeholder:text-v-muted/60`}
            placeholder="Title or company…"
            value={search}
            onChange={(e) => guardFilter(() => setSearch(e.target.value))}
          />

          {/* Search button */}
          <button
            onClick={() => guardFilter(fetchJobs)}
            className="bg-violet text-white font-jakarta font-bold text-[14px] px-4 py-2 rounded-xl hover:bg-[#4a34d4] active:scale-[0.96] transition-all whitespace-nowrap"
          >
            Search
          </button>
        </div>

        <p className="mt-2 text-[12px] text-v-muted/60">
          Licensed sponsor means the employer appears on the official Home Office sponsor register.
          It does not guarantee sponsorship for this exact role.
        </p>
      </section>

      {/* ── UNVERIFIED WARNING ── */}
      {viewMode === "unverified" && (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-0">
          <div className="rounded-[14px] bg-v-amber-soft border border-v-amber/30 px-4 py-3.5 flex items-start gap-3 text-[13.5px] leading-snug text-v-ink">
            <span className="text-v-amber font-bold text-[17px] leading-none mt-0.5 shrink-0">⚠</span>
            <span>
              <strong className="font-semibold">These employers are NOT confirmed on the Home Office licensed sponsor register.</strong>{" "}
              Listings may mention sponsorship, but we cannot verify the employer&apos;s sponsor status. Always confirm directly with the employer before applying.
            </span>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="text-[13.5px] text-v-muted mb-4">
          {loading
            ? "Loading…"
            : `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"}`}
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-jakarta font-bold text-[1.5rem] text-v-muted">
              No jobs match those filters.
            </p>
            <p className="mt-2 text-v-muted/70">Try widening the time range or clearing the search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} back={backQs} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="font-jakarta font-bold text-[15px] px-8 py-3 rounded-xl border border-v-line bg-white text-v-ink hover:border-violet hover:text-violet transition-all duration-200"
                >
                  Load more ({filteredJobs.length - visibleJobs.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── PAYWALL BLOCK (free users, after 20 preview jobs) ── */}
      {isCapped === true && !loading && (
        <div className="max-w-5xl mx-auto px-5 mt-2 mb-8">
          <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-violet to-violet-2 px-8 py-10 text-center text-white">
            <div
              className="absolute w-[220px] h-[220px] rounded-full top-[-100px] right-[-70px] pointer-events-none"
              style={{ background: "rgba(255,255,255,0.12)", filter: "blur(10px)" }}
            />
            <div className="relative">
              <div className="font-jakarta font-extrabold text-[1.6rem] tracking-tight mb-2">
                Unlock 500+ verified sponsor jobs
              </div>
              <p className="opacity-85 text-[15px] mb-7 max-w-[380px] mx-auto">
                Browse every live sponsorship role, fully cross-checked — refreshed daily.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl bg-white text-violet hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
              >
                Unlock full access →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER GATE MODAL ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-[22px] shadow-[0_26px_70px_rgba(28,20,64,.22)] p-8 max-w-[380px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet to-violet-2 shadow-[0_6px_16px_rgba(91,67,232,0.4)] mb-5 text-white text-[18px]">
              ✦
            </div>
            <h2 className="font-jakarta font-extrabold text-[1.45rem] tracking-tight text-v-ink mb-2">
              Get your visa-sponsored job
            </h2>
            <p className="text-v-muted text-[15px] mb-7">
              Act smart, act fast — say bye to endless scrolling.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/pricing"
                className="block font-jakarta font-bold text-[15px] px-6 py-3.5 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
              >
                See plans
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="text-[14px] text-v-muted hover:text-v-ink transition-colors py-1"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL CAPTURE ── */}
      <section id="alerts" className="max-w-5xl mx-auto px-5 mt-10 mb-16">
        <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-br from-violet to-violet-2 px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          <div
            className="absolute w-[300px] h-[300px] rounded-full top-[-140px] right-[-100px] pointer-events-none"
            style={{ background: "rgba(255,255,255,0.12)", filter: "blur(10px)" }}
          />
          <div className="relative min-w-0">
            <h2 className="font-jakarta font-extrabold text-[1.9rem] leading-tight text-white">
              Get daily visa-sponsor job alerts
            </h2>
            <p className="mt-3 text-white/80">
              New sponsor-verified roles in your inbox every morning. Free, no spam.
            </p>
          </div>
          <div className="relative min-w-0">
            {/* Honeypot — hidden from humans, bots fill it in */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl px-4 py-3 text-v-ink placeholder:text-v-muted/60 bg-white border-0 outline-none font-medium"
              />
              <button
                onClick={subscribe}
                className="bg-white text-violet font-jakarta font-bold px-5 py-3 rounded-xl hover:bg-violet-tint active:scale-[0.96] transition-all shrink-0"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-[13px] text-white/80 h-5">{alertMsg}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-5xl mx-auto px-5 pt-8 pb-28 border-t border-v-line text-center text-[13px] text-v-muted/60">
        Sponsor data: Home Office register of licensed sponsors. Job data: Adzuna. Badges are
        guidance, not a guarantee — always confirm with the employer.
      </footer>
    </>
  );
}

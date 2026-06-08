"use client";

import { useEffect, useState, useCallback } from "react";
import type { Job, Stats } from "@/lib/types";
import JobCard from "./JobCard";

const CATS = [
  { key: "", label: "All" },
  { key: "IT", label: "IT" },
  { key: "care", label: "Care" },
  { key: "graduate", label: "Graduate" },
];

export default function JobBoard({
  initialJobs,
  stats,
}: {
  initialJobs: Job[];
  stats: Stats;
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [badge, setBadge] = useState("");
  const [includeUnconfirmed, setIncludeUnconfirmed] = useState(false);
  const [days, setDays] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "graduate") params.set("category", category);
    if (badge) params.set("badge", badge);
    if (days) params.set("days", days);
    if (location) params.set("location", location);
    if (search) params.set("search", search);
    try {
      const r = await fetch(`/api/jobs?${params.toString()}`);
      const data = await r.json();
      let list: Job[] = data.jobs || [];
      if (category === "graduate") {
        list = list.filter((j) => /graduate|junior|trainee|entry/i.test(j.title || ""));
      }
      setJobs(list);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [category, badge, days, location, search]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 350);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  async function subscribe() {
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

  const statItems = [
    { n: stats.total, l: "Total jobs" },
    { n: stats.licensed_sponsor, l: "Licensed sponsors" },
    { n: stats.today, l: "New today" },
  ];

  const displayJobs =
    badge !== ""
      ? jobs
      : includeUnconfirmed
      ? jobs
      : jobs.filter(
          (j) => j.badge === "licensed_sponsor" || j.badge === "sponsorship_mentioned"
        );

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
        <div className="flex flex-wrap items-center gap-2">
          {/* Category tabs */}
          <div className="flex gap-1.5 p-1 bg-v-line/60 rounded-full">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
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

          {/* Badge filter */}
          <select
            className={controlCls}
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          >
            <option value="">All sponsor-safe jobs</option>
            <option value="licensed_sponsor">Licensed sponsor employer</option>
            <option value="sponsorship_mentioned">Sponsorship mentioned</option>
          </select>

          {/* Include unconfirmed */}
          <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-v-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeUnconfirmed}
              onChange={(e) => setIncludeUnconfirmed(e.target.checked)}
              className="rounded accent-violet"
            />
            Include unconfirmed
          </label>

          {/* Days filter */}
          <select
            className={controlCls}
            value={days}
            onChange={(e) => setDays(e.target.value)}
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
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Search */}
          <input
            className={`${controlCls} w-44 placeholder:text-v-muted/60`}
            placeholder="Title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <p className="mt-2 text-[12px] text-v-muted/60">
          Licensed sponsor means the employer appears on the official Home Office sponsor register.
          It does not guarantee sponsorship for this exact role.
        </p>
      </section>

      {/* ── RESULTS ── */}
      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="text-[13.5px] text-v-muted mb-4">
          {loading ? "Loading…" : `${displayJobs.length} job${displayJobs.length === 1 ? "" : "s"}`}
        </div>

        {displayJobs.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="font-jakarta font-bold text-[1.5rem] text-v-muted">
              No jobs match those filters.
            </p>
            <p className="mt-2 text-v-muted/70">Try widening the time range or clearing the search.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {displayJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>

      {/* ── EMAIL CAPTURE ── */}
      <section id="alerts" className="max-w-5xl mx-auto px-5 mt-10 mb-16">
        <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-br from-violet to-violet-2 px-10 py-16 grid sm:grid-cols-2 gap-8 items-center">
          <div
            className="absolute w-[300px] h-[300px] rounded-full top-[-140px] right-[-100px] pointer-events-none"
            style={{ background: "rgba(255,255,255,0.12)", filter: "blur(10px)" }}
          />
          <div className="relative">
            <h2 className="font-jakarta font-extrabold text-[1.9rem] leading-tight text-white">
              Get daily visa-sponsor job alerts
            </h2>
            <p className="mt-3 text-white/80">
              New sponsor-verified roles in your inbox every morning. Free, no spam.
            </p>
          </div>
          <div className="relative">
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
                className="bg-white text-violet font-jakarta font-bold px-5 py-3 rounded-xl hover:bg-violet-tint transition-colors shrink-0"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-[13px] text-white/80 h-5">{alertMsg}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-5xl mx-auto px-5 py-8 border-t border-v-line text-center text-[13px] text-v-muted/60">
        Sponsor data: Home Office register of licensed sponsors. Job data: Adzuna. Badges are
        guidance, not a guarantee — always confirm with the employer.
      </footer>
    </>
  );
}

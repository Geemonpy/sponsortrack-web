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

  // email capture
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

  // refetch when filters change (debounced for text inputs)
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
    { n: stats.total, l: "Total jobs", c: "" },
    { n: stats.licensed_sponsor, l: "Licensed sponsors", c: "text-licensed" },
    { n: stats.today, l: "New today", c: "" },
  ];

  const displayJobs = badge !== ""
    ? jobs
    : includeUnconfirmed
    ? jobs
    : jobs.filter((j) => j.badge === "licensed_sponsor" || j.badge === "sponsorship_mentioned");

  const selectCls =
    "bg-card border border-ink/15 rounded-lg px-3 py-2 text-sm font-medium";

  return (
    <>
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-5 pt-10 pb-6">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-2xl">
          UK jobs from <span className="text-accent">licensed visa sponsors.</span>
        </h1>
        <p className="mt-4 text-ink/70 text-lg max-w-xl">
          Every listing is checked against the Home Office sponsor register. We remove jobs that
          clearly say sponsorship is unavailable, and label the rest by sponsorship confidence.
        </p>
        <div className="mt-7 grid grid-cols-3 gap-3 max-w-xl">
          {statItems.map((i) => (
            <div key={i.l} className="bg-card border border-ink/10 rounded-xl px-4 py-3">
              <div className={`font-display font-extrabold text-2xl ${i.c}`}>{i.n}</div>
              <div className="text-xs uppercase tracking-wide text-ink/45 font-semibold">{i.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-5xl mx-auto px-5 sticky top-0 z-10 bg-parchment/95 backdrop-blur py-4 border-y border-ink/10">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5 p-1 bg-ink/5 rounded-full">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition ${
                  category === c.key ? "bg-card shadow text-accent" : "text-ink/55"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <select className={selectCls} value={badge} onChange={(e) => setBadge(e.target.value)}>
            <option value="">All sponsor-safe jobs</option>
            <option value="licensed_sponsor">🟡 Licensed sponsor employer</option>
            <option value="sponsorship_mentioned">🔵 Sponsorship mentioned</option>
          </select>

          <label className="flex items-center gap-1.5 text-sm font-medium text-ink/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeUnconfirmed}
              onChange={(e) => setIncludeUnconfirmed(e.target.checked)}
              className="rounded"
            />
            Include unconfirmed
          </label>

          <select className={selectCls} value={days} onChange={(e) => setDays(e.target.value)}>
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>

          <input
            className={`${selectCls} w-32 placeholder-ink/40`}
            placeholder="Location…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            className={`${selectCls} w-44 placeholder-ink/40`}
            placeholder="Title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="mt-2 text-xs text-ink/40">
          Licensed sponsor means the employer appears on the official Home Office sponsor register. It does not guarantee sponsorship for this exact role.
        </p>
      </section>

      {/* RESULTS */}
      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="text-sm text-ink/50 mb-4">
          {loading ? "Loading…" : `${displayJobs.length} job${displayJobs.length === 1 ? "" : "s"}`}
        </div>
        {displayJobs.length === 0 && !loading ? (
          <div className="text-center py-20 text-ink/50">
            <p className="font-display text-2xl text-ink/70">No jobs match those filters.</p>
            <p className="mt-1">Try widening the time range or clearing the search.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {displayJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>

      {/* EMAIL CAPTURE */}
      <section id="alerts" className="bg-accent text-parchment mt-10">
        <div className="max-w-5xl mx-auto px-5 py-14 grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display font-extrabold text-3xl leading-tight">
              Get daily visa-sponsor job alerts
            </h2>
            <p className="mt-3 text-parchment/80">
              New sponsor-verified roles in your inbox every morning. Free, no spam.
            </p>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg px-4 py-3 text-ink placeholder-ink/40 border-0"
              />
              <button
                onClick={subscribe}
                className="bg-ink text-parchment font-semibold px-5 py-3 rounded-lg hover:bg-ink/85 transition"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-sm text-parchment/90 h-5">{alertMsg}</p>
          </div>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-5 py-8 text-center text-sm text-ink/40">
        Sponsor data: Home Office register of licensed sponsors. Job data: Adzuna. Badges are
        guidance, not a guarantee — always confirm with the employer.
      </footer>
    </>
  );
}

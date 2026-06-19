"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/landing/Nav";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = [
  { value: "IT", label: "IT" },
  { value: "care", label: "Care" },
];

interface Prefs {
  categories: string[];
  keyword: string;
  location: string;
  is_active: boolean;
}

const DEFAULT_PREFS: Prefs = {
  categories: [],
  keyword: "",
  location: "",
  is_active: true,
};

export default function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const r = await fetch("/api/alerts/preferences", {
        headers: { authorization: `Bearer ${session.access_token}` },
      });
      const data = await r.json();
      setTier(data.tier ?? null);
      if (data.preferences) {
        setPrefs({
          categories: data.preferences.categories ?? [],
          keyword: data.preferences.keyword ?? "",
          location: data.preferences.location ?? "",
          is_active: data.preferences.is_active ?? true,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleCategory(val: string) {
    setPrefs((p) => ({
      ...p,
      categories: p.categories.includes(val)
        ? p.categories.filter((c) => c !== val)
        : [...p.categories, val],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError("");

    const { data: { session } } = await supabaseBrowser.auth.getSession();
    if (!session) {
      setSaveError("Session expired — please sign in again.");
      setSaving(false);
      return;
    }

    const r = await fetch("/api/alerts/preferences", {
      method: "POST",
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(prefs),
    });

    if (r.ok) {
      setSaved(true);
    } else {
      const d = await r.json().catch(() => ({}));
      setSaveError(d.error ?? "Something went wrong — please try again.");
    }
    setSaving(false);
  }

  const inputCls =
    "w-full bg-v-bg border border-v-line rounded-[10px] px-4 py-3 text-[15px] text-v-ink placeholder:text-v-muted/60 focus:outline-none focus:border-violet transition-colors";

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <div className="flex items-center justify-center min-h-screen px-5 pt-24 pb-16">
        <div className="w-full max-w-[480px]">
          <h1 className="font-jakarta font-extrabold text-[1.9rem] tracking-tight text-v-ink mb-8 text-center">
            Job alert preferences
          </h1>

          {loading ? (
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 text-center text-v-muted">
              Loading…
            </div>

          ) : !user ? (
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 text-center">
              <p className="text-v-muted text-[15px] mb-6">
                Please sign in to manage your job alert preferences.
              </p>
              <Link
                href="/login?next=/alerts"
                className="inline-block font-jakarta font-bold text-[15px] px-6 py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign in
              </Link>
            </div>

          ) : tier !== "alerts" ? (
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet to-violet-2 shadow-[0_6px_16px_rgba(91,67,232,0.4)] mb-5 text-white text-[18px]">
                ✦
              </div>
              <h2 className="font-jakarta font-extrabold text-[1.3rem] tracking-tight text-v-ink mb-2">
                Alerts are a premium feature
              </h2>
              <p className="text-v-muted text-[15px] mb-7">
                Email alerts are included in the <strong>Job Access + Alerts</strong> plan
                at £10.99/month. Get notified the moment matching sponsor jobs go live.
              </p>
              <Link
                href="/pricing"
                className="inline-block font-jakarta font-bold text-[15px] px-6 py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
              >
                See plans →
              </Link>
            </div>

          ) : (
            <form
              onSubmit={handleSave}
              className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 space-y-6"
            >
              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-jakarta font-bold text-[15px] text-v-ink">Alerts active</div>
                  <div className="text-[13px] text-v-muted mt-0.5">Pause or resume your daily digest.</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.is_active}
                  onClick={() => setPrefs((p) => ({ ...p, is_active: !p.is_active }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2 ${
                    prefs.is_active ? "bg-violet" : "bg-v-line"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                      prefs.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-v-line" />

              {/* Categories */}
              <div>
                <div className="font-jakarta font-bold text-[15px] text-v-ink mb-1">Categories</div>
                <p className="text-[13px] text-v-muted mb-3">
                  Tick the sectors you want alerts for. Leave both unticked to receive all categories.
                </p>
                <div className="flex flex-wrap gap-4">
                  {CATEGORIES.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer select-none text-[14px] font-medium text-v-ink"
                    >
                      <input
                        type="checkbox"
                        checked={prefs.categories.includes(value)}
                        onChange={() => toggleCategory(value)}
                        className="rounded accent-violet w-4 h-4"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-v-line" />

              {/* Keyword */}
              <div>
                <label className="block font-jakarta font-bold text-[15px] text-v-ink mb-1">
                  Keyword{" "}
                  <span className="font-normal text-v-muted text-[14px]">(optional)</span>
                </label>
                <p className="text-[13px] text-v-muted mb-2">
                  Only send jobs whose title or company matches this word, e.g. nurse, developer.
                </p>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="e.g. nurse"
                  value={prefs.keyword}
                  onChange={(e) => setPrefs((p) => ({ ...p, keyword: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-jakarta font-bold text-[15px] text-v-ink mb-1">
                  Location{" "}
                  <span className="font-normal text-v-muted text-[14px]">(optional)</span>
                </label>
                <p className="text-[13px] text-v-muted mb-2">
                  Filter by city or region, e.g. London, Manchester.
                </p>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="e.g. London"
                  value={prefs.location}
                  onChange={(e) => setPrefs((p) => ({ ...p, location: e.target.value }))}
                />
              </div>

              {/* Feedback */}
              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-2.5 text-[13.5px] text-red-600">
                  {saveError}
                </div>
              )}
              {saved && (
                <div className="bg-v-green-soft border border-v-green/30 rounded-[10px] px-4 py-3 text-[13.5px] text-v-green text-center">
                  ✓ Preferences saved.
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full font-jakarta font-bold text-[15px] py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? "Saving…" : "Save preferences"}
              </button>

              <p className="text-center text-[13px] text-v-muted">
                Alerts are sent to <strong>{user.email}</strong>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

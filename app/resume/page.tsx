"use client";

import { useRef, useState } from "react";
import Nav from "@/components/landing/Nav";
import type { ResumeResult } from "@/app/api/resume/route";

// ── Score colour thresholds ────────────────────────────────────────────────
function scoreColor(n: number) {
  if (n >= 80) return { text: "text-v-green", ring: "border-v-green", bg: "bg-v-green-soft" };
  if (n >= 60) return { text: "text-violet",  ring: "border-violet",  bg: "bg-violet-soft" };
  if (n >= 40) return { text: "text-v-amber",  ring: "border-v-amber",  bg: "bg-v-amber-soft" };
  return         { text: "text-red-500",       ring: "border-red-300",  bg: "bg-red-50" };
}

function scoreLabel(n: number) {
  if (n >= 80) return "Strong match";
  if (n >= 60) return "Good fit";
  if (n >= 40) return "Partial match";
  return "Weak match";
}

// ── Icon helpers ──────────────────────────────────────────────────────────
function GapIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="17" height="17" className="shrink-0 mt-0.5" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#FEF3DA"/>
      <path d="M10 6v4M10 13.5v.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function ImpIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="17" height="17" className="shrink-0 mt-0.5" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#EEEBFE"/>
      <path d="M10 5v6M7 8l3-3 3 3" stroke="#5B43E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const TEXTAREA = "w-full bg-v-bg border border-v-line rounded-[10px] px-4 py-3 text-[14.5px] text-v-ink placeholder:text-v-muted/60 focus:outline-none focus:border-violet transition-colors resize-none font-sans";

export default function ResumePage() {
  const [cv, setCv] = useState("");
  const [jd, setJd] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCv(String(ev.target?.result ?? ""));
    reader.readAsText(file);
  }

  async function analyse() {
    if (!cv.trim() || !jd.trim()) {
      setError("Please paste both your CV and the job description.");
      return;
    }
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cv, jd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data as ResumeResult);
      // Scroll to results after render
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyTailored() {
    if (!result?.tailored_cv) return;
    await navigator.clipboard.writeText(result.tailored_cv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sc = result ? scoreColor(result.score) : null;

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-5 pt-[120px] pb-10">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet to-violet-2 text-white font-jakarta font-bold text-[12px] px-3.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(91,67,232,0.3)]">
            ★ Pro feature
          </span>
        </div>
        <h1 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,5vw,3rem)] mb-4">
          AI Resume <span className="text-violet">Tailoring</span>
        </h1>
        <p className="text-v-muted text-[17px] max-w-[560px] leading-relaxed">
          Paste your CV and a job description. The AI analyses your match, spots gaps, and rewrites
          your CV to give this specific role the best possible shot.
        </p>
      </section>

      {/* ── INPUT FORM ── */}
      <section className="max-w-4xl mx-auto px-5 pb-10">
        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7 sm:p-9">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CV */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="font-jakarta font-bold text-[15px] text-v-ink">Your CV</label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-[13px] text-violet font-semibold hover:underline"
                >
                  Upload .txt file
                </button>
                <input ref={fileRef} type="file" accept=".txt" className="hidden" onChange={handleFile} />
              </div>
              <textarea
                value={cv}
                onChange={(e) => setCv(e.target.value)}
                placeholder="Paste your CV text here…"
                rows={14}
                className={TEXTAREA}
              />
              <p className="text-[12px] text-v-muted/70">Paste plain text or upload a .txt file. PDF/Word: copy-paste the text.</p>
            </div>

            {/* JD */}
            <div className="flex flex-col gap-3">
              <label className="font-jakarta font-bold text-[15px] text-v-ink">Job Description</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here…"
                rows={14}
                className={TEXTAREA}
              />
              <p className="text-[12px] text-v-muted/70">Include the full listing — requirements, responsibilities, and any visa sponsorship note.</p>
            </div>
          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 text-[14px] text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={analyse}
              disabled={busy}
              className="w-full sm:w-auto font-jakarta font-bold text-[15px] px-8 py-3.5 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 flex items-center gap-2"
            >
              {busy ? (
                <>
                  <svg className="animate-spin" viewBox="0 0 20 20" fill="none" width="17" height="17">
                    <circle cx="10" cy="10" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/>
                    <path d="M10 3a7 7 0 0 1 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Analysing…
                </>
              ) : (
                "Analyse & tailor →"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      {result && (
        <section ref={resultsRef} className="max-w-4xl mx-auto px-5 pb-20 space-y-5">
          {/* Score + summary */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
            {/* Score ring */}
            <div className={`bg-white border-2 ${sc!.ring} rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7 flex flex-col items-center justify-center min-w-[160px] text-center`}>
              <div className={`font-jakarta font-extrabold text-[3.5rem] leading-none ${sc!.text}`}>
                {result.score}
              </div>
              <div className="text-[12px] font-jakarta font-bold uppercase tracking-wide text-v-muted mt-1">/100 match</div>
              <div className={`mt-3 text-[13px] font-semibold px-3 py-1 rounded-full ${sc!.bg} ${sc!.text}`}>
                {scoreLabel(result.score)}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7 flex flex-col justify-center">
              <div className="text-violet font-jakarta font-bold text-[13px] uppercase tracking-wide mb-2">Overall assessment</div>
              <p className="text-[15.5px] text-v-ink leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {/* Gaps + Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7">
              <div className="font-jakarta font-bold text-[15px] text-v-ink mb-4">Key gaps</div>
              <ul className="space-y-3">
                {result.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-v-ink">
                    <GapIcon /> {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7">
              <div className="font-jakarta font-bold text-[15px] text-v-ink mb-4">Suggested improvements</div>
              <ul className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-v-ink">
                    <ImpIcon /> {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tailored CV */}
          <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="font-jakarta font-bold text-[15px] text-v-ink">Tailored CV</div>
              <button
                onClick={copyTailored}
                className="flex items-center gap-1.5 text-[13.5px] font-semibold text-violet border border-violet/30 px-3.5 py-1.5 rounded-lg hover:bg-violet-soft transition-colors"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="none" width="15" height="15"><path d="M4 10.5l3.5 3.5 8.5-8.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="none" width="15" height="15"><rect x="7" y="7" width="10" height="10" rx="2" stroke="#5B43E8" strokeWidth="1.6"/><path d="M4 13V4a1 1 0 0 1 1-1h9" stroke="#5B43E8" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-[14px] text-v-ink leading-relaxed font-sans bg-v-bg rounded-[12px] p-5 max-h-[500px] overflow-y-auto thin-scroll">
              {result.tailored_cv}
            </pre>
          </div>

          {/* Re-analyse nudge */}
          <p className="text-center text-[13.5px] text-v-muted pt-2">
            Not quite right?{" "}
            <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-violet font-semibold hover:underline">
              Edit your inputs and try again.
            </button>
          </p>
        </section>
      )}
    </div>
  );
}

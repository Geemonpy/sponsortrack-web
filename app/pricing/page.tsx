import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Get full access to every sponsor-checked UK job. Act fast with email alerts and AI resume tailoring.",
  alternates: { canonical: "/pricing" },
};

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18" className="shrink-0 mt-0.5" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#DCFCEF" />
      <path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const jobAccessFeatures = [
  "500+ sponsor-verified UK jobs",
  "Filter by sector, badge & location",
  "Daily-refreshed listings",
  "Cross-checked against the Home Office register",
  "UK visa & sponsorship guidance",
];

const proFeatures = [
  "Everything in Job Access",
  "Email alerts when new matching jobs land",
  "Be the first to apply — act before others",
  "AI Resume Tailoring tool",
  "Match score & gap analysis per role",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      {/* ── HERO ── */}
      <section className="pt-[130px] pb-[70px] text-center px-5">
        <div className="inline-flex items-center gap-2 bg-white border border-v-line shadow-[0_14px_44px_rgba(28,20,64,.07)] px-4 py-[9px] rounded-full text-[14px] font-semibold text-violet mb-6">
          <span className="text-violet-2">✦</span> Simple, transparent pricing
        </div>
        <h1 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,5.5vw,3.8rem)] max-w-[700px] mx-auto mb-5">
          Every verified sponsor job.<br />
          <span className="text-violet">Act before the crowd.</span>
        </h1>
        <p className="text-v-muted text-[18px] max-w-[540px] mx-auto">
          500+ sponsor-checked jobs, refreshed daily. Upgrade to Pro for instant email alerts
          and our AI resume tailoring tool — so you apply first with the strongest CV.
        </p>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="max-w-4xl mx-auto px-5 pb-[90px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Job Access */}
          <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 flex flex-col">
            <div className="mb-6">
              <h2 className="font-jakarta font-extrabold text-[1.25rem] text-v-ink mb-1">Job Access</h2>
              <p className="text-v-muted text-[14.5px]">Full access to every sponsor-checked listing.</p>
            </div>

            <div className="mb-7">
              <span className="font-jakarta font-extrabold text-[2.8rem] text-v-ink leading-none">£6.99</span>
              <span className="text-v-muted text-[16px] ml-1.5">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {jobAccessFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-v-ink">
                  <Check /> {f}
                </li>
              ))}
            </ul>

            {/* TODO: Stripe Checkout — replace this Link with a call to createCheckoutSession({ plan: "job-access" }) */}
            <Link
              href="/checkout?plan=job-access"
              className="block text-center font-jakarta font-bold text-[15px] px-6 py-3.5 rounded-xl border-2 border-violet text-violet hover:bg-violet hover:text-white active:scale-[0.96] transition-all duration-200"
            >
              Get Job Access
            </Link>
          </div>

          {/* Pro */}
          <div className="relative bg-white border-2 border-violet rounded-[22px] shadow-[0_26px_70px_rgba(91,67,232,0.18)] p-8 flex flex-col">
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet to-violet-2 text-white font-jakarta font-bold text-[12px] px-4 py-1.5 rounded-full shadow-[0_6px_16px_rgba(91,67,232,0.35)]">
                <span>★</span> Most popular
              </span>
            </div>

            <div className="mb-6 mt-2">
              <h2 className="font-jakarta font-extrabold text-[1.25rem] text-v-ink mb-1">Pro</h2>
              <p className="text-v-muted text-[14.5px]">First-mover advantage + AI-powered applications.</p>
            </div>

            <div className="mb-7">
              <span className="font-jakarta font-extrabold text-[2.8rem] text-v-ink leading-none">£9.99</span>
              <span className="text-v-muted text-[16px] ml-1.5">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {proFeatures.map((f, i) => (
                <li key={f} className={`flex items-start gap-2.5 text-[15px] ${i === 0 ? "font-semibold text-violet" : "text-v-ink"}`}>
                  <Check /> {f}
                </li>
              ))}
            </ul>

            {/* TODO: Stripe Checkout — replace this Link with a call to createCheckoutSession({ plan: "pro" }) */}
            <Link
              href="/checkout?plan=pro"
              className="block text-center font-jakarta font-bold text-[15px] px-6 py-3.5 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
            >
              Go Pro
            </Link>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-v-muted text-[14px] mt-8">
          Cancel any time. No hidden fees. Secure payments via Stripe.{" "}
          <Link href="/contact" className="text-violet hover:underline">Questions? Contact us.</Link>
        </p>
      </section>

      {/* ── FEATURE COMPARISON ── */}
      <section className="max-w-4xl mx-auto px-5 pb-[90px]">
        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] overflow-hidden">
          <div className="grid grid-cols-3 gap-0 text-center">
            <div className="p-5 border-b border-v-line" />
            <div className="p-5 border-b border-l border-v-line">
              <div className="font-jakarta font-bold text-[15px] text-v-ink">Job Access</div>
              <div className="text-v-muted text-[13px]">£6.99/mo</div>
            </div>
            <div className="p-5 border-b border-l border-v-line bg-violet-tint">
              <div className="font-jakarta font-bold text-[15px] text-violet">Pro</div>
              <div className="text-v-muted text-[13px]">£9.99/mo</div>
            </div>
          </div>
          {[
            ["Sponsor-verified job listings", true, true],
            ["Daily-refreshed database", true, true],
            ["Sector & badge filters", true, true],
            ["UK visa guidance", true, true],
            ["Email alerts for new jobs", false, true],
            ["AI Resume Tailoring", false, true],
            ["Match score & gap analysis", false, true],
            ["Priority support", false, true],
          ].map(([label, basic, pro], i) => (
            <div key={String(label)} className={`grid grid-cols-3 text-center ${i % 2 === 0 ? "" : "bg-[#FAFAFA]"}`}>
              <div className="p-4 text-left text-[14px] font-medium text-v-ink border-b border-v-line pl-6">{label as string}</div>
              <div className="p-4 border-b border-l border-v-line flex items-center justify-center">
                {basic ? (
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="10" cy="10" r="10" fill="#DCFCEF"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span className="text-v-muted/40 text-lg">—</span>
                )}
              </div>
              <div className="p-4 border-b border-l border-v-line bg-violet-tint flex items-center justify-center">
                {pro ? (
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="10" cy="10" r="10" fill="#DCFCEF"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span className="text-v-muted/40 text-lg">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="max-w-4xl mx-auto px-5 pb-[90px]">
        <div className="relative rounded-[26px] overflow-hidden bg-gradient-to-br from-violet to-violet-2 px-10 py-16 text-center text-white">
          <div className="absolute w-[300px] h-[300px] rounded-full top-[-150px] right-[-100px] pointer-events-none" style={{ background: "rgba(255,255,255,0.12)", filter: "blur(10px)" }} />
          <h2 className="font-jakarta font-extrabold text-[clamp(1.8rem,4vw,2.6rem)] tracking-tight mb-3 relative">
            Stop missing sponsored roles.
          </h2>
          <p className="opacity-90 text-[17px] mb-8 max-w-[460px] mx-auto relative">
            Every listing is cross-checked against the Home Office register before you ever see it.
            No wasted applications.
          </p>
          {/* TODO: Stripe Checkout — replace Link with checkout action */}
          <Link
            href="/checkout?plan=pro"
            className="inline-flex items-center gap-2 font-jakarta font-bold text-[16px] px-8 py-4 rounded-xl bg-white text-violet hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 relative"
          >
            Go Pro — £9.99/month →
          </Link>
        </div>
      </section>
    </div>
  );
}

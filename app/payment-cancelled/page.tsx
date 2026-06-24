import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <section className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
        <div className="w-full max-w-[480px] bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-10 text-center">

          {/* Neutral pause icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2" />
                <line x1="9" y1="8.5" x2="9" y2="15.5" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="15" y1="8.5" x2="15" y2="15.5" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1 className="font-jakarta font-extrabold text-[1.75rem] tracking-tight text-v-ink mb-3">
            Checkout cancelled
          </h1>

          <p className="text-v-muted text-[15.5px] leading-relaxed mb-8">
            No payment was taken and you haven&apos;t been charged. You can pick a plan whenever you&apos;re ready.
          </p>

          {/* Primary CTA */}
          <Link
            href="/pricing"
            className="block w-full font-jakarta font-bold text-[15px] px-5 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 mb-4"
          >
            View plans
          </Link>

          {/* Secondary text link */}
          <Link
            href="/jobs"
            className="block w-full font-jakarta font-bold text-[14.5px] px-5 py-3 rounded-xl border-2 border-violet text-violet hover:bg-violet hover:text-white active:scale-[0.96] transition-all duration-200"
          >
            Keep browsing free jobs
          </Link>

        </div>
      </section>
    </div>
  );
}

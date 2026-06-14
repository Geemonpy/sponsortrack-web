import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

// TODO: Stripe Checkout — replace this page with a real checkout session

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
        <div className="w-full max-w-[460px] text-center">
          <div className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-[18px] bg-gradient-to-br from-violet to-violet-2 shadow-[0_10px_28px_rgba(91,67,232,0.35)] mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="28" height="28">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>

          <h1 className="font-jakarta font-extrabold text-[2rem] tracking-tight text-v-ink mb-3">
            Checkout coming soon
          </h1>
          <p className="text-v-muted text-[16px] leading-relaxed mb-8">
            We&apos;re setting up secure payments. In the meantime, all sponsor-checked jobs
            are free to browse — no account needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/jobs"
              className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse jobs →
            </Link>
            <Link
              href="/contact"
              className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl border border-v-line bg-white text-v-ink hover:border-violet hover:text-violet transition-all duration-200"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

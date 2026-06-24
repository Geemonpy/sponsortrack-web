import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Payment successful",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <section className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
        <div className="w-full max-w-[480px] bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-10 text-center">

          {/* Checkmark icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-v-green-soft flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="font-jakarta font-extrabold text-[1.75rem] tracking-tight text-v-ink mb-3">
            You&apos;re in! 🎉
          </h1>

          <p className="text-v-muted text-[15.5px] leading-relaxed mb-8">
            Your payment was successful and your subscription is now active.
            You have full access to every sponsor-checked listing.
          </p>

          {/* Primary CTA */}
          <Link
            href="/jobs"
            className="block w-full font-jakarta font-bold text-[15px] px-5 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 mb-4"
          >
            Browse jobs →
          </Link>

          {/* Secondary link */}
          <Link
            href="/billing"
            className="block w-full font-jakarta font-bold text-[14.5px] px-5 py-3 rounded-xl border-2 border-violet text-violet hover:bg-violet hover:text-white active:scale-[0.96] transition-all duration-200 mb-6"
          >
            Manage your subscription
          </Link>

          <p className="text-v-muted text-[13px]">
            A receipt has been sent to your email.
          </p>

        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribeClient({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUnsubscribe() {
    setLoading(true);
    await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-v-green-soft text-v-green text-[22px] mb-1">
          ✓
        </div>
        <h2 className="font-jakarta font-extrabold text-[1.3rem] tracking-tight text-v-ink">
          You&apos;ve been unsubscribed
        </h2>
        <p className="text-v-muted text-[15px] leading-relaxed">
          You won&apos;t receive any more job alert emails from SponsorRoute.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 font-jakarta font-bold text-[14px] text-violet hover:underline"
        >
          ← Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-violet-soft text-violet text-[22px] mb-4">
          ✉
        </div>
        <h2 className="font-jakarta font-extrabold text-[1.3rem] tracking-tight text-v-ink mb-2">
          Unsubscribe from job alerts
        </h2>
        <p className="text-v-muted text-[15px] leading-relaxed">
          This will stop all job alert emails sent to{" "}
          <strong className="text-v-ink">{email}</strong>.
        </p>
      </div>

      <button
        onClick={handleUnsubscribe}
        disabled={loading}
        className="w-full font-jakarta font-bold text-[15px] py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? "Processing…" : "Yes, unsubscribe me from job alerts"}
      </button>

      <p className="text-center text-[13px] text-v-muted">
        Changed your mind? You can re-enable alerts from{" "}
        <Link href="/alerts" className="text-violet hover:underline">
          your alerts settings
        </Link>
        .
      </p>
    </div>
  );
}

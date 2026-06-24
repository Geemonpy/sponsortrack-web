"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/landing/Nav";
import { supabaseBrowser } from "@/lib/supabaseClient";

type PageState = "loading" | "unauthenticated" | "no-subscription" | "ready";

export default function BillingPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [accessToken, setAccessToken] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) {
        setPageState("unauthenticated");
        return;
      }
      setAccessToken(session.access_token);
      setPageState("ready");
    }
    init();
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.status === 404) {
        setPageState("no-subscription");
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <section className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
        <div className="w-full max-w-[480px] bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-10 text-center">

          {pageState === "loading" && (
            <p className="text-v-muted text-[16px]">Loading…</p>
          )}

          {pageState === "unauthenticated" && (
            <>
              <h1 className="font-jakarta font-extrabold text-[1.75rem] tracking-tight text-v-ink mb-3">
                Sign in required
              </h1>
              <p className="text-v-muted text-[15.5px] leading-relaxed mb-8">
                Please sign in to manage your subscription.
              </p>
              <Link
                href="/login"
                className="block w-full font-jakarta font-bold text-[15px] px-5 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
              >
                Sign in
              </Link>
            </>
          )}

          {pageState === "no-subscription" && (
            <>
              <h1 className="font-jakarta font-extrabold text-[1.75rem] tracking-tight text-v-ink mb-3">
                No active subscription
              </h1>
              <p className="text-v-muted text-[15.5px] leading-relaxed mb-8">
                You don&apos;t have an active subscription yet.
              </p>
              <Link
                href="/pricing"
                className="block w-full font-jakarta font-bold text-[15px] px-5 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
              >
                View plans
              </Link>
            </>
          )}

          {pageState === "ready" && (
            <>
              <h1 className="font-jakarta font-extrabold text-[1.75rem] tracking-tight text-v-ink mb-3">
                Manage your subscription
              </h1>
              <p className="text-v-muted text-[15.5px] leading-relaxed mb-8">
                Update your payment method, view invoices, or cancel your plan.
              </p>

              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="block w-full font-jakarta font-bold text-[15px] px-5 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {portalLoading ? "Opening portal…" : "Open billing portal"}
              </button>

              {error && (
                <p className="mt-4 text-[13.5px] text-red-500">{error}</p>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
}

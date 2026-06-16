"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "@/components/landing/Nav";
import { supabaseBrowser } from "@/lib/supabaseClient";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) return;

    async function fire() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();

      if (!session) {
        router.replace(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
        return;
      }

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    fire();
  }, [plan, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
      <div className="w-full max-w-[400px] text-center">
        {error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push("/pricing")}
              className="font-jakarta font-bold text-[15px] px-6 py-3 rounded-xl bg-violet text-white hover:bg-[#4a34d4] transition-all"
            >
              Back to pricing
            </button>
          </>
        ) : (
          <p className="text-v-muted text-[16px]">Preparing your checkout…</p>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-v-muted text-[16px]">Loading…</p>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}

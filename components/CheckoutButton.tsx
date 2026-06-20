"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function CheckoutButton({
  plan,
  children,
  className,
}: {
  plan: string;
  children: React.ReactNode;
  className: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [consented, setConsented] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    const { data: { session } } = await supabaseBrowser.auth.getSession();

    if (!session) {
      router.push(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
      return;
    }

    setSessionToken(session.access_token);
    setLoading(false);
    setConsented(false);
    setShowConsent(true);
  }

  async function proceed() {
    if (!consented || !sessionToken) return;
    setLoading(true);
    setShowConsent(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Redirecting…" : children}
      </button>

      {showConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(28,20,64,0.45)" }}>
          <div className="bg-white rounded-[22px] shadow-[0_26px_70px_rgba(28,20,64,.22)] p-8 max-w-[480px] w-full font-sans">
            <h2 className="font-jakarta font-extrabold text-[1.2rem] text-v-ink mb-2">Before you continue</h2>
            <p className="text-v-muted text-[14.5px] mb-6 leading-relaxed">
              This is a digital subscription with immediate access. Please confirm the following before proceeding to payment.
            </p>

            <label className="flex items-start gap-3 cursor-pointer group mb-6">
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#5B43E8] shrink-0 cursor-pointer"
              />
              <span className="text-[14px] text-v-ink leading-relaxed">
                I agree to immediate access to the digital service and understand I waive my 14-day right to cancel once access begins. I accept the{" "}
                <Link href="/terms" target="_blank" className="text-violet hover:underline font-semibold">Terms</Link>
                {" "}and{" "}
                <Link href="/refund" target="_blank" className="text-violet hover:underline font-semibold">Refund Policy</Link>.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowConsent(false); setConsented(false); }}
                className="flex-1 font-jakarta font-semibold text-[14px] py-3 rounded-xl border border-v-line text-v-muted hover:border-v-ink hover:text-v-ink transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={proceed}
                disabled={!consented}
                className="flex-1 font-jakarta font-bold text-[14px] py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
              >
                Proceed to payment →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

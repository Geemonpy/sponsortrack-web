"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/landing/Nav";
import { supabaseBrowser } from "@/lib/supabaseClient";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in both fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setBusy(true);
    setError("");
    const { error: err } = await supabaseBrowser.auth.signUp({ email, password });
    if (err) {
      const msg = err.message.toLowerCase();
      setError(
        msg.includes("already") || msg.includes("registered")
          ? "An account with this email already exists. Try signing in."
          : err.message
      );
      setBusy(false);
    } else {
      setDone(true);
    }
  }

  async function handleGoogle() {
    setError("");
    const { error: err } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (err) setError(err.message);
  }

  const inputCls =
    "w-full bg-v-bg border border-v-line rounded-[10px] px-4 py-3 text-[15px] text-v-ink placeholder:text-v-muted/60 focus:outline-none focus:border-violet transition-colors";

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <div className="flex items-center justify-center min-h-screen px-5 pt-20 pb-10">
        <div className="w-full max-w-[420px]">
          {/* Logo mark */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 font-jakarta font-extrabold text-[22px]">
              <span className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-violet to-violet-2 flex items-center justify-center text-white text-[19px] shadow-[0_6px_16px_rgba(91,67,232,0.4)]">S</span>
              Sponsor<span className="text-violet">Route</span>
            </div>
          </div>

          {done ? (
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-v-green-soft flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h2 className="font-jakarta font-extrabold text-[1.4rem] text-v-ink mb-2">Check your inbox</h2>
              <p className="text-v-muted text-[15px]">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then{" "}
                <Link href="/login" className="text-violet font-semibold hover:underline">sign in</Link>.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8">
              <h1 className="font-jakarta font-extrabold text-[1.7rem] tracking-tight text-v-ink mb-1">Create account</h1>
              <p className="text-v-muted text-[15px] mb-6">Get daily job alerts and save your searches.</p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-v-line rounded-[10px] px-4 py-3 text-[15px] font-semibold text-v-ink bg-white hover:bg-v-bg transition-colors mb-5"
              >
                <GoogleIcon /> Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-v-line" />
                <span className="text-[13px] text-v-muted">or</span>
                <div className="flex-1 h-px bg-v-line" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputCls}
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={inputCls}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-2.5 text-[13.5px] text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full font-jakarta font-bold text-[15px] py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-1"
                >
                  {busy ? "Creating account…" : "Create account"}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-[14px] text-v-muted mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-violet font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

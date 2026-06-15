"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Nav() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => { setMobileOpen(false); }, []);

  function openAssistant() {
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent("open-assistant"));
  }

  async function signOut() {
    setMobileOpen(false);
    await supabaseBrowser.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const linkCls = "block text-[16px] text-v-muted font-medium hover:text-v-ink transition-colors py-2";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-7 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[rgba(251,250,254,0.85)] backdrop-blur-[14px] shadow-[0_1px_0_#ECEAF3]"
            : "py-[18px]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 font-jakarta font-extrabold text-[21px] text-v-ink no-underline"
        >
          <span className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet to-violet-2 flex items-center justify-center text-white text-[18px] shadow-[0_6px_16px_rgba(91,67,232,0.4)]">
            S
          </span>
          Sponsor<span className="text-violet">UK</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-7">
          <Link href="/jobs" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Jobs</Link>
          <Link href="/#how" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">How it works</Link>
          <Link href="/#verify" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Verification</Link>
          <Link href="/#calc" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Salary check</Link>
          <Link href="/pricing" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Pricing</Link>
          <Link href="/resume" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Resume</Link>
          <button
            onClick={openAssistant}
            className="flex items-center gap-1.5 text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors"
          >
            <span className="text-violet">✦</span> Ask AI
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div
                title={user.email ?? ""}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-violet-2 text-white flex items-center justify-center font-jakarta font-bold text-[13px] shadow-[0_4px_10px_rgba(91,67,232,0.3)]"
              >
                {(user.email ?? "?")[0].toUpperCase()}
              </div>
              <button
                onClick={signOut}
                className="text-[14px] text-v-muted font-medium hover:text-v-ink transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">
              Sign in
            </Link>
          )}

          <Link
            href="/jobs"
            className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 flex items-center gap-2"
          >
            Browse jobs
          </Link>
        </div>

        {/* Mobile right: CTA + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <Link
            href="/jobs"
            onClick={() => setMobileOpen(false)}
            className="font-jakarta font-bold text-[14px] px-4 py-2.5 rounded-xl bg-violet text-white shadow-[0_6px_16px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] active:scale-[0.96] transition-all duration-200"
          >
            Browse jobs
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-v-line/50 transition-colors"
          >
            <span
              className={`block h-[2px] w-5 bg-v-ink rounded transition-all duration-200 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-v-ink rounded transition-all duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-v-ink rounded transition-all duration-200 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-0 z-40 pt-[68px]"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-4 mt-2 bg-white border border-v-line rounded-[18px] shadow-[0_20px_60px_rgba(28,20,64,.14)] p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/jobs" onClick={() => setMobileOpen(false)} className={linkCls}>Jobs</Link>
              <Link href="/#how" onClick={() => setMobileOpen(false)} className={linkCls}>How it works</Link>
              <Link href="/#verify" onClick={() => setMobileOpen(false)} className={linkCls}>Verification</Link>
              <Link href="/#calc" onClick={() => setMobileOpen(false)} className={linkCls}>Salary check</Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className={linkCls}>Pricing</Link>
              <Link href="/resume" onClick={() => setMobileOpen(false)} className={linkCls}>Resume</Link>
              <button onClick={openAssistant} className={`${linkCls} w-full text-left flex items-center gap-2`}>
                <span className="text-violet">✦</span> Ask AI
              </button>

              <div className="border-t border-v-line my-3" />

              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-v-muted truncate">{user.email}</span>
                  <button onClick={signOut} className="text-[14px] text-violet font-semibold ml-4 shrink-0">
                    Sign out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-[16px] font-semibold text-violet py-2">
                  Sign in →
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

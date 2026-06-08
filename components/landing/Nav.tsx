"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-7 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[rgba(251,250,254,0.85)] backdrop-blur-[14px] shadow-[0_1px_0_#ECEAF3]"
          : "py-[18px]"
      }`}
    >
      <div className="flex items-center gap-2.5 font-jakarta font-extrabold text-[21px]">
        <span className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet to-violet-2 flex items-center justify-center text-white text-[18px] shadow-[0_6px_16px_rgba(91,67,232,0.4)]">
          S
        </span>
        Sponsor<span className="text-violet">Track</span>
      </div>

      <div className="flex items-center gap-7">
        <a href="/#sectors" className="hidden sm:block text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Jobs</a>
        <a href="/#how" className="hidden sm:block text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">How it works</a>
        <a href="/#verify" className="hidden sm:block text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Verification</a>
        <a href="/#calc" className="hidden sm:block text-[15px] text-v-muted font-medium hover:text-v-ink transition-colors">Salary check</a>
        <Link
          href="/jobs"
          className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
        >
          Browse sponsored jobs
        </Link>
      </div>
    </nav>
  );
}

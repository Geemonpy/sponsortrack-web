import Link from "next/link";
import Nav from "@/components/landing/Nav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <div className="font-jakarta font-extrabold text-[7rem] leading-none text-violet/15 mb-2 select-none">
          404
        </div>
        <h1 className="font-jakarta font-extrabold text-[2rem] tracking-tight text-v-ink mb-3">
          Page not found
        </h1>
        <p className="text-v-muted text-[16px] max-w-[380px] leading-relaxed mb-8">
          We couldn&apos;t find what you were looking for. Browse our sponsor-verified UK job listings instead.
        </p>
        <Link
          href="/jobs"
          className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
        >
          Browse jobs →
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import Nav from "@/components/landing/Nav";

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-3xl mx-auto px-5 pt-[140px] pb-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-soft text-violet text-3xl mb-6">
          ?
        </div>
        <h1 className="font-jakarta font-extrabold text-[2rem] tracking-tight text-v-ink mb-3">
          Job not found
        </h1>
        <p className="text-v-muted text-[17px] max-w-md mx-auto mb-8">
          This listing may have been removed, expired, or the link may be outdated.
          Browse our live sponsored roles below.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 font-jakarta font-bold text-[15px] px-[22px] py-[12px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
        >
          Browse all sponsor jobs →
        </Link>
      </div>
    </div>
  );
}

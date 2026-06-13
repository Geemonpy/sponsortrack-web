import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJob } from "@/lib/data";
import type { Badge } from "@/lib/types";
import Nav from "@/components/landing/Nav";

export const revalidate = 300;

const BADGE_META: Record<Badge, { label: string; pillClass: string; dotClass: string }> = {
  sponsor_confirmed: {
    label: "Sponsor confirmed",
    pillClass: "bg-v-green-soft text-v-green",
    dotClass: "bg-v-green",
  },
  licensed_sponsor: {
    label: "Licensed sponsor",
    pillClass: "bg-violet-soft text-violet",
    dotClass: "bg-violet",
  },
  sponsorship_mentioned: {
    label: "Sponsorship mentioned",
    pillClass: "bg-v-amber-soft text-v-amber",
    dotClass: "bg-v-amber",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const job = await getJob(params.id);
  if (!job) return { title: "Job not found" };
  const title = `${job.title} at ${job.company}`;
  const desc = `${job.title} at ${job.company}${
    job.location ? ` in ${job.location}` : ""
  } — ${BADGE_META[job.badge].label}. UK visa sponsorship job on Sponsor UK.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    alternates: { canonical: `/jobs/${job.id}` },
  };
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) notFound();

  const badge = BADGE_META[job.badge];

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-3xl mx-auto px-5 pt-[110px] pb-16">
        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-v-muted hover:text-v-ink transition-colors mb-8"
        >
          ← Back to jobs
        </Link>

        {/* Main card */}
        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 sm:p-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 font-jakarta font-bold text-[12px] px-[13px] py-[7px] rounded-full mb-6 ${badge.pillClass}`}>
            <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
            {badge.label.toUpperCase()}
          </div>

          {/* Title + company */}
          <h1 className="font-jakarta font-extrabold tracking-[-0.02em] leading-tight text-[clamp(1.8rem,4vw,2.6rem)] text-v-ink">
            {job.title}
          </h1>
          <p className="mt-2 text-[18px] font-semibold text-v-muted">{job.company}</p>

          {/* Meta row */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-v-muted">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <span className="text-violet">📍</span> {job.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="text-violet">💷</span> {job.salary || "Not specified"}
            </span>
            {job.posted_date && (
              <span className="flex items-center gap-1.5">
                <span className="text-violet">🗓</span> Posted {job.posted_date}
              </span>
            )}
          </div>

          {/* Apply button */}
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-jakarta font-bold text-[15px] px-[22px] py-[12px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 transition-all duration-200"
            >
              Apply now →
            </a>
          )}

          {/* Divider */}
          {job.description && <div className="border-t border-v-line my-8" />}

          {/* Description */}
          {job.description && (
            <div className="text-[15.5px] leading-[1.75] text-v-ink/80 whitespace-pre-line">
              {job.description}
            </div>
          )}
        </div>

        {/* Sponsorship note */}
        <div className="mt-5 bg-violet-tint border border-violet-soft rounded-[16px] p-5 text-[14px] text-v-muted">
          <strong className="text-v-ink font-semibold">A note on sponsorship:</strong>{" "}
          a &ldquo;{badge.label.toLowerCase()}&rdquo; label reflects whether {job.company} appears
          on the Home Office register and whether the listing mentions sponsorship. It is guidance,
          not a guarantee — always confirm directly with the employer before applying or relocating.
        </div>
      </div>
    </div>
  );
}

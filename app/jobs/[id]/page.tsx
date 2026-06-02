import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJob } from "@/lib/data";
import type { Badge } from "@/lib/types";

export const revalidate = 300;

const BADGE_TEXT: Record<Badge, string> = {
  sponsor_confirmed: "Sponsor confirmed",
  licensed_sponsor: "Licensed sponsor",
  sponsorship_mentioned: "Sponsorship mentioned",
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
  } — ${BADGE_TEXT[job.badge]}. UK visa sponsorship job on SponsorTrack.`;
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

  const badgeText = BADGE_TEXT[job.badge];

  return (
    <div>
      <header className="border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-5 py-5">
          <Link href="/" className="font-display font-extrabold text-xl tracking-tight">
            ← SponsorTrack
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 py-10">
        <div
          className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded mb-4 ${
            job.badge === "sponsor_confirmed"
              ? "text-confirmed bg-confirmed/10"
              : job.badge === "licensed_sponsor"
              ? "text-licensed bg-licensed/10"
              : "text-mentioned bg-mentioned/10"
          }`}
        >
          {badgeText}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
          {job.title}
        </h1>
        <p className="mt-2 text-lg text-ink/70 font-medium">{job.company}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-ink/60">
          {job.location && <span>📍 {job.location}</span>}
          <span>💷 {job.salary || "Not specified"}</span>
          {job.posted_date && <span>🗓 Posted {job.posted_date}</span>}
          <span className="text-ink/40">via {job.source || "Adzuna"}</span>
        </div>

        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-accent text-parchment font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition"
          >
            Apply on {job.source || "Adzuna"} →
          </a>
        )}

        {job.description && (
          <div className="mt-8 prose prose-sm max-w-none text-ink/80 whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        )}

        <div className="mt-10 p-4 bg-card border border-ink/10 rounded-xl text-sm text-ink/60">
          <strong className="text-ink/80">A note on sponsorship:</strong> a “{badgeText.toLowerCase()}”
          label reflects whether {job.company} appears on the Home Office register and whether the
          listing mentions sponsorship. It is guidance, not a guarantee — always confirm directly
          with the employer before applying or relocating.
        </div>
      </article>
    </div>
  );
}

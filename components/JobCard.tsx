import Link from "next/link";
import type { Job, Badge } from "@/lib/types";

const BADGES: Record<Badge, { label: string; cls: string; dot: string; icon: string }> = {
  sponsor_confirmed: { label: "Sponsor confirmed", cls: "text-confirmed bg-confirmed/10", dot: "bg-confirmed", icon: "✅" },
  licensed_sponsor: { label: "Licensed sponsor", cls: "text-licensed bg-licensed/10", dot: "bg-licensed", icon: "🟡" },
  sponsorship_mentioned: { label: "Sponsorship mentioned", cls: "text-mentioned bg-mentioned/10", dot: "bg-mentioned", icon: "🔵" },
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function JobCard({ job }: { job: Job }) {
  const b = BADGES[job.badge] ?? BADGES.sponsorship_mentioned;
  return (
    <article className="job-card fade-in bg-card border border-ink/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${b.dot}`} />
          <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${b.cls}`}>
            {b.icon} {b.label}
          </span>
        </div>
        <h3 className="font-display font-semibold text-xl leading-snug truncate">
          <Link href={`/jobs/${job.id}`} className="hover:underline underline-offset-4">
            {job.title}
          </Link>
        </h3>
        <p className="text-ink/70 font-medium truncate">{job.company}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/55">
          {job.location && <span>📍 {job.location}</span>}
          <span>💷 {job.salary || "Not specified"}</span>
          <span>🕑 {timeAgo(job.posted_date)}</span>
          <span className="text-ink/35">via {job.source || "Adzuna"}</span>
        </div>
      </div>
      <div className="shrink-0 flex sm:flex-col gap-2">
        <Link
          href={`/jobs/${job.id}`}
          className="text-center border border-ink/15 text-ink font-semibold px-5 py-2.5 rounded-lg hover:bg-ink/5 transition"
        >
          Details
        </Link>
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-accent text-parchment font-semibold px-5 py-2.5 rounded-lg hover:bg-accent/90 transition"
          >
            Apply
          </a>
        )}
      </div>
    </article>
  );
}

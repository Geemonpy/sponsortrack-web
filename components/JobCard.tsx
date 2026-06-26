import Link from "next/link";
import { MapPin, PoundSterling, Clock } from "lucide-react";
import type { Job, Badge } from "@/lib/types";

const BADGES: Record<Badge, { label: string; pillCls: string; dotCls: string }> = {
  sponsor_confirmed: {
    label: "Sponsor confirmed",
    pillCls: "bg-v-green-soft text-v-green",
    dotCls: "bg-v-green",
  },
  licensed_sponsor: {
    label: "Licensed sponsor",
    pillCls: "bg-violet-soft text-violet",
    dotCls: "bg-violet",
  },
  sponsorship_mentioned: {
    label: "Sponsorship mentioned",
    pillCls: "bg-v-amber-soft text-v-amber",
    dotCls: "bg-v-amber",
  },
  sponsor_not_verified: {
    label: "Sponsor not verified",
    pillCls: "bg-v-line text-v-muted",
    dotCls: "bg-v-muted",
  },
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

export default function JobCard({ job, back }: { job: Job; back?: string }) {
  const b = BADGES[job.badge] ?? BADGES.sponsorship_mentioned;
  const detailHref = back
    ? `/jobs/${job.id}?back=${encodeURIComponent(back)}`
    : `/jobs/${job.id}`;
  return (
    <article className="bg-white border border-v-line rounded-[18px] p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_14px_44px_rgba(28,20,64,.07)] hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(28,20,64,.13)] transition-all duration-200">
      <div className="flex-1 min-w-0">
        {/* Badge pill */}
        <div className="mb-2.5">
          <span className={`inline-flex items-center gap-2 font-jakarta font-bold text-[11px] px-[11px] py-[5px] rounded-full ${b.pillCls}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${b.dotCls}`} />
            {b.label.toUpperCase()}
          </span>
          {(job.is_skilled_worker_sponsor || job.meets_general_threshold === "meets" || job.meets_general_threshold === "below") && (
            <span className="inline-flex flex-wrap gap-1.5 ml-1.5">
              {job.is_skilled_worker_sponsor && (
                <span className="inline-flex items-center font-jakarta font-bold text-[10px] px-[9px] py-[4px] rounded-full bg-v-line text-v-muted">
                  Skilled Worker sponsor
                </span>
              )}
              {job.meets_general_threshold === "meets" && (
                <span className="inline-flex items-center font-jakarta font-bold text-[10px] px-[9px] py-[4px] rounded-full bg-v-green-soft text-v-green">
                  Salary meets visa threshold
                </span>
              )}
              {job.meets_general_threshold === "below" && (
                <span className="inline-flex items-center font-jakarta font-bold text-[10px] px-[9px] py-[4px] rounded-full bg-v-amber-soft text-v-amber">
                  Salary below typical threshold
                </span>
              )}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-jakarta font-bold text-[1.1rem] leading-snug truncate text-v-ink">
          <Link href={detailHref} className="hover:text-violet transition-colors">
            {job.title}
          </Link>
        </h3>

        {/* Company */}
        <p className="text-v-muted font-medium truncate mt-0.5">{job.company}</p>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-v-muted">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="shrink-0" />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <PoundSterling size={13} className="shrink-0" />
            {job.salary || "Not specified"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} className="shrink-0" />
            {timeAgo(job.posted_date)}
          </span>
        </div>

        {(job.source === "Adzuna" || job.source === null) && (
          <div className="mt-1.5 flex items-center gap-1 min-w-[116px] min-h-[23px] text-[11px] text-v-muted">
            <a
              href="https://www.adzuna.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Jobs
            </a>
            <span>by</span>
            <a
              href="https://www.adzuna.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Adzuna"
            >
              <img src="/adzuna-logo.jpg" alt="Adzuna" width={80} height={18} />
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 flex sm:flex-col gap-2">
        <Link
          href={detailHref}
          className="text-center border border-v-line text-v-ink font-jakarta font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:border-violet hover:text-violet active:scale-[0.96] transition-all"
        >
          Details
        </Link>
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-violet text-white font-jakarta font-bold text-[14px] px-5 py-2.5 rounded-xl shadow-[0_10px_24px_rgba(91,67,232,0.25)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
          >
            Apply
          </a>
        )}
      </div>
    </article>
  );
}

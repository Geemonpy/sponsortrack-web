import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, PoundSterling, Clock } from "lucide-react";
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
  sponsor_not_verified: {
    label: "Sponsor not verified",
    pillClass: "bg-v-line text-v-muted",
    dotClass: "bg-v-muted",
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
  } — ${BADGE_META[job.badge].label}. UK visa sponsorship job on SponsorRoute.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    alternates: { canonical: `/jobs/${job.id}` },
  };
}

function MetaRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-v-line last:border-0">
      <span className="mt-0.5 shrink-0 text-v-muted">{icon}</span>
      <span className="text-[15px] text-v-ink">{children}</span>
    </div>
  );
}

export default async function JobPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { back?: string };
}) {
  const job = await getJob(params.id);
  if (!job) notFound();

  const badge = BADGE_META[job.badge];

  // Validate back URL is safe (must start with /jobs)
  const rawBack = searchParams?.back ?? "";
  const backHref =
    rawBack.startsWith("/jobs") ? rawBack : "/jobs";

  // JSON-LD for Google for Jobs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description ?? `${job.title} at ${job.company}. UK visa sponsorship role.`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: job.location
      ? { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "GB" } }
      : { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "GB" } },
    datePosted: job.posted_date ?? undefined,
    employmentType: "FULL_TIME",
    ...(job.apply_url ? { url: job.apply_url } : {}),
    ...(job.salary ? { baseSalary: { "@type": "MonetaryAmount", currency: "GBP", value: job.salary } } : {}),
  };

  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <div className="max-w-[1000px] mx-auto px-5 pt-[110px] pb-20">
        {/* Back link */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-v-muted hover:text-v-ink transition-colors mb-8"
        >
          ← Back to jobs
        </Link>

        {/* Two-column grid: main | sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── MAIN COLUMN ── */}
          <div>
            <h1 className="font-jakarta font-extrabold tracking-[-0.025em] leading-[1.05] text-[clamp(2rem,5vw,3rem)] text-v-ink">
              {job.title}
            </h1>
            <p className="mt-3 text-[20px] font-semibold text-v-muted">{job.company}</p>

            {/* Inline meta row on mobile only */}
            <div className="lg:hidden mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-v-muted pb-6 border-b border-v-line">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <PoundSterling size={14} className="shrink-0" />
                {job.salary || "Not specified"}
              </span>
              {job.posted_date && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="shrink-0" />
                  Posted {job.posted_date}
                </span>
              )}
            </div>

            {/* Apply button on mobile only */}
            {job.apply_url && (
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hidden inline-flex items-center gap-2 mt-5 mb-6 font-jakarta font-bold text-[15px] px-6 py-3 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] active:scale-[0.96] transition-all duration-200"
              >
                Apply now →
              </a>
            )}

            {/* Full description */}
            {job.description ? (
              <div className="mt-8">
                <div className="text-[15.5px] leading-[1.8] text-v-ink/85 whitespace-pre-line">
                  {job.description}
                </div>
                {job.apply_url && (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-6 text-[14px] text-violet font-medium hover:underline"
                  >
                    View full description on employer site →
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-v-muted italic">No description available.</p>
                {job.apply_url && (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-[14px] text-violet font-medium hover:underline"
                  >
                    View full description on employer site →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:sticky lg:top-[90px] space-y-4">
            {/* Info card */}
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-6">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 font-jakarta font-bold text-[11.5px] px-[13px] py-[7px] rounded-full mb-5 ${badge.pillClass}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dotClass}`} />
                {badge.label.toUpperCase()}
              </div>

              {/* Meta */}
              <div className="mb-5">
                {job.location && (
                  <MetaRow icon={<MapPin size={16} />}>
                    <span className="font-medium">{job.location}</span>
                  </MetaRow>
                )}
                <MetaRow icon={<PoundSterling size={16} />}>
                  <span className="font-medium">{job.salary || "Salary not specified"}</span>
                </MetaRow>
                {job.posted_date && (
                  <MetaRow icon={<Clock size={16} />}>
                    Posted <span className="font-medium">{job.posted_date}</span>
                  </MetaRow>
                )}
              </div>

              {/* Apply CTA */}
              {job.apply_url ? (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-jakarta font-bold text-[16px] px-6 py-3.5 rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200"
                >
                  Apply now →
                </a>
              ) : (
                <div className="block w-full text-center font-jakarta font-bold text-[16px] px-6 py-3.5 rounded-xl bg-v-line text-v-muted cursor-not-allowed">
                  No apply link
                </div>
              )}
            </div>

            {/* Sponsorship checks */}
            <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-6">
              <h3 className="font-jakarta font-bold text-[11.5px] text-v-muted uppercase tracking-wide mb-4">Sponsorship checks</h3>
              <div className="text-[14.5px]">
                {job.is_skilled_worker_sponsor !== null && (
                  <div className="flex justify-between items-baseline py-2.5 border-b border-v-line">
                    <span className="text-v-muted">Skilled Worker route</span>
                    <span className="font-semibold text-v-ink">{job.is_skilled_worker_sponsor ? "Yes" : "No"}</span>
                  </div>
                )}
                {job.sponsor_rating && (
                  <div className="flex justify-between items-baseline py-2.5 border-b border-v-line">
                    <span className="text-v-muted">Sponsor rating</span>
                    <span className="font-semibold text-v-ink">{job.sponsor_rating === "A" ? "A-rated" : job.sponsor_rating}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline py-2.5">
                  <span className="text-v-muted">Salary</span>
                  <span className={`font-semibold text-right ml-4 ${job.meets_general_threshold === "meets" ? "text-v-green" : job.meets_general_threshold === "below" ? "text-v-amber" : "text-v-muted"}`}>
                    {job.meets_general_threshold === "meets"
                      ? "Meets the visa salary threshold"
                      : job.meets_general_threshold === "below"
                      ? "Below the typical threshold"
                      : "Not listed"}
                  </span>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-v-line text-[12px] text-v-muted leading-relaxed">
                Care and health roles have lower salary thresholds, and advertised salaries are sometimes estimated — always confirm with the employer.
              </p>
            </div>

            {/* Sponsorship note */}
            <div className="bg-violet-tint border border-violet-soft rounded-[16px] p-5 text-[13.5px] text-v-muted leading-relaxed">
              <strong className="text-v-ink font-semibold block mb-1">About this badge</strong>
              A &ldquo;{badge.label.toLowerCase()}&rdquo; label means {job.company} appears
              on the Home Office register and/or the listing mentions sponsorship.
              It is guidance, not a guarantee — confirm directly with the employer.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

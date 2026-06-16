import { getJobs } from "@/lib/data";
import JobCard from "@/components/JobCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ScrapedPage() {
  const jobs = await getJobs({ limit: 500, sourceType: "test" });

  return (
    <div>
      <header className="border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <Link href="/" className="font-display font-extrabold text-xl tracking-tight">
            ← SponsorRoute
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900 font-medium text-sm">
          Internal test results — not verified, not for public use.
        </div>

        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">
          Scraped Results
        </h1>
        <p className="text-ink/55 text-sm mb-6">
          Jobs from non-primary sources. {jobs.length} result{jobs.length === 1 ? "" : "s"}.
        </p>

        {jobs.length === 0 ? (
          <div className="text-center py-20 text-ink/50">
            <p className="font-display text-2xl text-ink/70">No test-source jobs found.</p>
            <p className="mt-1">Jobs appear here when their source is not Adzuna or Active Jobs DB.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

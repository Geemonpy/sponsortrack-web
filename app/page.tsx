import { getJobs, getStats } from "@/lib/data";
import JobBoard from "@/components/JobBoard";

// Re-generate the cached page every 5 minutes (good for SEO + freshness).
export const revalidate = 300;

export default async function Home() {
  const [jobs, stats] = await Promise.all([getJobs({ limit: 200 }), getStats()]);

  return (
    <div>
      <header className="border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent text-parchment grid place-items-center font-display font-extrabold text-lg">
              S
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight">SponsorTrack</span>
          </div>
          <a href="#alerts" className="text-sm font-semibold text-accent hover:underline underline-offset-4">
            Get alerts →
          </a>
        </div>
      </header>
      <JobBoard initialJobs={jobs} stats={stats} />
    </div>
  );
}

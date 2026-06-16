import { getJobs, getStats } from "@/lib/data";
import JobBoard from "@/components/JobBoard";
import Nav from "@/components/landing/Nav";

export const revalidate = 300;

export const metadata = {
  title: "Browse UK Visa Sponsor Jobs",
  description: "Find UK jobs from employers on the Home Office register of licensed visa sponsors.",
  alternates: { canonical: "/jobs" },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const initialCategory = searchParams.category ?? "";
  const initialSearch = searchParams.search ?? "";

  const [jobs, stats] = await Promise.all([
    // SSR always returns free preview (can't check auth without cookie session).
    // The client-side API fetch immediately re-runs with the auth token and
    // upgrades subscribers to the full result set.
    getJobs({ limit: 20, sourceType: "main" }),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-v-bg overflow-x-hidden">
      <Nav />
      <JobBoard
        initialJobs={jobs}
        stats={stats}
        initialCategory={initialCategory}
        initialSearch={initialSearch}
      />
    </div>
  );
}

import { getJobs, getStats } from "@/lib/data";
import JobBoard from "@/components/JobBoard";
import Nav from "@/components/landing/Nav";

export const revalidate = 300;

export const metadata = {
  title: "Browse Sponsored Jobs",
  description: "Find UK jobs from employers on the Home Office register of licensed visa sponsors.",
};

export default async function JobsPage() {
  const [jobs, stats] = await Promise.all([
    getJobs({ limit: 200, sourceType: "main" }),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-v-bg">
      <Nav />
      <JobBoard initialJobs={jobs} stats={stats} />
    </div>
  );
}

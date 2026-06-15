import Nav from "@/components/landing/Nav";

function SkeletonCard() {
  return (
    <div className="bg-white border border-v-line rounded-[18px] p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_14px_44px_rgba(28,20,64,.07)] animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 bg-v-line rounded-full" />
        <div className="h-5 w-3/4 bg-v-line rounded-lg" />
        <div className="h-4 w-1/3 bg-v-line rounded-lg" />
        <div className="flex gap-4">
          <div className="h-3 w-20 bg-v-line rounded" />
          <div className="h-3 w-16 bg-v-line rounded" />
        </div>
      </div>
      <div className="shrink-0 flex sm:flex-col gap-2">
        <div className="h-10 w-20 bg-v-line rounded-xl" />
        <div className="h-10 w-20 bg-v-line rounded-xl" />
      </div>
    </div>
  );
}

export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-v-bg overflow-x-hidden">
      <Nav />
      <div className="max-w-5xl mx-auto px-5 pt-[120px] pb-6">
        <div className="animate-pulse space-y-4 mb-8">
          <div className="h-10 w-2/3 max-w-lg bg-v-line rounded-xl" />
          <div className="h-5 w-full max-w-xl bg-v-line rounded-lg" />
          <div className="flex gap-3 mt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white border border-v-line rounded-[18px] px-5 py-4 w-32">
                <div className="h-7 w-12 bg-v-line rounded mb-2" />
                <div className="h-3 w-20 bg-v-line rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}

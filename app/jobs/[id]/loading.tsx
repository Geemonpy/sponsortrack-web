import Nav from "@/components/landing/Nav";

export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <div className="max-w-[1000px] mx-auto px-5 pt-[110px] pb-20 animate-pulse">
        <div className="h-4 w-24 bg-v-line rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Main */}
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-v-line rounded-xl" />
            <div className="h-6 w-1/3 bg-v-line rounded-lg mt-3" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 bg-v-line rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white border border-v-line rounded-[22px] p-6 space-y-4">
            <div className="h-7 w-32 bg-v-line rounded-full" />
            <div className="space-y-3 mt-2">
              <div className="h-4 w-full bg-v-line rounded" />
              <div className="h-4 w-full bg-v-line rounded" />
              <div className="h-4 w-2/3 bg-v-line rounded" />
            </div>
            <div className="h-12 w-full bg-v-line rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const daysRaw = sp.get("days");
  const jobs = await getJobs({
    badge: sp.get("badge") || undefined,
    category: sp.get("category") || undefined,
    location: sp.get("location") || undefined,
    search: sp.get("search") || undefined,
    days: daysRaw ? Number(daysRaw) : undefined,
    limit: 200,
    sourceType: "main",
  });
  return NextResponse.json({ count: jobs.length, jobs });
}

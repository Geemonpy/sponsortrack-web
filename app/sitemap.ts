import type { MetadataRoute } from "next";
import { getRecentJobIds } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sponsortrack-web.vercel.app";
  const ids = await getRecentJobIds(1000);

  const jobUrls: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${base}/jobs/${id}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...jobUrls,
  ];
}

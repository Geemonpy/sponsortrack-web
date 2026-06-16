import { ImageResponse } from "next/og";
import { getJob } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BADGE_COLOURS: Record<string, { bg: string; text: string; label: string }> = {
  sponsor_confirmed: { bg: "#DCFCEF", text: "#059669", label: "Sponsor confirmed" },
  licensed_sponsor:  { bg: "#EEEBFE", text: "#5B43E8", label: "Licensed sponsor" },
  sponsorship_mentioned: { bg: "#FEF3DA", text: "#D97706", label: "Sponsorship mentioned" },
};

export default async function Image({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);

  // Fallback to site-level OG if job not found
  if (!job) {
    return new ImageResponse(
      (
        <div style={{ background: "linear-gradient(135deg,#5B43E8,#7C6CF0)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 60, fontWeight: 800 }}>Sponsor<span style={{ color: "#C4B8FF" }}>Route</span></span>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const badge = BADGE_COLOURS[job.badge] ?? BADGE_COLOURS.sponsorship_mentioned;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAFE",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#5B43E8,#7C6CF0)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 800 }}>
            S
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#1C1440", letterSpacing: -0.5 }}>
            Sponsor<span style={{ color: "#5B43E8" }}>Route</span>
          </span>
        </div>

        {/* Badge */}
        <div style={{ display: "flex", marginBottom: 24 }}>
          <span style={{ background: badge.bg, color: badge.text, fontSize: 16, fontWeight: 700, padding: "6px 16px", borderRadius: 999, letterSpacing: 0.5 }}>
            {badge.label.toUpperCase()}
          </span>
        </div>

        {/* Job title */}
        <div style={{ fontSize: 52, fontWeight: 800, color: "#1C1440", lineHeight: 1.1, letterSpacing: -1, marginBottom: 20, maxWidth: 900 }}>
          {job.title.length > 60 ? job.title.slice(0, 57) + "…" : job.title}
        </div>

        {/* Company + location */}
        <div style={{ fontSize: 28, color: "#6B6A8A", fontWeight: 500, marginBottom: 8 }}>
          {job.company}
        </div>
        {job.location && (
          <div style={{ fontSize: 22, color: "#9996B8", display: "flex", alignItems: "center", gap: 8 }}>
            📍 {job.location}
          </div>
        )}

        {/* Bottom strip */}
        <div style={{ marginTop: "auto", borderTop: "1.5px solid #ECEAF3", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, color: "#9996B8" }}>sponsorroute.com</span>
          <span style={{ fontSize: 18, color: "#5B43E8", fontWeight: 600 }}>UK Visa Sponsor Jobs →</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

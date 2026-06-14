import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #5B43E8 0%, #7C6CF0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              color: "white",
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span style={{ color: "white", fontSize: "72px", fontWeight: 800, letterSpacing: "-2px" }}>
              Sponsor
            </span>
            <span style={{ color: "rgba(196,184,255,1)", fontSize: "72px", fontWeight: 800, letterSpacing: "-2px" }}>
              UK
            </span>
          </div>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: "32px",
            fontWeight: 500,
            letterSpacing: "0px",
          }}
        >
          UK Visa Sponsor Jobs — Home Office verified
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

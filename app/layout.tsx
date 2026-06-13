import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Assistant from "@/components/Assistant";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sponsortrack.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sponsor UK — UK Visa Sponsor Jobs",
    template: "%s | Sponsor UK",
  },
  description:
    "Find UK jobs from employers on the Home Office register of licensed visa sponsors. IT and care roles, checked against the official sponsor register.",
  keywords: [
    "UK visa sponsorship jobs",
    "skilled worker visa jobs",
    "health and care worker visa",
    "licensed sponsor jobs UK",
    "tier 2 sponsorship jobs",
  ],
  openGraph: {
    title: "Sponsor UK — UK Visa Sponsor Jobs",
    description:
      "UK jobs from employers on the Home Office licensed sponsor register.",
    url: siteUrl,
    siteName: "Sponsor UK",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Assistant />
      </body>
    </html>
  );
}

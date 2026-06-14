import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Tailoring Tool",
  alternates: { canonical: "/resume" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

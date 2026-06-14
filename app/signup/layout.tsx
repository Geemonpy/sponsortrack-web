import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  alternates: { canonical: "/signup" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

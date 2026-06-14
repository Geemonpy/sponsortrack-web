import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  alternates: { canonical: "/login" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

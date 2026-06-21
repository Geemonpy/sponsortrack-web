import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";
import { supabase } from "@/lib/supabaseServer";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function cardShell(children: React.ReactNode) {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />
      <div className="flex items-center justify-center min-h-screen px-5 pt-24 pb-16">
        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function InvalidLink() {
  return cardShell(
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-red-50 text-red-400 text-[22px] mb-1">
        ✕
      </div>
      <h1 className="font-jakarta font-extrabold text-[1.3rem] tracking-tight text-v-ink">
        This link is invalid
      </h1>
      <p className="text-v-muted text-[15px] leading-relaxed">
        The unsubscribe link you followed doesn&apos;t look right. It may have
        been copied incorrectly or has already been used.
      </p>
      <Link
        href="/"
        className="inline-block mt-2 font-jakarta font-bold text-[14px] text-violet hover:underline"
      >
        ← Back to homepage
      </Link>
    </div>
  );
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;

  if (!id || !UUID_RE.test(id)) {
    return <InvalidLink />;
  }

  const { data } = await supabase
    .from("alert_preferences")
    .select("email, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return cardShell(
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-v-green-soft text-v-green text-[22px] mb-1">
          ✓
        </div>
        <h1 className="font-jakarta font-extrabold text-[1.3rem] tracking-tight text-v-ink">
          You&apos;ve been unsubscribed
        </h1>
        <p className="text-v-muted text-[15px] leading-relaxed">
          You won&apos;t receive any more job alert emails from SponsorRoute.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 font-jakarta font-bold text-[14px] text-violet hover:underline"
        >
          ← Back to homepage
        </Link>
      </div>
    );
  }

  return cardShell(<UnsubscribeClient id={id} email={data.email} />);
}

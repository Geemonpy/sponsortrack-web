import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Sponsor UK subscription and refund policy.",
  alternates: { canonical: "/refund" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-jakarta font-bold text-[1.15rem] text-v-ink mb-3">{title}</h2>
      <div className="text-v-muted text-[15.5px] leading-[1.8] space-y-3">{children}</div>
    </section>
  );
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-[740px] mx-auto px-5 pt-[120px] pb-24">
        <div className="mb-12">
          <div className="text-violet font-jakarta font-bold text-[13px] tracking-[0.05em] uppercase mb-3">Legal</div>
          <h1 className="font-jakarta font-extrabold tracking-tight text-[2.2rem] text-v-ink mb-2">
            Refund Policy
          </h1>
          <p className="text-v-muted text-[15px]">Last updated: 14 June 2026</p>
        </div>

        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 md:p-10">

          <Section title="Subscription cancellation">
            <p>
              You may cancel your Sponsor UK subscription at any time from your account settings.
              Cancellation takes effect at the end of your current billing period — you will retain
              access until then and will not be charged again.
            </p>
          </Section>

          <Section title="Refunds">
            <p>
              Because digital subscriptions provide immediate access to the service, we generally
              do not offer refunds for periods already used.
            </p>
            <p>
              Exceptions may be made at our discretion for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Duplicate charges</li>
              <li>Technical failures that prevented access for a significant portion of the billing period</li>
              <li>Charges made in error</li>
            </ul>
            <p>
              If you believe you qualify for a refund, contact us within 14 days of the charge at{" "}
              <a href="mailto:hello@sponsoruk.com" className="text-violet hover:underline">
                hello@sponsoruk.com
              </a>{" "}
              with your account email and a brief explanation. We aim to respond within 3 business days.
            </p>
          </Section>

          <Section title="Free tier">
            <p>
              Access to basic job listings on Sponsor UK is free and requires no payment. No
              refund is applicable to the free tier.
            </p>
          </Section>

          <Section title="Questions">
            <p>
              For billing questions or disputes, contact us at{" "}
              <a href="mailto:hello@sponsoruk.com" className="text-violet hover:underline">
                hello@sponsoruk.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-8 flex gap-6 text-[14px] text-v-muted">
          <Link href="/privacy" className="hover:text-violet transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-violet transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-violet transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SponsorRoute collects, uses, and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-jakarta font-bold text-[1.15rem] text-v-ink mb-3">{title}</h2>
      <div className="text-v-muted text-[15.5px] leading-[1.8] space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-[740px] mx-auto px-5 pt-[120px] pb-24">
        <div className="mb-12">
          <div className="text-violet font-jakarta font-bold text-[13px] tracking-[0.05em] uppercase mb-3">Legal</div>
          <h1 className="font-jakarta font-extrabold tracking-tight text-[2.2rem] text-v-ink mb-2">
            Privacy Policy
          </h1>
          <p className="text-v-muted text-[15px]">Last updated: 14 June 2026</p>
        </div>

        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 md:p-10">

          <Section title="Who we are">
            <p>
              SponsorRoute (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the website at{" "}
              <strong>sponsorroute.com</strong>. We help jobseekers find UK roles from
              employers on the Home Office register of licensed visa sponsors. Questions about this
              policy can be sent to{" "}
              <a href="mailto:hello@sponsoruk.com" className="text-violet hover:underline">
                hello@sponsoruk.com
              </a>
              .
            </p>
          </Section>

          <Section title="Data we collect">
            <p>
              <strong className="text-v-ink">Account data</strong> — when you create an account we
              collect your email address and, if you use Google sign-in, your Google profile name and
              avatar. We do not store your Google password.
            </p>
            <p>
              <strong className="text-v-ink">Usage data</strong> — page views, search queries, and
              clicks are collected in aggregate to improve the service. We do not build individual
              behavioural profiles.
            </p>
            <p>
              <strong className="text-v-ink">AI tool input</strong> — when you use the Resume
              Tailoring tool, the CV text and job description you paste are sent to Anthropic&apos;s
              API to generate a response. We do not store these inputs beyond the duration of your
              session.
            </p>
            <p>
              <strong className="text-v-ink">Cookies</strong> — we use a session cookie for
              authentication (Supabase). We do not use advertising or tracking cookies.
            </p>
          </Section>

          <Section title="How we use your data">
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Provide and maintain your account</li>
              <li>Send email alerts you subscribe to</li>
              <li>Improve the site based on aggregate analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We will not sell your data to third parties or use it for advertising purposes.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>We share data with the following processors to operate the service:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>
                <strong className="text-v-ink">Supabase</strong> — database and authentication
                (data stored in the EU)
              </li>
              <li>
                <strong className="text-v-ink">Anthropic</strong> — AI processing for the Resume
                Tailoring tool (no training on your inputs per Anthropic&apos;s API policy)
              </li>
              <li>
                <strong className="text-v-ink">Vercel</strong> — website hosting (data may transit
                through the US)
              </li>
            </ul>
          </Section>

          <Section title="Your rights (UK GDPR)">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Object to processing based on legitimate interests</li>
              <li>Lodge a complaint with the ICO (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">ico.org.uk</a>)</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@sponsoruk.com" className="text-violet hover:underline">
                hello@sponsoruk.com
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              Account data is retained while your account is active. If you delete your account,
              we remove your personal data within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will be communicated
              by email (if you have an account) or by a prominent notice on the site.
            </p>
          </Section>
        </div>

        <div className="mt-8 flex gap-6 text-[14px] text-v-muted">
          <Link href="/terms" className="hover:text-violet transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-violet transition-colors">Refund Policy</Link>
          <Link href="/contact" className="hover:text-violet transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}

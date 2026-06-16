import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using SponsorRoute.",
  alternates: { canonical: "/terms" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-jakarta font-bold text-[1.15rem] text-v-ink mb-3">{title}</h2>
      <div className="text-v-muted text-[15.5px] leading-[1.8] space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-[740px] mx-auto px-5 pt-[120px] pb-24">
        <div className="mb-12">
          <div className="text-violet font-jakarta font-bold text-[13px] tracking-[0.05em] uppercase mb-3">Legal</div>
          <h1 className="font-jakarta font-extrabold tracking-tight text-[2.2rem] text-v-ink mb-2">
            Terms of Service
          </h1>
          <p className="text-v-muted text-[15px]">Last updated: 14 June 2026</p>
        </div>

        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 md:p-10">

          <Section title="1. Acceptance">
            <p>
              By accessing or using SponsorRoute (&ldquo;the Service&rdquo;), you agree to be bound
              by these Terms. If you do not agree, please do not use the Service.
            </p>
          </Section>

          <Section title="2. What the Service does">
            <p>
              SponsorRoute aggregates UK job listings from third-party sources and cross-references
              employers against the Home Office Register of Licensed Sponsors. We provide this
              information as a convenience to jobseekers. We are not a recruitment agency and do not
              act on behalf of any employer or applicant.
            </p>
          </Section>

          <Section title="3. No guarantee of sponsorship">
            <p>
              Appearing on the Home Office sponsor register does not mean an employer will sponsor
              any given role. Badge labels on SponsorRoute (e.g., &ldquo;Sponsor confirmed&rdquo;)
              reflect data at the time of our last check and are guidance only — not a guarantee.
              Always confirm sponsorship availability directly with the employer before applying.
            </p>
          </Section>

          <Section title="4. AI Resume Tailoring tool">
            <p>
              The Resume Tailoring tool uses AI to suggest edits to your CV. Output is generated
              automatically and may contain errors or omissions. You are solely responsible for
              reviewing and verifying any AI-generated content before using it in a job application.
            </p>
          </Section>

          <Section title="5. User accounts">
            <p>
              You must be 18 or older to create an account. You are responsible for keeping your
              login credentials secure. You agree not to use the Service for any unlawful purpose or
              in a way that could harm other users or the integrity of job listings.
            </p>
          </Section>

          <Section title="6. Intellectual property">
            <p>
              Job listing content originates from third-party sources and remains the property of
              its respective owners. SponsorRoute&apos;s own content, branding, and software are
              protected by copyright and may not be reproduced without permission.
            </p>
          </Section>

          <Section title="7. Limitation of liability">
            <p>
              To the maximum extent permitted by law, SponsorRoute is not liable for any indirect,
              incidental, or consequential damages arising from your use of the Service, including
              decisions made based on job listings or AI-generated content.
            </p>
          </Section>

          <Section title="8. Changes to these Terms">
            <p>
              We may update these Terms at any time. Continued use of the Service after changes are
              posted constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="9. Governing law">
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              For any questions about these Terms, contact us at{" "}
              <a href="mailto:hello@sponsoruk.com" className="text-violet hover:underline">
                hello@sponsoruk.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-8 flex gap-6 text-[14px] text-v-muted">
          <Link href="/privacy" className="hover:text-violet transition-colors">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-violet transition-colors">Refund Policy</Link>
          <Link href="/contact" className="hover:text-violet transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}

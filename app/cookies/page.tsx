import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How SponsorRoute uses cookies and similar technologies.",
  alternates: { canonical: "/cookies" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-jakarta font-bold text-[1.15rem] text-v-ink mb-3">{title}</h2>
      <div className="text-v-muted text-[15.5px] leading-[1.8] space-y-3">{children}</div>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-[740px] mx-auto px-5 pt-[120px] pb-24">
        <div className="mb-12">
          <div className="text-violet font-jakarta font-bold text-[13px] tracking-[0.05em] uppercase mb-3">Legal</div>
          <h1 className="font-jakarta font-extrabold tracking-tight text-[2.2rem] text-v-ink mb-2">
            Cookie Policy
          </h1>
          <p className="text-v-muted text-[15px]">Last updated: 20 June 2026</p>
        </div>

        <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8 md:p-10">

          <Section title="What are cookies?">
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              the site remember information about your visit — such as whether you are signed in —
              so you do not have to re-enter it each time.
            </p>
          </Section>

          <Section title="Cookies we use">
            <p>
              SponsorRoute uses a minimal set of cookies required to operate the service:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] border-collapse mt-2">
                <thead>
                  <tr className="border-b border-v-line text-left">
                    <th className="py-2 pr-4 font-jakarta font-bold text-v-ink w-2/5">Cookie</th>
                    <th className="py-2 pr-4 font-jakarta font-bold text-v-ink w-1/5">Type</th>
                    <th className="py-2 font-jakarta font-bold text-v-ink">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-v-line/50">
                    <td className="py-2.5 pr-4 font-mono text-[13px]">sb-*</td>
                    <td className="py-2.5 pr-4">Essential</td>
                    <td className="py-2.5">
                      Authentication session cookie set by Supabase. Keeps you signed in.
                      Deleted when you sign out or your session expires.
                    </td>
                  </tr>
                  <tr className="border-b border-v-line/50">
                    <td className="py-2.5 pr-4 font-mono text-[13px]">__vercel_*</td>
                    <td className="py-2.5 pr-4">Essential</td>
                    <td className="py-2.5">
                      Set by our hosting provider (Vercel) for load balancing and security.
                      Not used for tracking.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              We do <strong className="text-v-ink">not</strong> use advertising cookies, tracking
              pixels, or third-party analytics cookies.
            </p>
          </Section>

          <Section title="What we don't do">
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>We do not use Google Analytics or any behavioural analytics platform</li>
              <li>We do not serve personalised advertising</li>
              <li>We do not share cookie data with advertisers</li>
              <li>We do not use cross-site tracking technologies</li>
            </ul>
          </Section>

          <Section title="Managing cookies">
            <p>
              Because we only set essential cookies required for the site to function, disabling them
              via your browser settings will prevent you from signing in. No non-essential cookies
              require your consent under UK PECR.
            </p>
            <p>
              You can clear cookies at any time through your browser&apos;s settings. Doing so will
              sign you out of SponsorRoute.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy if our cookie usage changes. Material changes will be
              noted on this page with an updated date.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy can be sent to{" "}
              <a href="mailto:support@sponsorroute.com" className="text-violet hover:underline">
                support@sponsorroute.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-8 flex gap-6 text-[14px] text-v-muted">
          <Link href="/privacy" className="hover:text-violet transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-violet transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-violet transition-colors">Refund Policy</Link>
          <Link href="/contact" className="hover:text-violet transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}

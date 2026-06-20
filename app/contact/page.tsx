import type { Metadata } from "next";
import Nav from "@/components/landing/Nav";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SponsorRoute team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-v-bg text-v-ink font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto px-5 pt-[120px] pb-20">
        {/* Heading */}
        <div className="max-w-[560px] mb-14">
          <div className="text-violet font-jakarta font-bold text-[14px] tracking-[0.04em] uppercase mb-3">Get in touch</div>
          <h1 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,5vw,3rem)] mb-4">
            We&apos;d love to <span className="text-violet">hear from you.</span>
          </h1>
          <p className="text-v-muted text-[17px] leading-relaxed">
            Questions about a listing, feedback on the site, or just want to say hello?
            Drop us a message and we&apos;ll get back to you within 2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          {/* Contact details */}
          <div className="space-y-4">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                label: "Email",
                value: "support@sponsorroute.com",
                href: "mailto:support@sponsorroute.com",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                label: "Location",
                value: "London, UK",
                href: undefined,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-v-line rounded-[18px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-[11px] bg-violet-soft text-violet flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[12px] font-jakarta font-bold uppercase tracking-wide text-v-muted mb-0.5">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-[15px] font-medium text-v-ink hover:text-violet transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-[15px] font-medium text-v-ink">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white border border-v-line rounded-[22px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-8">
            <h2 className="font-jakarta font-extrabold text-[1.25rem] text-v-ink mb-6">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

import Nav from "@/components/landing/Nav";
import HeroStage from "@/components/landing/HeroStage";
import SalaryCalc from "@/components/landing/SalaryCalc";
import Reveal from "@/components/landing/Reveal";
import Link from "next/link";
import { getStats } from "@/lib/data";

export const metadata = {
  title: { absolute: "SponsorRoute — UK Visa Sponsor Jobs" },
  description:
    "Find UK jobs from employers on the Home Office register of licensed visa sponsors. IT and care roles, checked against the official sponsor register.",
  alternates: { canonical: "/" },
};

const sectors = [
  {
    name: "Healthcare",
    count: "View roles →",
    href: "/jobs?category=care",
    bg: "#DCFCEF",
    color: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <path d="M3 12h4l2 5 4-10 2 5h6" />
      </svg>
    ),
  },
  {
    name: "Social Care",
    count: "View roles →",
    href: "/jobs?category=care",
    bg: "#EEEBFE",
    color: "#5B43E8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0-2-5.2M21 20a5 5 0 0 0-4-4.9" />
      </svg>
    ),
  },
  {
    name: "Technology",
    count: "View roles →",
    href: "/jobs?category=IT",
    bg: "#E4F1FF",
    color: "#2E90FA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 6l-2 12" />
      </svg>
    ),
  },
  {
    name: "Business",
    count: "View roles →",
    href: "/jobs?search=business",
    bg: "#FEF3DA",
    color: "#F59E0B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <path d="M4 19V9M10 19V5M16 19v-7M21 19H3" />
      </svg>
    ),
  },
  {
    name: "Finance",
    count: "View roles →",
    href: "/jobs?search=finance",
    bg: "#DCFCEF",
    color: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 14a2.5 2 0 0 0 5 0c0-2.5-5-1.5-5-4a2.5 2 0 0 1 5 0" />
      </svg>
    ),
  },
  {
    name: "Explore all",
    count: "View sectors",
    href: "/jobs",
    bg: "#EEEBFE",
    color: "#5B43E8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
        <circle cx="5" cy="12" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="19" cy="12" r="1.6" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "1. Discover jobs",
    desc: "Find live sponsored roles that match your field and skills.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
      </svg>
    ),
  },
  {
    title: "2. We check the register",
    desc: "Each employer is matched to the official Home Office sponsor list.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
        <path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
      </svg>
    ),
  },
  {
    title: "3. Apply directly",
    desc: "Click through to the job listing to apply.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
        <path d="M3 11l18-7-7 18-2-7-9-4z" />
      </svg>
    ),
  },
  {
    title: "4. Get sponsored",
    desc: "Take the real next step toward your UK career.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
        <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 16l-5 2.7 1-5.5-4-3.9 5.5-.8z" />
      </svg>
    ),
  },
];

const badges = [
  {
    pill: "SPONSOR CONFIRMED",
    pillClass: "bg-v-green-soft text-v-green",
    dotClass: "bg-v-green",
    title: "On the register & says so",
    desc: "Employer is a licensed sponsor and the listing explicitly mentions visa sponsorship. The gold standard.",
  },
  {
    pill: "LICENSED SPONSOR",
    pillClass: "bg-violet-soft text-violet",
    dotClass: "bg-violet",
    title: "On the register",
    desc: "The organisation holds a valid sponsor licence, even if this ad doesn't spell it out. Strong odds.",
  },
  {
    pill: "SPONSORSHIP MENTIONED",
    pillClass: "bg-v-amber-soft text-v-amber",
    dotClass: "bg-v-amber",
    title: "Worth a look",
    desc: "The listing references sponsorship but the employer isn't on the register yet. Behind a toggle.",
  },
];

export default async function HomePage() {
  const dbStats = await getStats();
  return (
    <div className="bg-v-bg text-v-ink font-sans overflow-x-hidden" style={{ fontFamily: "var(--font-body), sans-serif" }}>
      <Nav />

      {/* ── HERO ── */}
      <header className="pt-[150px] pb-[30px] relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-7 grid grid-cols-[1.02fr_0.98fr] gap-10 items-center max-[940px]:grid-cols-1">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-[9px] bg-white border border-v-line shadow-[0_14px_44px_rgba(28,20,64,.07)] px-4 py-[9px] rounded-full text-[14px] font-semibold text-violet mb-[26px]">
              <span className="text-violet-2">✦</span> Verified sponsors only. No dead ends.
            </div>
            <h1
              className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2.8rem,6.4vw,4.9rem)]"
            >
              Find UK jobs<br />
              that <span className="text-violet">sponsor</span><br />
              <span className="text-violet">your visa.</span>
            </h1>
            <p className="text-v-muted text-[19px] max-w-[430px] mt-[26px] mb-[34px]">
              Nurse, carer, developer or business grad — every listing is cross-checked against the official Home Office sponsor register before you ever apply.
            </p>
            <div className="flex items-center gap-[18px] flex-wrap">
              <Link
                href="/jobs"
                className="font-jakarta font-bold text-[15px] px-[22px] py-[11px] rounded-xl bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.32)] hover:bg-[#4a34d4] hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 inline-flex items-center gap-2"
              >
                Explore jobs →
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-3 font-semibold text-v-ink"
              >
                <span className="w-[46px] h-[46px] rounded-full border border-v-line bg-white flex items-center justify-center text-violet shadow-[0_14px_44px_rgba(28,20,64,.07)] hover:bg-violet hover:text-white transition-all duration-200 text-sm">
                  ↓
                </span>
                How it works
              </a>
            </div>
          </div>

          {/* Right – animated stage */}
          <HeroStage />
        </div>

        {/* Trust strip */}
        <div className="max-w-[1240px] mx-auto px-7 mt-10">
          <div className="bg-white border border-v-line rounded-[20px] shadow-[0_14px_44px_rgba(28,20,64,.07)] px-[30px] py-6 flex items-center justify-between gap-6 flex-wrap">
            <span className="font-jakarta font-bold text-[15px] text-v-ink">Cross-checked against the Home Office register</span>
            <div className="flex gap-7 flex-wrap text-[14.5px] text-v-muted">
              {[
                ["125,222", "licensed sponsors"],
                ["5", "sectors covered"],
                ["Daily", "updates"],
                ["0", "dead-end applications"],
              ].map(([val, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <b className="text-violet font-jakarta">{val}</b> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── SECTORS ── */}
      <section id="sectors" className="pt-[50px] pb-[90px] max-w-[1240px] mx-auto px-7">
        <div className="text-center max-w-[640px] mx-auto mb-[18px]">
          <div className="text-violet font-jakarta font-bold text-[14px] tracking-[0.04em] uppercase mb-[14px]">Browse by sector</div>
          <h2 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,4.4vw,3.2rem)]">
            Sponsorship isn&apos;t just <span className="text-violet">for techies.</span>
          </h2>
          <p className="text-v-muted mt-3.5 text-[17px]">Real sponsored roles across the fields that actually hire from overseas.</p>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-12 max-[980px]:grid-cols-3 max-[560px]:grid-cols-2">
          {sectors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              <Link
                href={s.href}
                className="group block bg-white border border-v-line rounded-[18px] p-[22px] hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(28,20,64,.13)] hover:border-transparent transition-all duration-300 cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-[13px] flex items-center justify-center mb-[18px]"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <h4 className="font-jakarta font-bold text-[1.05rem]">{s.name}</h4>
                <div className="text-v-muted text-[13.5px] mt-0.5">{s.count}</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-[90px] bg-violet-tint">
        <div className="max-w-[1240px] mx-auto px-7">
          <div className="text-center max-w-[640px] mx-auto mb-[18px]">
            <Reveal>
              <div className="text-violet font-jakarta font-bold text-[14px] tracking-[0.04em] uppercase mb-[14px]">How it works</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,4.4vw,3.2rem)]">
                Four steps. <span className="text-violet">No wasted applications.</span>
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-4 gap-3.5 mt-[54px] relative max-[880px]:grid-cols-2 max-[880px]:gap-7 max-[480px]:grid-cols-1">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="group text-center px-3 relative">
                  <div className="w-[74px] h-[74px] rounded-[22px] bg-white shadow-[0_14px_44px_rgba(28,20,64,.07)] flex items-center justify-center mx-auto mb-5 text-violet group-hover:bg-violet group-hover:text-white group-hover:-translate-y-1.5 transition-all duration-300">
                    {s.icon}
                  </div>
                  <h4 className="font-jakarta font-bold text-[1.08rem] mb-1.5">{s.title}</h4>
                  <p className="text-v-muted text-[14.5px]">{s.desc}</p>
                  {i < 3 && (
                    <span className="absolute top-[30px] right-[-22px] text-violet-soft text-[20px] max-[880px]:hidden">→</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFICATION ── */}
      <section id="verify" className="py-[90px] max-w-[1240px] mx-auto px-7">
        <div className="text-center max-w-[640px] mx-auto mb-[18px]">
          <Reveal>
            <div className="text-violet font-jakarta font-bold text-[14px] tracking-[0.04em] uppercase mb-[14px]">Verification</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,4.4vw,3.2rem)]">
              Three signals. <span className="text-violet">Zero guessing.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-v-muted mt-3.5 text-[17px]">Every job carries a confidence badge so you know the odds before you apply.</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-[50px] max-[860px]:grid-cols-1">
          {badges.map((b, i) => (
            <Reveal key={b.pill} delay={i * 0.1}>
              <div className="bg-white border border-v-line rounded-[18px] p-[30px] shadow-[0_14px_44px_rgba(28,20,64,.07)] hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(28,20,64,.13)] transition-all duration-300">
                <div className={`inline-flex items-center gap-2 font-jakarta font-bold text-[12px] px-[13px] py-[7px] rounded-full mb-5 ${b.pillClass}`}>
                  <span className={`w-2 h-2 rounded-full ${b.dotClass}`} />
                  {b.pill}
                </div>
                <h4 className="font-jakarta font-bold text-[1.25rem] mb-[9px]">{b.title}</h4>
                <p className="text-v-muted text-[15px]">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SALARY CALCULATOR ── */}
      <section id="calc" className="py-[90px] max-w-[1240px] mx-auto px-7">
        <Reveal>
          <div className="bg-white border border-v-line rounded-[26px] shadow-[0_14px_44px_rgba(28,20,64,.07)] p-[46px] grid grid-cols-[1fr_1.05fr] gap-[54px] items-center max-[900px]:grid-cols-1 max-[900px]:gap-[34px] max-[900px]:p-[34px]">
            <div>
              <div className="text-violet font-jakarta font-bold text-[14px] tracking-[0.04em] uppercase mb-3.5">Salary check</div>
              <h2 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(1.9rem,3.6vw,2.6rem)]">
                Will it clear the <span className="text-violet">threshold?</span>
              </h2>
              <p className="text-v-muted mt-4 text-[16.5px]">
                The 2026 general Skilled Worker threshold is <strong>£41,700</strong> — or the role&apos;s going rate, whichever is higher. Works for a nurse, a carer or a developer alike.
              </p>
            </div>
            <SalaryCalc />
          </div>
        </Reveal>
      </section>

      {/* ── STATS ── */}
      <section className="py-[90px] max-w-[1240px] mx-auto px-7">
        <div className="grid grid-cols-4 gap-[18px] max-[860px]:grid-cols-2">
          {[
            { value: "125,222", label: "Licensed sponsors checked" },
            { value: dbStats.total.toLocaleString("en-GB"), label: "Sponsor-checked jobs" },
            { value: "5", label: "Sectors covered" },
            { value: "24h", label: "Refresh cycle" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="bg-white border border-v-line rounded-[18px] px-[26px] py-[34px] shadow-[0_14px_44px_rgba(28,20,64,.07)] text-center">
                <div className="font-jakarta font-extrabold text-[clamp(2rem,4vw,3rem)] text-violet">
                  {s.value}
                </div>
                <div className="text-v-muted text-[14px] mt-1.5">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-[90px] max-w-[1240px] mx-auto px-7">
        <Reveal>
          <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-br from-violet to-violet-2 px-10 py-20 text-center text-white">
            <div
              className="absolute w-[360px] h-[360px] rounded-full top-[-160px] right-[-120px]"
              style={{ background: "rgba(255,255,255,0.12)", filter: "blur(10px)" }}
            />
            <h2 className="font-jakarta font-extrabold tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,5vw,3.4rem)] relative">
              Stop applying into the void.
            </h2>
            <p className="opacity-90 mt-4 mb-[30px] max-w-[520px] mx-auto relative">
              Browse jobs from employers who can actually sponsor your UK visa — verified, every day.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 font-jakarta font-bold text-[16px] px-8 py-4 rounded-xl bg-white text-violet hover:-translate-y-0.5 active:scale-[0.96] transition-all duration-200 relative"
            >
              Find your sponsored job →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-[1240px] mx-auto px-7 pt-[70px] pb-10">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-7 mb-10 max-[780px]:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-jakarta font-extrabold text-[21px] text-v-ink no-underline">
              <span className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet to-violet-2 flex items-center justify-center text-white text-[18px] shadow-[0_6px_16px_rgba(91,67,232,0.4)]">
                S
              </span>
              Sponsor<span className="text-violet">Route</span>
            </Link>
            <p className="text-v-muted text-[15px] mt-3.5 max-w-[280px]">
              The UK visa-sponsorship job board that only shows employers who can actually sponsor you.
            </p>
          </div>
          <div>
            <h5 className="font-jakarta font-bold text-[14px] mb-3.5">Product</h5>
            <Link href="/jobs" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Browse jobs</Link>
            <a href="#how" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">How it works</a>
            <a href="#calc" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Salary check</a>
            <Link href="/contact" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Contact</Link>
          </div>
          <div>
            <h5 className="font-jakarta font-bold text-[14px] mb-3.5">Sectors</h5>
            <Link href="/jobs?category=care" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Healthcare</Link>
            <Link href="/jobs?category=care" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Social Care</Link>
            <Link href="/jobs?category=IT" className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors">Tech &amp; Business</Link>
          </div>
          <div>
            <h5 className="font-jakarta font-bold text-[14px] mb-3.5">Data</h5>
            <a
              href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-v-muted text-[15px] mb-2.5 hover:text-violet transition-colors"
            >
              Sponsor register ↗
            </a>
            <span className="block text-v-muted text-[15px] mb-2.5">Updated daily</span>
            <span className="block text-v-muted text-[15px] mb-2.5">Source: Adzuna</span>
          </div>
        </div>
        <div className="border-t border-v-line pt-6 flex justify-between text-v-muted text-[14px] flex-wrap gap-2.5">
          <span>© 2026 SponsorRoute · Built in London</span>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy" className="hover:text-violet transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-violet transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-violet transition-colors">Refunds</Link>
            <span>Verified against the Home Office Register of Licensed Sponsors</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-v-muted/40 text-right">
          {(process.env.NEXT_PUBLIC_COMMIT_SHA ?? "dev").slice(0, 7)} · {process.env.NEXT_PUBLIC_BUILD_DATE ?? ""}
        </div>
      </footer>
    </div>
  );
}

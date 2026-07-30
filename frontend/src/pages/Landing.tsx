import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Compass, ShieldCheck, Globe2, ChevronRight,
  MessageSquareText, Map as MapIcon, Sparkles, Star, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useInView } from "@/hooks/useInView";
import heroImg from "@/data/registan.jpg";

// Same fade-up-on-scroll wrapper used on Home/Uzbekistan — one consistent
// entrance motion across every marketing/content page rather than a
// bespoke one for this page alone.
function Section({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(className, "transition-none", inView ? "animate-fade-up" : "opacity-0")}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openAuthModal, enterAsGuest } = useAppStore();
  const featured = LOCATIONS.filter((l) => l.featured).slice(0, 6);

  function continueAsGuest() {
    enterAsGuest();
    navigate("/home");
  }

  const FEATURES = [
    { Icon: Bot, title: t("landing", "feature1_title"), desc: t("landing", "feature1_desc") },
    { Icon: Compass, title: t("landing", "feature2_title"), desc: t("landing", "feature2_desc") },
    { Icon: ShieldCheck, title: t("landing", "feature3_title"), desc: t("landing", "feature3_desc") },
    { Icon: Globe2, title: t("landing", "feature4_title"), desc: t("landing", "feature4_desc") },
  ];

  const STATS = [
    { icon: Compass, value: "200+", label: t("home", "stats_places") },
    { icon: Star, value: "4.8", label: t("home", "stats_rating") },
    { icon: Users, value: "50K+", label: t("home", "stats_travelers") },
    { icon: Globe2, value: "6", label: t("home", "stats_langs") },
  ];

  const STEPS = [
    { Icon: MessageSquareText, title: t("landing", "how1_title"), desc: t("landing", "how1_desc") },
    { Icon: Sparkles, title: t("landing", "how2_title"), desc: t("landing", "how2_desc") },
    { Icon: MapIcon, title: t("landing", "how3_title"), desc: t("landing", "how3_desc") },
  ];

  return (
    <div className="app-bg min-h-screen overflow-x-hidden">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 py-5">
        <div>
          <img src="/img/logo-l.svg" alt="trova" className="h-7 w-auto dark:hidden" />
          <img src="/img/logo-d.svg" alt="trova" className="h-7 w-auto hidden dark:block" />
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-colors"
        >
          {t("landing", "sign_in")}
        </button>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        {/* Strong bottom-up scrim: near-opaque at the very bottom where the
            headline/CTAs sit, fully clear by the upper third so the photo
            itself stays the hero, not just a tinted backdrop. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 from-0% via-black/50 via-55% to-transparent to-100%" />

        <div className="relative w-full px-5 sm:px-8 pb-16 sm:pb-20 max-w-3xl">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Trova AI
          </div>
          <h1 className="animate-fade-up delay-75 text-4xl sm:text-6xl font-extrabold text-white leading-[1.05] mb-4 tracking-tight">
            {t("landing", "hero_title")}
          </h1>
          <p className="animate-fade-up delay-150 text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            {t("landing", "hero_subtitle")}
          </p>
          <div className="animate-fade-up delay-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => openAuthModal("register")}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold shadow-lg transition-all active:scale-[0.97] hover:-translate-y-0.5"
            >
              {t("landing", "cta_signup")}
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={continueAsGuest}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white text-sm font-bold bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all active:scale-[0.97]"
            >
              {t("landing", "cta_guest")}
            </button>
          </div>
        </div>
      </section>

      {/* ── Social proof strip ─────────────────────────────────── */}
      <Section className="px-4 sm:px-8 -mt-8 relative z-10 mb-16" delay={0}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]"
            >
              <Icon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
              <span className="text-xl font-extrabold text-[var(--foreground)] tabular-nums">{value}</span>
              <span className="text-[11px] text-[var(--muted-foreground)] text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Feature highlights ─────────────────────────────────── */}
      <Section className="px-4 sm:px-8 mb-16" delay={0}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] text-center mb-8">
            {t("landing", "features_title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="tilt-hover animate-fade-up p-5 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                </span>
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">{title}</p>
                <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── How it works ───────────────────────────────────────── */}
      <Section className="px-4 sm:px-8 mb-16" delay={0}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] text-center mb-10">
            {t("landing", "how_title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 relative">
            {/* Route-curve connector — brand motif, echoing the sidebar
                indicator and Home's hero->stats seam, tying this page
                back into the same visual language instead of a plain
                numbered list. */}
            <svg
              className="hidden sm:block absolute top-6 left-0 w-full h-3 -z-0"
              viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden="true"
            >
              <motion.path
                d="M20 6C80 6 80 6 150 6C220 6 220 6 280 6"
                stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            {STEPS.map(({ Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center gap-3">
                <span className="relative w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-md shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--background)]">
                    {i + 1}
                  </span>
                </span>
                <p className="text-sm font-bold text-[var(--foreground)]">{title}</p>
                <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Featured destinations ──────────────────────────────── */}
      <Section className="mb-16" delay={0}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              {t("landing", "destinations_title")}
            </h2>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">{t("landing", "destinations_subtitle")}</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6">
            {featured.map((loc, i) => (
              <div key={loc.id} className="shrink-0 w-56 sm:w-auto animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <LocationCard location={loc} variant="default" className="w-full" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={continueAsGuest}
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
            >
              {t("landing", "see_all")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <Section className="px-4 sm:px-8 mb-12" delay={0}>
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-[#1c7a64] p-8 sm:p-12 text-center">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{t("landing", "final_cta_title")}</h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-7 max-w-md mx-auto">{t("landing", "final_cta_desc")}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => openAuthModal("register")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 text-sm font-bold shadow-lg transition-all active:scale-[0.97] hover:-translate-y-0.5"
              >
                {t("landing", "cta_signup")}
              </button>
              <button
                onClick={continueAsGuest}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/22 border border-white/25 text-white text-sm font-bold backdrop-blur-sm transition-all active:scale-[0.97]"
              >
                {t("landing", "cta_guest")}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="px-4 sm:px-8 py-8 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <img src="/img/logo-l.svg" alt="trova" className="h-6 w-auto dark:hidden" />
            <img src="/img/logo-d.svg" alt="trova" className="h-6 w-auto hidden dark:block" />
            <p className="text-xs text-[var(--muted-foreground)]">{t("landing", "footer_tagline")}</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-[var(--muted-foreground)]">
            <button onClick={continueAsGuest} className="hover:text-[var(--foreground)] transition-colors">
              {t("nav", "about")}
            </button>
            <button onClick={continueAsGuest} className="hover:text-[var(--foreground)] transition-colors">
              {t("nav", "locations")}
            </button>
            <button onClick={continueAsGuest} className="hover:text-[var(--foreground)] transition-colors">
              {t("nav", "services")}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-[var(--muted-foreground)]/60 mt-6">
          © {new Date().getFullYear()} trova — mrforce.uz tomonidan ishlab chiqildi
        </p>
      </footer>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import {
  MapPin, Star, Users, Globe, Bot, ChevronRight,
  Compass, Sparkles, TrendingUp, Clock,
  Map as MapIcon, Landmark, Leaf, Palette, Church, Pickaxe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import { useTranslation } from "@/i18n";
import { useInView } from "@/hooks/useInView";
import heroImg from "@/data/registan.jpg";
import type { Location } from "@/types";

// ── Reusable animated section wrapper ─────────────────
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

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const featured = LOCATIONS.filter((l) => l.featured);
  const all = LOCATIONS;

  // Same monoline icon family as LocationCard's category badges — one
  // consistent geometric set app-wide instead of mixed emoji/line styles.
  const CATEGORIES: { key: Location["category"] | "all"; label: string; Icon: typeof MapIcon }[] = [
    { key: "all",         label: t("home", "cat_all"),         Icon: MapIcon  },
    { key: "tarix",       label: t("home", "cat_tarix"),       Icon: Landmark },
    { key: "tabiat",      label: t("home", "cat_tabiat"),      Icon: Leaf     },
    { key: "madaniyat",   label: t("home", "cat_madaniyat"),   Icon: Palette  },
    { key: "din",         label: t("home", "cat_din"),         Icon: Church   },
    { key: "arxeologiya", label: t("home", "cat_arxeologiya"), Icon: Pickaxe  },
  ];

  // Brand-cohesive stat tiles — every tile stays within the emerald/gold
  // palette (varied by shade+opacity) instead of unrelated rainbow pastels.
  // Icon colors deepened a step (600/700 instead of 500/600) — on a pale
  // mint chip, the brighter mid-tones read as barely-there; the darker
  // shades keep the same hue family but hold real contrast.
  const STATS = [
    { icon: Compass, value: "200+", label: t("home", "stats_places"),    color: "text-indigo-700", bg: "bg-indigo-500/10 border-indigo-500/25", glow: "shadow-indigo-500/20" },
    { icon: Star,    value: "4.8",  label: t("home", "stats_rating"),    color: "text-gold-600",   bg: "bg-gold-500/10 border-gold-500/25",     glow: "shadow-gold-500/20" },
    { icon: Users,   value: "50K+", label: t("home", "stats_travelers"), color: "text-indigo-700", bg: "bg-indigo-600/10 border-indigo-600/25", glow: "shadow-indigo-600/20" },
    { icon: Globe,   value: "6",    label: t("home", "stats_langs"),     color: "text-gold-700",   bg: "bg-gold-600/10 border-gold-600/25",     glow: "shadow-gold-600/20" },
  ];

  return (
    <div className="pb-8">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="px-4 pt-4 pb-2">
        <div className="grain-overlay relative overflow-hidden rounded-3xl border border-[var(--border)] shadow-2xl shadow-black/10">
          {/* Background photo, kept crisp — a single soft scrim (not several
              stacked gradients/blends) keeps the headline legible without
              muddying the photo underneath it. */}
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-90 dark:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/90 to-[var(--background)]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/60 via-transparent to-transparent" />
          {/* A second, warmer scrim hugging just the bottom edge (where the
              CTA row and trust indicators sit) — keeps that text legible
              without darkening/flattening the rest of the photo. */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#1c140a]/25 via-[#1c140a]/5 to-transparent dark:from-black/40 dark:via-black/10" />
          <div className="aurora-overlay absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative px-5 sm:px-8 pt-10 pb-10 max-w-3xl">
            {/* Badge */}
            <div className="glint animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
              {t("home", "badge")}
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-75 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient leading-[1.05] pb-1 mb-4 tracking-tight">
              {t("home", "hero_title")}
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up delay-150 text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed mb-7 max-w-lg">
              {t("home", "hero_subtitle")}
            </p>

            {/* CTAs — Trova AI is the product's core, so it visibly outweighs
                the secondary action: bigger, filled, with a pulsing glow
                behind its icon (the route-curve motif breathing); browsing
                the catalog stays a plain outline button, clearly secondary. */}
            <div className="animate-fade-up delay-200 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/chat")}
                className="btn-shine btn-aura ripple group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-base font-bold transition-all active:scale-[0.97] shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              >
                <span className="relative w-6 h-6 shrink-0 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-white/25 animate-breathe" />
                  <Bot className="relative w-5 h-5" />
                </span>
                {t("home", "ai_btn")}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/locations")}
                className="ripple flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] hover:border-indigo-500/40 hover:bg-[var(--card)] text-[var(--foreground)] text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
              >
                {t("home", "explore_btn")}
              </button>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-up delay-300 flex items-center gap-4 mt-6">
              <div className="flex -space-x-1.5">
                {["#50c878","#7fe0ae","#218f76","#93d7c5","#38a860"].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--background)]" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">
                <span className="font-semibold text-[var(--foreground)]">50,000+</span>{" "}
                {t("home", "stats_travelers")}
              </span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                ))}
                <span className="text-xs font-semibold text-[var(--foreground)] ml-0.5">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero → Stats transition ───────────────────────────────
          A route-curve line instead of a straight seam between the hero
          card and the stats row — the same S-curve motif as the logo and
          sidebar indicator, threaded through the page instead of a hard
          rule. */}
      <div className="px-4 mt-4 mb-4 flex justify-center pointer-events-none" aria-hidden="true">
        <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
          <path
            d="M2 6C22 6 22 2 42 2C62 2 62 10 82 10C97 10 97 6 118 6"
            stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"
          />
        </svg>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="px-4 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ icon: Icon, value, label, color, glow }, i) => {
            // The rating is the single most persuasive trust signal on the
            // page — it gets a visibly larger card and a mint outline
            // instead of being just another equal-weight tile in the row.
            const isRating = label === t("home", "stats_rating");
            return (
              <div
                key={label}
                className={cn(
                  "tilt-hover animate-fade-up flex flex-col items-center gap-2.5 rounded-2xl border transition-all duration-300 cursor-default",
                  "bg-[var(--card)] shadow-[var(--shadow-card)] hover:shadow-lg",
                  isRating
                    ? "p-5 border-gold-500/40 ring-1 ring-gold-500/20"
                    : "p-4 border-[var(--border)]",
                  `hover:${glow}`
                )}
                style={{ animationDelay: `${i * 80 + 100}ms` }}
              >
                <div className={cn(
                  "rounded-2xl flex items-center justify-center shadow-md",
                  isRating ? "w-[3.25rem] h-[3.25rem]" : "w-11 h-11",
                  "bg-gradient-to-br from-[var(--muted)] to-[var(--card)] border border-[var(--border)]"
                )}>
                  <Icon className={cn(isRating ? "w-6 h-6" : "w-5 h-5", color)} />
                </div>
                <span className={cn(
                  "font-extrabold text-[var(--foreground)] tabular-nums",
                  isRating ? "text-2xl" : "text-xl"
                )}>
                  {value}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] text-center leading-tight font-medium">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <Section className="px-4 mb-8" delay={50}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
            {t("home", "cat_all")}
          </h2>
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.key}
                onClick={() => navigate("/locations")}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all active:scale-[0.97]",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  cat.key === "all"
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/25"
                    : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:shadow-indigo-500/10"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <cat.Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {cat.label}
                {/* Route-curve underline on the active pill instead of a
                    flat bar — the same S-curve as the sidebar indicator. */}
                {cat.key === "all" && (
                  <svg
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                    width="20" height="6" viewBox="0 0 20 6" fill="none" aria-hidden="true"
                  >
                    <path d="M1 1C6 1 6 5 10 5C14 5 14 1 19 1" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Featured locations ────────────────────────────────── */}
      <Section className="mb-8" delay={0}>
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="reveal-wipe text-base font-bold text-[var(--foreground)]">
              {t("home", "featured_title")}
            </h2>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold border border-indigo-500/20">
              {featured.length}
            </span>
          </div>
          <button
            onClick={() => navigate("/locations")}
            className="group text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors flex items-center gap-0.5"
          >
            {t("home", "see_all")}
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {featured.map((loc, i) => (
            <div
              key={loc.id}
              className="animate-fade-up shrink-0 w-56 sm:w-64 lg:w-72"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <LocationCard location={loc} variant="featured" className="w-full" />
            </div>
          ))}
        </div>
      </Section>

      {/* ── All locations grid ────────────────────────────────── */}
      <Section className="px-4 mb-8" delay={0}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="reveal-wipe text-base font-bold text-[var(--foreground)]">
            {t("home", "all_title")}
          </h2>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[11px] text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
              {all.length}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {all.map((loc, i) => (
            <div
              key={loc.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 55, 500)}ms` }}
            >
              <LocationCard location={loc} variant="default" />
            </div>
          ))}
        </div>
      </Section>

      {/* ── AI Banner ─────────────────────────────────────────── */}
      <Section className="px-4" delay={0}>
        <button
          onClick={() => navigate("/chat")}
          className="btn-shine ripple group w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-left transition-all hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.99] hover:-translate-y-0.5"
        >
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-3 right-20 w-10 h-10 bg-white/8 rounded-full pointer-events-none animate-breathe" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shadow-md backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">AI Bek</p>
                <p className="text-white/65 text-[11px]">{t("home", "ai_banner_title")}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              {t("home", "ai_banner_desc")}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/22 transition-all px-4 py-2 rounded-xl text-white text-xs font-semibold group-hover:gap-2.5 backdrop-blur-sm border border-white/10">
              {t("home", "ai_banner_btn")}
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </button>
      </Section>
    </div>
  );
}

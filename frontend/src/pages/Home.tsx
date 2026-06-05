import { useNavigate } from "react-router-dom";
import {
  MapPin, Star, Users, Globe, Bot, ChevronRight,
  Compass, Sparkles, TrendingUp, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import { useTranslation } from "@/i18n";
import { useInView } from "@/hooks/useInView";
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

  const CATEGORIES: { key: Location["category"] | "all"; label: string; emoji: string }[] = [
    { key: "all",         label: t("home", "cat_all"),         emoji: "🗺️" },
    { key: "tarix",       label: t("home", "cat_tarix"),       emoji: "🏛️" },
    { key: "tabiat",      label: t("home", "cat_tabiat"),      emoji: "🌿" },
    { key: "madaniyat",   label: t("home", "cat_madaniyat"),   emoji: "🎭" },
    { key: "din",         label: t("home", "cat_din"),         emoji: "🕌" },
    { key: "arxeologiya", label: t("home", "cat_arxeologiya"), emoji: "⛏️" },
  ];

  const STATS = [
    { icon: Compass,    value: "200+", label: t("home", "stats_places"),    color: "text-indigo-500",  bg: "bg-indigo-500/10 border-indigo-500/20",  glow: "shadow-indigo-500/20" },
    { icon: Star,       value: "4.8",  label: t("home", "stats_rating"),    color: "text-amber-500",  bg: "bg-amber-500/10 border-amber-500/20",    glow: "shadow-amber-500/20" },
    { icon: Users,      value: "50K+", label: t("home", "stats_travelers"), color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20",  glow: "shadow-purple-500/20" },
    { icon: Globe,      value: "6",    label: t("home", "stats_langs"),     color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/20",      glow: "shadow-blue-500/20" },
  ];

  return (
    <div className="pb-8">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-8 pb-10">
        {/* Animated gradient orbs */}
        <div className="absolute -top-32 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-breathe" />
        <div className="absolute top-8 left-1/2 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl pointer-events-none"
          style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 -left-16 w-80 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-4">
            🇺🇿 {t("home", "badge")}
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-75 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--foreground)] leading-none mb-4 tracking-tight">
            {t("home", "hero_title")}
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-150 text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed mb-7 max-w-lg">
            {t("home", "hero_subtitle")}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-200 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/locations")}
              className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-all active:scale-[0.97] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {t("home", "explore_btn")}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 hover:bg-indigo-500/5 text-[var(--foreground)] text-sm font-semibold transition-all active:scale-[0.97] shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              {t("home", "ai_btn")}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up delay-300 flex items-center gap-4 mt-6">
            <div className="flex -space-x-1.5">
              {["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981"].map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--background)]" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              <span className="font-semibold text-[var(--foreground)]">50,000+</span>{" "}
              {t("home", "stats_travelers")}
            </span>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-xs font-semibold text-[var(--foreground)] ml-0.5">4.8</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="px-4 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ icon: Icon, value, label, color, bg, glow }, i) => (
            <div
              key={label}
              className={cn(
                "animate-fade-up flex flex-col items-center gap-2.5 p-4 rounded-2xl border",
                "hover:shadow-lg transition-all duration-300 cursor-default hover:-translate-y-0.5",
                bg, `hover:shadow-lg ${glow}`
              )}
              style={{ animationDelay: `${i * 80 + 100}ms` }}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg, "border shadow-sm")}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <span className="text-xl font-extrabold text-[var(--foreground)] tabular-nums">
                {value}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] text-center leading-tight font-medium">
                {label}
              </span>
            </div>
          ))}
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
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all active:scale-[0.97]",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  cat.key === "all"
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/25"
                    : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:shadow-indigo-500/10"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Featured locations ────────────────────────────────── */}
      <Section className="mb-8" delay={0}>
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--foreground)]">
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
          <h2 className="text-base font-bold text-[var(--foreground)]">
            {t("home", "all_title")}
          </h2>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-[11px] text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
              {all.length}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-left transition-all hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.99] hover:-translate-y-0.5"
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

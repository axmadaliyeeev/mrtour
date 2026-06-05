import { useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Globe, Bot, ChevronRight, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import { useTranslation } from "@/i18n";
import type { Location } from "@/types";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const featured = LOCATIONS.filter((l) => l.featured);
  const all = LOCATIONS;

  const CATEGORIES: { key: Location["category"] | "all"; label: string; emoji: string }[] = [
    { key: "all",         label: t("home", "cat_all"),        emoji: "🗺️" },
    { key: "tarix",       label: t("home", "cat_tarix"),      emoji: "🏛️" },
    { key: "tabiat",      label: t("home", "cat_tabiat"),     emoji: "🌿" },
    { key: "madaniyat",   label: t("home", "cat_madaniyat"),  emoji: "🎭" },
    { key: "din",         label: t("home", "cat_din"),        emoji: "🕌" },
    { key: "arxeologiya", label: t("home", "cat_arxeologiya"),emoji: "⛏️" },
  ];

  const STATS = [
    { icon: Compass, value: "200+", label: t("home", "stats_places"),    color: "text-indigo-400",   bg: "bg-indigo-500/10 border-indigo-500/20" },
    { icon: Star,    value: "4.8",  label: t("home", "stats_rating"),    color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: Users,   value: "50K+", label: t("home", "stats_travelers"), color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { icon: Globe,   value: "6",    label: t("home", "stats_langs"),     color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  ];

  return (
    <div className="pb-6">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-7 pb-9">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/12 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-4">
            🇺🇿 {t("home", "badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] leading-tight mb-3">
            {t("home", "hero_title")}
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            {t("home", "hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/locations")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-all active:scale-[0.97] shadow-lg shadow-indigo-500/25"
            >
              {t("home", "explore_btn")}
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 text-[var(--foreground)] text-sm font-semibold transition-all active:scale-[0.97]"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              {t("home", "ai_btn")}
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="px-4 mb-7">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STATS.map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-2 p-3.5 sm:p-4 rounded-2xl border transition-colors",
                bg
              )}
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", bg, "border")}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <span className="text-base sm:text-lg font-extrabold text-[var(--foreground)]">
                {value}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--muted-foreground)] text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="px-4 mb-7">
        <h2 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          {t("home", "cat_all")}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate("/locations")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all",
                cat.key === "all"
                  ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 hover:bg-indigo-500/5"
              )}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured locations ────────────────────────────────── */}
      <section className="mb-7">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            {t("home", "featured_title")}
          </h2>
          <button
            onClick={() => navigate("/locations")}
            className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            {t("home", "see_all")} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {featured.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              variant="featured"
              className="w-56 sm:w-64 lg:w-72"
            />
          ))}
        </div>
      </section>

      {/* ── All locations grid ────────────────────────────────── */}
      <section className="px-4 mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            {t("home", "all_title")}
          </h2>
          <span className="text-[11px] text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            {all.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {all.map((loc) => (
            <LocationCard key={loc.id} location={loc} variant="default" />
          ))}
        </div>
      </section>

      {/* ── AI Banner ─────────────────────────────────────────── */}
      <section className="px-4">
        <button
          onClick={() => navigate("/chat")}
          className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-left group transition-all hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98]"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-16 w-8 h-8 bg-white/8 rounded-full" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">AI Bek</p>
                <p className="text-white/70 text-[11px]">{t("home", "ai_banner_title")}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-3">
              {t("home", "ai_banner_desc")}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-xl text-white text-xs font-semibold group-hover:gap-2">
              {t("home", "ai_banner_btn")} <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </section>
    </div>
  );
}

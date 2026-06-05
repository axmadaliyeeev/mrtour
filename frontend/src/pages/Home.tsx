import { useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Globe, Bot, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import type { Location } from "@/types";

const CATEGORIES: { key: Location["category"] | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "Barchasi", emoji: "🗺️" },
  { key: "tarix", label: "Tarix", emoji: "🏛️" },
  { key: "tabiat", label: "Tabiat", emoji: "🌿" },
  { key: "madaniyat", label: "Madaniyat", emoji: "🎭" },
  { key: "din", label: "Din", emoji: "🕌" },
  { key: "arxeologiya", label: "Arxeologiya", emoji: "⛏️" },
];

const STATS = [
  { icon: MapPin, value: "200+", label: "Joy", color: "text-teal-400" },
  { icon: Star, value: "4.8", label: "O'rtacha reyting", color: "text-amber-400" },
  { icon: Users, value: "50K+", label: "Sayohatchi", color: "text-purple-400" },
  { icon: Globe, value: "6", label: "Til", color: "text-blue-400" },
];

export default function Home() {
  const navigate = useNavigate();
  const featured = LOCATIONS.filter((l) => l.featured);
  const all = LOCATIONS;

  return (
    <div className="pb-6">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-8 pb-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-teal-600/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-4">
            🇺🇿 Rasmiy turizm gidi
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] leading-tight mb-3">
            O&apos;zbekistonni{" "}
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Kashf Et
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base leading-relaxed mb-6 max-w-lg">
            Ipak yo&apos;li mamlakati — ming yillik tarix, go&apos;zal tabiat va
            mehmon do&apos;st xalq. AI yordamchi bilan sayohatingizni rejalashtiring.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/locations")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-all active:scale-[0.97] shadow-lg shadow-teal-500/25"
            >
              Joylarni ko&apos;rish
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-teal-500/40 text-[var(--foreground)] text-sm font-semibold transition-all active:scale-[0.97]"
            >
              <Bot className="w-4 h-4 text-teal-400" />
              AI Bek
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <Icon className={cn("w-4 h-4", color)} />
              <span className="text-base font-bold text-[var(--foreground)]">
                {value}
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)] text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-3">
          Kategoriyalar
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate("/locations")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium shrink-0 transition-all",
                cat.key === "all"
                  ? "bg-teal-500 border-teal-500 text-white"
                  : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-teal-500/40"
              )}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured locations ────────────────────────────────── */}
      <section className="mb-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            Tanlovchi joylar
          </h2>
          <button
            onClick={() => navigate("/locations")}
            className="text-xs text-teal-400 font-medium hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            Barchasi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {featured.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              variant="featured"
              className="w-56 md:w-64"
            />
          ))}
        </div>
      </section>

      {/* ── All locations grid ────────────────────────────────── */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-3">
          Barcha joylar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {all.map((loc) => (
            <LocationCard key={loc.id} location={loc} variant="default" />
          ))}
        </div>
      </section>

      {/* ── AI Banner ─────────────────────────────────────────── */}
      <section className="px-4">
        <button
          onClick={() => navigate("/chat")}
          className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-5 text-left group transition-all hover:shadow-xl hover:shadow-teal-500/20 active:scale-[0.98]"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="text-white font-bold text-sm">AI Bek</p>
                <p className="text-white/70 text-[11px]">Shaxsiy turizm yordamchisi</p>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Sayohat rejasi, mehmonxona tavsiyalari, valyuta kursi va ko&apos;proq — AI
              bilan bir daqiqada!
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-white text-xs font-semibold group-hover:gap-2 transition-all">
              Suhbat boshlash <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </section>
    </div>
  );
}

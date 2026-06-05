"use client";

import { useRouter } from "next/navigation";
import { MapPin, Bookmark, BookmarkCheck, Clock } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { useAppStore } from "@/store";
import type { Location } from "@/types";

const CATEGORY_CONFIG: Record<Location["category"], { label: string; color: string; emoji: string }> = {
  tarix:       { label: "Tarix",        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",    emoji: "🏛️" },
  tabiat:      { label: "Tabiat",       color: "bg-green-500/20 text-green-400 border-green-500/30",    emoji: "🌿" },
  madaniyat:   { label: "Madaniyat",   color: "bg-purple-500/20 text-purple-400 border-purple-500/30", emoji: "🎭" },
  din:         { label: "Din",          color: "bg-teal-500/20 text-teal-400 border-teal-500/30",       emoji: "🕌" },
  arxeologiya: { label: "Arxeologiya", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", emoji: "⛏️" },
};

interface LocationCardProps {
  location:   Location;
  variant?:   "default" | "featured";
  className?: string;
}

export function LocationCard({ location, variant = "default", className }: LocationCardProps) {
  const router  = useRouter();
  const { addToPlan, removeFromPlan, isInPlan } = useAppStore();
  const inPlan  = isInPlan(location.id);
  const cat     = CATEGORY_CONFIG[location.category];

  const goToDetail = () => router.push(`/locations/${location.id}`);

  const togglePlan = (e: React.MouseEvent) => {
    e.stopPropagation();
    inPlan ? removeFromPlan(location.id) : addToPlan(location);
  };

  /* ── Featured ──────────────────────────────────────── */
  if (variant === "featured") {
    return (
      <div
        onClick={goToDetail}
        className={cn(
          "relative h-64 rounded-2xl overflow-hidden cursor-pointer group shrink-0",
          className
        )}
      >
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className={cn("absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full border backdrop-blur-sm", cat.color)}>
          {cat.emoji} {cat.label}
        </span>
        <button onClick={togglePlan} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90", inPlan ? "bg-teal-500 text-white" : "bg-black/40 text-white hover:bg-black/60")}>
          {inPlan ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-tight mb-1">{location.name}</h3>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white/70 text-xs"><MapPin className="w-3 h-3" />{location.city}</span>
            <Stars rating={location.rating} size="sm" showNumber />
          </div>
        </div>
      </div>
    );
  }

  /* ── Default ───────────────────────────────────────── */
  return (
    <div
      onClick={goToDetail}
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden cursor-pointer",
        "hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5",
        "transition-all duration-200 group",
        className
      )}
    >
      <div className="relative h-48 bg-[var(--muted)] overflow-hidden">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={cn("absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full border backdrop-blur-sm", cat.color)}>
          {cat.emoji} {cat.label}
        </span>
        <span className={cn("absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm", location.priceUSD === 0 ? "bg-green-500/80 text-white" : "bg-black/60 text-teal-300")}>
          {location.priceUSD === 0 ? "Bepul" : `~$${location.priceUSD}`}
        </span>
        <button onClick={togglePlan} className={cn("absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90", inPlan ? "bg-teal-500 text-white" : "bg-black/50 text-white/80 hover:bg-teal-500/80")}>
          {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-[var(--foreground)]">{location.name}</h3>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] truncate max-w-[60%]">
            <MapPin className="w-3 h-3 shrink-0" />{location.city}
          </span>
          <Stars rating={location.rating} size="sm" showNumber count={location.reviewCount} showCount />
        </div>
        {location.shortDesc && (
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{truncate(location.shortDesc, 90)}</p>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/50">
          <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
            <Clock className="w-3 h-3" />{location.duration}
          </span>
          <div className="flex gap-1">
            {location.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

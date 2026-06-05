import { useNavigate } from "react-router-dom";
import { MapPin, Bookmark, BookmarkCheck, Clock, Star } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Location } from "@/types";

const CAT: Record<
  Location["category"],
  { label: string; color: string; bg: string; emoji: string }
> = {
  tarix:       { label: "Tarix",       color: "text-amber-400",  bg: "bg-amber-500/20 border-amber-500/30",   emoji: "🏛️" },
  tabiat:      { label: "Tabiat",      color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30", emoji: "🌿" },
  madaniyat:   { label: "Madaniyat",   color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30", emoji: "🎭" },
  din:         { label: "Din",         color: "text-teal-400",   bg: "bg-teal-500/20 border-teal-500/30",     emoji: "🕌" },
  arxeologiya: { label: "Arxeologiya", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", emoji: "⛏️" },
};

interface LocationCardProps {
  location: Location;
  variant?: "default" | "featured";
  className?: string;
}

export function LocationCard({ location, variant = "default", className }: LocationCardProps) {
  const navigate = useNavigate();
  const { addToPlan, removeFromPlan, isInPlan } = useAppStore();
  const inPlan = isInPlan(location.id);
  const cat = CAT[location.category];

  const go = () => navigate(`/locations/${location.id}`);

  const bookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inPlan) removeFromPlan(location.id);
    else addToPlan(location);
  };

  /* ── Featured variant ──────────────────────────────── */
  if (variant === "featured") {
    return (
      <div
        onClick={go}
        className={cn(
          "relative h-64 rounded-2xl overflow-hidden cursor-pointer group shrink-0",
          "shadow-lg hover:shadow-2xl hover:shadow-black/30 transition-all duration-300",
          className
        )}
      >
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400&q=60";
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Category badge */}
        <span className={cn(
          "absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md",
          cat.bg, cat.color
        )}>
          {cat.emoji} {cat.label}
        </span>

        {/* Price badge */}
        <span className={cn(
          "absolute top-3 right-12 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md",
          location.priceUSD === 0
            ? "bg-emerald-500/80 text-white"
            : "bg-black/50 text-teal-300 border border-teal-500/30"
        )}>
          {location.priceUSD === 0 ? "Bepul" : `~$${location.priceUSD}`}
        </span>

        {/* Bookmark button */}
        <button
          onClick={bookmark}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90",
            inPlan ? "bg-teal-500 text-white shadow-lg shadow-teal-500/40" : "bg-black/40 text-white hover:bg-teal-500/70"
          )}
          aria-label={inPlan ? "Rejadan olib tashlash" : "Rejaga qo'shish"}
        >
          {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-tight mb-1.5 drop-shadow-md">
            {location.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white/75 text-xs">
              <MapPin className="w-3 h-3" />
              {location.city}
            </span>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{location.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Default variant ───────────────────────────────── */
  return (
    <div
      onClick={go}
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden cursor-pointer",
        "hover:border-teal-500/40 hover:shadow-card-hover hover:-translate-y-1",
        "transition-all duration-300 ease-spring group",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[var(--muted)]">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Category badge */}
        <span className={cn(
          "absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md",
          cat.bg, cat.color
        )}>
          {cat.emoji} {cat.label}
        </span>

        {/* Price badge */}
        <span className={cn(
          "absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-md",
          location.priceUSD === 0
            ? "bg-emerald-500/80 text-white"
            : "bg-black/55 text-teal-300 border border-teal-500/20"
        )}>
          {location.priceUSD === 0 ? "Bepul" : `~$${location.priceUSD}`}
        </span>

        {/* Bookmark */}
        <button
          onClick={bookmark}
          className={cn(
            "absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-md",
            inPlan
              ? "bg-teal-500 text-white shadow-teal-500/40"
              : "bg-black/50 text-white/80 hover:bg-teal-500/80"
          )}
          aria-label={inPlan ? "Rejadan olib tashlash" : "Rejaga qo'shish"}
        >
          {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-[var(--foreground)] leading-snug line-clamp-1">
          {location.name}
        </h3>

        {/* City + Rating */}
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] truncate">
            <MapPin className="w-3 h-3 shrink-0 text-teal-500" />
            {location.city}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold text-[var(--foreground)]">{location.rating}</span>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              ({location.reviewCount >= 1000
                ? `${(location.reviewCount / 1000).toFixed(1)}k`
                : location.reviewCount})
            </span>
          </div>
        </div>

        {/* Short description */}
        {location.shortDesc && (
          <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
            {truncate(location.shortDesc, 90)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border)]/50">
          <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
            <Clock className="w-3 h-3 text-teal-500/70" />
            {location.duration}
          </span>
          <div className="flex gap-1">
            {location.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

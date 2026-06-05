"use client";

import { MapPin, Bookmark, BookmarkCheck, Clock, Tag } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { useAppStore } from "@/store";
import type { Location } from "@/types";

const CATEGORY_CONFIG: Record<
  Location["category"],
  { label: string; color: string; emoji: string }
> = {
  tarix:       { label: "Tarix",        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",   emoji: "🏛️" },
  tabiat:      { label: "Tabiat",       color: "bg-green-500/20 text-green-400 border-green-500/30",   emoji: "🌿" },
  madaniyat:   { label: "Madaniyat",    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",emoji: "🎭" },
  din:         { label: "Din",          color: "bg-teal-500/20 text-teal-400 border-teal-500/30",      emoji: "🕌" },
  arxeologiya: { label: "Arxeologiya", color: "bg-orange-500/20 text-orange-400 border-orange-500/30",emoji: "⛏️" },
};

interface LocationCardProps {
  location: Location;
  variant?: "default" | "horizontal" | "featured";
  className?: string;
}

export function LocationCard({ location, variant = "default", className }: LocationCardProps) {
  const { addToPlan, removeFromPlan, isInPlan } = useAppStore();
  const inPlan = isInPlan(location.id);
  const cat    = CATEGORY_CONFIG[location.category];

  function togglePlan(e: React.MouseEvent) {
    e.stopPropagation();
    inPlan ? removeFromPlan(location.id) : addToPlan(location);
  }

  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-2xl border border-border bg-card",
          "hover:border-teal-500/40 transition-all duration-300 group cursor-pointer",
          className
        )}
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img
            src={location.img}
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{location.name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" /><span>{location.city}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={location.rating} size="sm" showNumber />
            {location.priceUSD === 0
              ? <span className="text-[10px] text-green-400 font-medium">Bepul</span>
              : <span className="text-[10px] text-teal-400 font-medium">~${location.priceUSD}</span>
            }
          </div>
        </div>
        <button onClick={togglePlan} className="shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors">
          {inPlan
            ? <BookmarkCheck className="w-4 h-4 text-teal-400" />
            : <Bookmark className="w-4 h-4 text-muted-foreground" />
          }
        </button>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "relative h-64 rounded-2xl overflow-hidden cursor-pointer group shrink-0",
          className
        )}
      >
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full border", cat.color)}>
            {cat.emoji} {cat.label}
          </span>
        </div>

        {/* Bookmark */}
        <button
          onClick={togglePlan}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "backdrop-blur-md transition-all duration-200 active:scale-90",
            inPlan ? "bg-teal-500 text-white" : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          {inPlan ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-tight mb-1">{location.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <MapPin className="w-3 h-3" /><span>{location.city}</span>
            </div>
            <Stars rating={location.rating} size="sm" showNumber />
          </div>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden cursor-pointer",
        "hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5",
        "transition-all duration-300 group",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full border backdrop-blur-sm", cat.color)}>
            {cat.emoji} {cat.label}
          </span>
        </div>

        {/* Price */}
        {location.priceUSD === 0 ? (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500/80 backdrop-blur-sm text-[10px] font-bold text-white">
            Bepul
          </div>
        ) : (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-teal-300">
            ~${location.priceUSD}
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={togglePlan}
          className={cn(
            "absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
            "backdrop-blur-md transition-all duration-200 active:scale-90",
            inPlan ? "bg-teal-500 text-white" : "bg-black/50 text-white/80 hover:bg-teal-500/80"
          )}
        >
          {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-foreground leading-tight">{location.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{location.city}, {location.region}</span>
          </div>
          <Stars rating={location.rating} size="sm" showNumber count={location.reviewCount} showCount />
        </div>

        {location.shortDesc && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {truncate(location.shortDesc, 90)}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{location.duration}</span>
          </div>
          <div className="flex gap-1">
            {location.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

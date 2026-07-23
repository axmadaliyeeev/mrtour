import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bookmark, BookmarkCheck, Clock, Star, Navigation } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import { useAppStore } from "@/store";
import { syncAddToPlan, syncRemoveFromPlan } from "@/lib/plan-sync";
import { useSpotlight } from "@/hooks/useSpotlight";
import { useTranslation } from "@/i18n";
import type { Location } from "@/types";

const CAT_STYLE: Record<
  Location["category"],
  { color: string; bg: string; emoji: string; tKey: "cat_tarix" | "cat_tabiat" | "cat_madaniyat" | "cat_din" | "cat_arxeologiya" }
> = {
  tarix:       { color: "text-amber-500",   bg: "bg-amber-500/20 border-amber-500/30",    emoji: "🏛️", tKey: "cat_tarix" },
  tabiat:      { color: "text-emerald-500", bg: "bg-emerald-500/20 border-emerald-500/30", emoji: "🌿", tKey: "cat_tabiat" },
  madaniyat:   { color: "text-purple-500",  bg: "bg-purple-500/20 border-purple-500/30",  emoji: "🎭", tKey: "cat_madaniyat" },
  din:         { color: "text-indigo-500",  bg: "bg-indigo-500/20 border-indigo-500/30",  emoji: "🕌", tKey: "cat_din" },
  arxeologiya: { color: "text-orange-500",  bg: "bg-orange-500/20 border-orange-500/30",  emoji: "⛏️", tKey: "cat_arxeologiya" },
};

interface LocationCardProps {
  location: Location;
  variant?: "default" | "featured";
  className?: string;
}

export function LocationCard({ location, variant = "default", className }: LocationCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToPlan, removeFromPlan, isInPlan, showToast } = useAppStore();
  const inPlan = isInPlan(location.id);
  const cat = CAT_STYLE[location.category];
  const catLabel = t("home", cat.tKey);
  const freeLabel = t("detail", "free");

  const [imgLoaded, setImgLoaded] = useState(false);
  const spotlight = useSpotlight<HTMLDivElement>();

  const go = () => navigate(`/locations/${location.id}`);

  const bookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inPlan) {
      removeFromPlan(location.id);
      syncRemoveFromPlan(location.id);
      showToast(`${location.name} ${t("card", "removed_toast")}`, "🗑️", "info");
    } else {
      addToPlan(location);
      syncAddToPlan(location.id);
      showToast(`${location.name} ${t("card", "added_toast")}`, "📍", "success");
    }
  };

  /* ── Featured variant ──────────────────────────────────── */
  if (variant === "featured") {
    return (
      <motion.div
        ref={spotlight.ref}
        onMouseMove={spotlight.onMouseMove}
        onClick={go}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "spotlight-card tilt-hover relative h-64 rounded-2xl overflow-hidden cursor-pointer group shrink-0",
          "shadow-md hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1",
          className
        )}
      >
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        <img
          src={location.img}
          alt={location.name}
          className={cn(
            "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgLoaded(true);
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {/* Category badge */}
        <span className={cn(
          "absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md",
          cat.bg, cat.color
        )}>
          {cat.emoji} {catLabel}
        </span>

        {/* Price badge */}
        <span className={cn(
          "glint absolute top-3 right-12 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md",
          location.priceUSD === 0
            ? "bg-emerald-500/90 text-white"
            : "bg-black/55 text-gold-300 border border-gold-500/30"
        )}>
          {location.priceUSD === 0 ? freeLabel : `~$${location.priceUSD}`}
        </span>

        {/* Bookmark button */}
        <motion.button
          onClick={bookmark}
          whileTap={{ scale: 0.85 }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors",
            inPlan ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/50" : "bg-black/40 text-white hover:bg-indigo-500/80"
          )}
          aria-label={inPlan ? t("detail", "remove_plan") : t("card", "add_plan")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={inPlan ? "in" : "out"}
              initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex"
            >
              {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="route-underline font-bold text-white text-base leading-tight mb-1.5 drop-shadow-lg">
            {location.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-white/80 text-xs">
              <Navigation className="w-3 h-3" />
              {location.city}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{location.rating}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Default variant ───────────────────────────────────── */
  return (
    <motion.div
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      onClick={go}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "spotlight-card tilt-hover rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden cursor-pointer",
        "hover:border-indigo-500/50 hover:shadow-lg hover:ring-1 hover:ring-indigo-500/25",
        "transition-all duration-300 group",
        "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[var(--muted)]">
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        <img
          src={location.img}
          alt={location.name}
          className={cn(
            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgLoaded(true);
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
          {cat.emoji} {catLabel}
        </span>

        {/* Price badge */}
        <span className={cn(
          "absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-md",
          location.priceUSD === 0
            ? "bg-emerald-500/90 text-white"
            : "bg-black/60 text-indigo-300 border border-indigo-500/20"
        )}>
          {location.priceUSD === 0 ? freeLabel : `~$${location.priceUSD}`}
        </span>

        {/* Bookmark */}
        <motion.button
          onClick={bookmark}
          whileTap={{ scale: 0.85 }}
          className={cn(
            "absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-colors",
            inPlan
              ? "bg-indigo-500 text-white shadow-indigo-500/50"
              : "bg-black/50 text-white/80 hover:bg-indigo-500/90"
          )}
          aria-label={inPlan ? t("detail", "remove_plan") : t("card", "add_plan")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={inPlan ? "in" : "out"}
              initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex"
            >
              {inPlan ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        <h3 className="route-underline font-bold text-sm text-[var(--foreground)] leading-snug line-clamp-1">
          {location.name}
        </h3>

        {/* City + Rating */}
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] truncate">
            <MapPin className="w-3 h-3 shrink-0 text-indigo-500" />
            {location.city}
          </span>
          <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold text-[var(--foreground)] tabular-nums">{location.rating}</span>
            <span className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
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
        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border)]/60">
          <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
            <Clock className="w-3 h-3 text-indigo-500/70" />
            {location.duration}
          </span>
          <div className="flex gap-1">
            {location.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium border border-[var(--border)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Add to plan button */}
        <button
          onClick={bookmark}
          className={cn(
            "ripple w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.97] cursor-pointer",
            inPlan
              ? "bg-gradient-to-r from-indigo-500/15 to-indigo-500/8 border border-indigo-500/35 text-indigo-500 hover:bg-indigo-500/20"
              : "bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-indigo-500/40 hover:text-indigo-500 hover:bg-indigo-500/6"
          )}
        >
          {inPlan ? (
            <><BookmarkCheck className="w-3.5 h-3.5" /> {t("card", "in_plan")} ✓</>
          ) : (
            <><Bookmark className="w-3.5 h-3.5" /> {t("card", "add_plan")}</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

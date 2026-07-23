import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Map as MapIcon, Landmark, Leaf, Palette, Church, Pickaxe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data";
import { LocationCard } from "@/components/locations/LocationCard";
import { useTranslation } from "@/i18n";
import type { Location } from "@/types";

type CategoryFilter = Location["category"] | "all";

const CITIES = ["Barchasi", ...Array.from(new Set(LOCATIONS.map((l) => l.city))).sort()];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Locations() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [activeCity, setActiveCity] = useState("Barchasi");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Same monoline icon family as Home/LocationCard's category badges — one
  // consistent set app-wide instead of per-screen emoji.
  const CATEGORIES: { key: CategoryFilter; label: string; Icon: typeof MapIcon }[] = [
    { key: "all",         label: t("locations", "filter_all"),     Icon: MapIcon  },
    { key: "tarix",       label: t("home", "cat_tarix"),           Icon: Landmark },
    { key: "tabiat",      label: t("home", "cat_tabiat"),          Icon: Leaf     },
    { key: "madaniyat",   label: t("home", "cat_madaniyat"),       Icon: Palette  },
    { key: "din",         label: t("home", "cat_din"),             Icon: Church   },
    { key: "arxeologiya", label: t("home", "cat_arxeologiya"),     Icon: Pickaxe  },
  ];

  const SORT_OPTIONS = [
    { key: "rating",     label: t("locations", "sort_rating") },
    { key: "price-asc",  label: t("locations", "sort_price_asc") },
    { key: "price-desc", label: t("locations", "sort_price_desc") },
    { key: "reviews",    label: t("locations", "sort_reviews") },
  ];

  const results = useMemo(() => {
    let result = [...LOCATIONS];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          l.shortDesc.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }

    if (activeCity !== "Barchasi") {
      result = result.filter((l) => l.city === activeCity);
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        result.sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [debouncedSearch, activeCategory, activeCity, sortBy]);

  const hasActiveFilters = activeCategory !== "all" || activeCity !== "Barchasi" || sortBy !== "rating";

  function clearFilters() {
    setActiveCategory("all");
    setActiveCity("Barchasi");
    setSortBy("rating");
    setSearch("");
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">
            {t("locations", "title")}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {results.length} {t("locations", "found")}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          {results.length}
        </span>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder={t("locations", "search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl",
                "bg-[var(--muted)] border border-[var(--border)]",
                "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
                "outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              )}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl border transition-all",
              showFilters || hasActiveFilters
                ? "bg-indigo-500 border-indigo-500 text-white"
                : "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-indigo-500/40"
            )}
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category pills — the active background slides between pills via
          a shared layoutId instead of instantly swapping classes, so
          switching filters reads as one element moving, not a hard cut. */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 mb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 min-h-[44px] rounded-full border text-xs font-medium shrink-0 transition-colors",
                active
                  ? "border-indigo-500 text-white"
                  : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
              )}
            >
              {active && (
                <motion.span
                  layoutId="locations-category-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-0 rounded-full bg-indigo-500"
                />
              )}
              <cat.Icon className="relative w-3.5 h-3.5" strokeWidth={2} />
              <span className="relative">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded filters */}
      <AnimatePresence initial={false}>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="px-4 mb-4 overflow-hidden"
        >
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            {/* City */}
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] mb-2">
                {t("locations", "city_filter")}
              </p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={cn(
                      "px-3.5 min-h-[44px] rounded-full border text-xs font-medium transition-all",
                      activeCity === city
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
                    )}
                  >
                    {city === "Barchasi" ? t("locations", "filter_all") : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] mb-2">
                {t("locations", "sort_label")}
              </p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={cn(
                      "px-3.5 min-h-[44px] rounded-full border text-xs font-medium transition-all",
                      sortBy === opt.key
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-xs text-red-400 border border-red-400/20 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                {t("locations", "clear_filters")}
              </button>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Results */}
      {results.length === 0 ? (
        <div className="px-4 flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-5xl">🔍</div>
          <p className="text-[var(--foreground)] font-semibold text-base">
            {t("locations", "no_results")}
          </p>
          <p className="text-[var(--muted-foreground)] text-sm text-center">
            {t("locations", "no_results_hint")}
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            {t("locations", "clear")}
          </button>
        </div>
      ) : (
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
              >
                <LocationCard location={loc} variant="default" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

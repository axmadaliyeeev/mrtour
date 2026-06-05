"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterPill } from "@/components/ui/filter-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { LocationCard } from "@/components/locations/location-card";
import { LOCATIONS } from "@/data";
import type { Location } from "@/types";

const CATEGORIES: { id: Location["category"] | "all"; emoji: string; label: string }[] = [
  { id: "all",         emoji: "🌍", label: "Hammasi"     },
  { id: "tarix",       emoji: "🏛️", label: "Tarix"       },
  { id: "tabiat",      emoji: "🌿", label: "Tabiat"      },
  { id: "madaniyat",   emoji: "🎭", label: "Madaniyat"   },
  { id: "din",         emoji: "🕌", label: "Din"         },
  { id: "arxeologiya", emoji: "⛏️", label: "Arxeologiya" },
];

const CITIES = [...new Set(LOCATIONS.map((l) => l.city))];

type SortKey = "rating" | "reviewCount" | "priceUSD";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating",      label: "Reyting ↓" },
  { value: "reviewCount", label: "Sharhlar ↓" },
  { value: "priceUSD",    label: "Narx ↑" },
];

export default function LocationsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<Location["category"] | "all">("all");
  const [city,     setCity]     = useState<string | null>(null);
  const [sort,     setSort]     = useState<SortKey>("rating");
  const [showFilters, setShowFilters] = useState(false);

  const q = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = [...LOCATIONS];

    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(lq) ||
          l.city.toLowerCase().includes(lq) ||
          l.shortDesc.toLowerCase().includes(lq) ||
          l.tags.some((t) => t.toLowerCase().includes(lq))
      );
    }
    if (category !== "all") list = list.filter((l) => l.category === category);
    if (city) list = list.filter((l) => l.city === city);

    list.sort((a, b) =>
      sort === "priceUSD" ? a.priceUSD - b.priceUSD : b[sort] - a[sort]
    );
    return list;
  }, [q, category, city, sort]);

  return (
    <div className="min-h-screen px-4 pt-4 pb-6 space-y-4">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Sayohat Joylari</h1>
          <p className="text-xs text-muted-foreground">{LOCATIONS.length} ta joy mavjud</p>
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium",
            "transition-all duration-200",
            showFilters
              ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
              : "border-border bg-card text-muted-foreground hover:border-teal-500/30"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* ── Search ──────────────────────────────────── */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Joy, shahar yoki teg orqali qidiring..."
      />

      {/* ── Category pills ──────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.id}
            icon={cat.emoji}
            label={cat.label}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
            count={cat.id === "all" ? LOCATIONS.length : LOCATIONS.filter((l) => l.category === cat.id).length}
          />
        ))}
      </div>

      {/* ── Extra filters (expandable) ───────────────── */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-3 animate-fade-up">
          {/* Sort */}
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Saralash
            </p>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    sort === opt.value
                      ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                      : "border-border text-muted-foreground hover:border-teal-500/20"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Shahar
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCity(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                  city === null
                    ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                    : "border-border text-muted-foreground hover:border-teal-500/20"
                )}
              >
                Barchasi
              </button>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c === city ? null : c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    city === c
                      ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                      : "border-border text-muted-foreground hover:border-teal-500/20"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Results ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Joy topilmadi"
          description="Boshqa kalit so'z yoki filtr tanlang"
          actionLabel="Filterni tozalash"
          onAction={() => { setSearch(""); setCategory("all"); setCity(null); }}
        />
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground">
            {filtered.length} ta natija
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

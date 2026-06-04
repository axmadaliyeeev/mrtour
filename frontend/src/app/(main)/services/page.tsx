"use client";

import { useState, useMemo } from "react";
import { MapPin, Phone, Star, Bookmark } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterPill } from "@/components/ui/filter-pill";
import { Stars } from "@/components/ui/stars";
import { EmptyState } from "@/components/ui/empty-state";
import { GoogleMapsBtn } from "@/components/ui/index";
import { RESTAURANTS, HOTELS, GUIDES, CURRENCY_RATES } from "@/data";
import type { Restaurant, Hotel, Guide } from "@/types";

// ── Static transport data ────────────────────────────
const TRANSPORT = [
  { id: "t1", icon: "🚄", name: "Afrosiyob",      route: "Toshkent ↔ Samarqand ↔ Buxoro", time: "2.5 soat",   price: "190 000 so'm", type: "Poyezd" },
  { id: "t2", icon: "🚆", name: "Odatiy poyezd",  route: "Toshkent ↔ Xiva",               time: "13–15 soat", price: "80 000 so'm",  type: "Poyezd" },
  { id: "t3", icon: "✈️", name: "Uzbekistan Airways", route: "TAS ↔ SKD / BHK / UGC",     time: "50 daqiqa",  price: "750 000 so'm", type: "Uchuvchi" },
  { id: "t4", icon: "🚌", name: "Marshrutka",      route: "Shaharlararo",                  time: "3–10 soat",  price: "30–120k so'm", type: "Avtobus" },
  { id: "t5", icon: "🚕", name: "Yandex Taxi",     route: "Barcha shaharlar",              time: "Istalgan",   price: "Metrga ko'ra", type: "Taksi" },
  { id: "t6", icon: "🛺", name: "InDriver",        route: "Barcha shaharlar",              time: "Istalgan",   price: "Kelishiladi",  type: "Taksi" },
];

const EXCHANGE_OFFICES = [
  { name: "Asaka Bank",    usd: 12780, eur: 13850, gbp: 16100 },
  { name: "Kapitalbank",   usd: 12800, eur: 13900, gbp: 16200 },
  { name: "NBU",           usd: 12760, eur: 13820, gbp: 16050 },
];

const LANG_COLORS: Record<string, string> = {
  "O'zbek":   "bg-green-500/15 text-green-400 border-green-500/30",
  "Ingliz":   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Rus":      "bg-red-500/15 text-red-400 border-red-500/30",
  "Nemis":    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Fransuz":  "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Italyan":  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Turk":     "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Xitoy":    "bg-rose-500/15 text-rose-400 border-rose-500/30",
  "Yapon":    "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
};

const AMENITY_EMOJI: Record<string, string> = {
  "Wi-Fi": "📶", "Hovuz": "🏊", "Spa": "💆", "Restoran": "🍽️",
  "Konferents-zal": "🏢", "Parking": "🅿️", "Lift": "🛗",
  "24/7 qabulxona": "🕐", "Bog'": "🌳", "Tarixiy bino": "🏛️",
  "Ichki hovli": "🏡", "Ekskursiya": "🗺️", "Tog' manzarasi": "⛰️",
  "Bolalar maydonchasi": "🎠", "Kanatli yo'l yaqin": "🚡",
  "Ekskursiya tashkil etish": "📋",
};

// ── Sub-components ────────────────────────────────────
function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-teal-500/30 transition-colors group">
      <div className="relative h-44 bg-muted overflow-hidden">
        <img
          src={r.img}
          alt={r.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-semibold">
          {r.priceRange}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm text-foreground">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.cuisine}</p>
          </div>
          <Stars rating={r.rating} size="sm" showNumber />
        </div>
        <div className="space-y-1">
          {r.menu.slice(0, 3).map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate max-w-[60%]">{item.name}</span>
              <span className="text-teal-400 font-medium shrink-0">
                {formatPrice(item.price, "UZS")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground truncate">{r.address}</p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>⏰ {r.hours}</span>
          <button className="text-teal-400 hover:text-teal-300 transition-colors">
            🗺️ Xarita
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ h }: { h: Hotel }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-teal-500/30 transition-colors group">
      <div className="relative h-44 bg-muted overflow-hidden">
        <img
          src={h.img}
          alt={h.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        {!h.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-red-500/80">
              Band
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-0.5">
          {Array.from({ length: h.stars }, (_, i) => (
            <span key={i} className="text-amber-400 text-xs">★</span>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <p className="font-semibold text-sm text-foreground">{h.name}</p>
          <Stars rating={h.rating} size="sm" />
        </div>
        <p className="text-xs text-muted-foreground">{h.address}</p>
        <div className="flex flex-wrap gap-1">
          {h.amenities.slice(0, 5).map((a) => (
            <span key={a} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {AMENITY_EMOJI[a] ?? "•"} {a}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div>
            <p className="text-teal-400 font-bold text-sm">
              {formatPrice(h.pricePerNight, "UZS")}
            </p>
            <p className="text-[10px] text-muted-foreground">bir kecha</p>
          </div>
          <button
            disabled={!h.available}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              h.available
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {h.available ? "Bron qilish" : "Band"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideCard({ g }: { g: Guide }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-teal-500/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={g.img}
            alt={g.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-border"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              el.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 items-center justify-center text-white font-bold text-lg">
            {g.name.charAt(0)}
          </div>
          <span
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
              g.available ? "bg-emerald-400" : "bg-red-400"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="font-semibold text-sm text-foreground">
                {g.name}
                {g.verified && <span className="ml-1 text-teal-400 text-xs">✓</span>}
              </p>
              <p className="text-xs text-muted-foreground">{g.city}</p>
            </div>
            <Stars rating={g.rating} size="sm" />
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {g.langs.map((l) => (
              <span
                key={l}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full border font-medium",
                  LANG_COLORS[l] ?? "bg-muted text-muted-foreground border-border"
                )}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.bio}</p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <div>
          <p className="text-teal-400 font-bold text-sm">
            {formatPrice(g.pricePerDay, "UZS")}
          </p>
          <p className="text-[10px] text-muted-foreground">bir kun</p>
        </div>
        <div className="flex gap-1.5">
          <button className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors text-muted-foreground">
            <Phone className="w-3 h-3" />
          </button>
          <button
            disabled={!g.available}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              g.available
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {g.available ? "Band qilish" : "Band"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [currency, setCurrency] = useState("USD");

  const result = (parseFloat(amount) || 0) * (CURRENCY_RATES[currency] ?? 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">💱 Valyuta Konvertori</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-muted text-foreground text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all"
            min={0}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-muted text-foreground text-sm outline-none focus:border-teal-500 transition-all"
          >
            {Object.keys(CURRENCY_RATES).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="text-center py-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
          <p className="text-3xl font-extrabold text-teal-400">
            {result.toLocaleString("uz-UZ")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">O'zbek so'mi (UZS)</p>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          1 {currency} = {(CURRENCY_RATES[currency] ?? 0).toLocaleString()} UZS
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">🏦 Valyuta Obmennik Kurslari</h3>
        <div className="space-y-2">
          {EXCHANGE_OFFICES.map((office) => (
            <div key={office.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <p className="text-sm font-medium text-foreground">{office.name}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="text-green-400">$ {office.usd.toLocaleString()}</span>
                <span className="text-blue-400">€ {office.eur.toLocaleString()}</span>
                <span className="text-purple-400">£ {office.gbp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────
const TABS = [
  { id: "restaurants", label: "Restoranlar", icon: "🍽️" },
  { id: "hotels",      label: "Hotellar",    icon: "🏨" },
  { id: "guides",      label: "Gidlar",      icon: "👤" },
  { id: "transport",   label: "Transport",   icon: "🚌" },
  { id: "currency",    label: "Valyuta",     icon: "💱" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const REGIONS = [...new Set([
  ...RESTAURANTS.map((r) => r.city),
  ...HOTELS.map((h) => h.city),
  ...GUIDES.map((g) => g.city),
])];

export default function ServicesPage() {
  const [tab, setTab] = useState<TabId>("restaurants");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const filteredRestaurants = useMemo(() =>
    RESTAURANTS.filter((r) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
      const matchRegion = !region || r.city === region;
      return matchSearch && matchRegion;
    }), [debouncedSearch, region]);

  const filteredHotels = useMemo(() =>
    HOTELS.filter((h) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q);
      const matchRegion = !region || h.city === region;
      return matchSearch && matchRegion;
    }), [debouncedSearch, region]);

  const filteredGuides = useMemo(() =>
    GUIDES.filter((g) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q);
      const matchRegion = !region || g.city === region;
      return matchSearch && matchRegion;
    }), [debouncedSearch, region]);

  const showSearch = tab !== "currency" && tab !== "transport";

  return (
    <div className="min-h-screen px-4 py-4 space-y-4">
      {/* ── Header ──────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Xizmatlar</h1>
        <p className="text-xs text-muted-foreground">Restoranlar, hotellar, gidlar va ko'proq</p>
      </div>

      {/* ── Tabs ────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              tab === t.id
                ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                : "bg-muted border-border text-muted-foreground hover:border-teal-500/30"
            )}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search + Region filter ─────────────────── */}
      {showSearch && (
        <div className="space-y-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={`${TABS.find((t) => t.id === tab)?.label ?? ""} qidirish...`}
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <FilterPill
              label="Hammasi"
              active={region === null}
              onClick={() => setRegion(null)}
            />
            {REGIONS.map((r) => (
              <FilterPill
                key={r}
                label={r}
                active={region === r}
                onClick={() => setRegion(region === r ? null : r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────── */}
      {tab === "restaurants" && (
        filteredRestaurants.length === 0
          ? <EmptyState icon="🍽️" title="Restoran topilmadi" description="Boshqa kalit so'z bilan qidiring" onAction={() => setSearch("")} actionLabel="Tozalash" />
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRestaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
      )}

      {tab === "hotels" && (
        filteredHotels.length === 0
          ? <EmptyState icon="🏨" title="Mehmonxona topilmadi" description="Boshqa kalit so'z bilan qidiring" onAction={() => setSearch("")} actionLabel="Tozalash" />
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredHotels.map((h) => <HotelCard key={h.id} h={h} />)}
            </div>
      )}

      {tab === "guides" && (
        filteredGuides.length === 0
          ? <EmptyState icon="👤" title="Gid topilmadi" description="Boshqa filtr tanlang" onAction={() => setSearch("")} actionLabel="Tozalash" />
          : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredGuides.map((g) => <GuideCard key={g.id} g={g} />)}
            </div>
      )}

      {tab === "transport" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRANSPORT.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-4 hover:border-teal-500/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                      {t.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.route}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-muted-foreground">⏱ {t.time}</span>
                    <span className="text-teal-400 font-semibold">{t.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "currency" && <CurrencyConverter />}
    </div>
  );
}

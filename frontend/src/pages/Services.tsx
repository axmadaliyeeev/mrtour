import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, MapPin, Clock, Phone, CheckCircle, Star,
  Wifi, Car, Coffee, Dumbbell, Utensils, Hotel, Compass,
  Train, Bus, Zap, TrendingUp, Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RESTAURANTS, HOTELS, GUIDES, CURRENCY_RATES } from "@/data";
import { Stars } from "@/components/ui/stars";
import { useTranslation } from "@/i18n";

type Tab = "restoranlar" | "hotellar" | "gidlar" | "transport" | "valyuta";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi":      <Wifi className="w-3 h-3" />,
  "Avtoturargoh": <Car className="w-3 h-3" />,
  "Nonushta":   <Coffee className="w-3 h-3" />,
  "Fitnes":     <Dumbbell className="w-3 h-3" />,
};

// ── Restaurants ───────────────────────────────────────────
function RestaurantsTab({ search }: { search: string }) {
  const { t } = useTranslation();
  const q = search.toLowerCase();
  const filtered = RESTAURANTS.filter(
    (r) => !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🍽️</p>
        <p className="text-sm text-[var(--muted-foreground)]">{t("services", "not_found_restaurant")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map((r) => (
        <div key={r.id} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="relative h-44 overflow-hidden">
            <img
              src={r.img}
              alt={r.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=60"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/55 backdrop-blur-sm text-indigo-300 border border-indigo-500/30">
              {r.priceRange}
            </span>
            <div className="absolute bottom-2.5 left-3 right-3">
              <h3 className="font-bold text-sm text-white drop-shadow-md truncate">{r.name}</h3>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3 text-indigo-500" />{r.city}
              </span>
              <Stars rating={r.rating} size="sm" showNumber />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-500/60" />{r.hours}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[10px]">
                {r.cuisine}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Hotels ────────────────────────────────────────────────
function HotelsTab({ search }: { search: string }) {
  const { t } = useTranslation();
  const q = search.toLowerCase();
  const filtered = HOTELS.filter(
    (h) => !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🏨</p>
        <p className="text-sm text-[var(--muted-foreground)]">{t("services", "not_found_hotel")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map((h) => (
        <div key={h.id} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="relative h-44 overflow-hidden">
            <img
              src={h.img}
              alt={h.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=60"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {!h.available && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-sm">
                  {t("services", "busy")}
                </span>
              </div>
            )}
            <span className={cn(
              "absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm",
              h.available ? "bg-indigo-500/85 text-white" : "bg-red-500/80 text-white"
            )}>
              {h.available ? t("services", "available") : t("services", "busy")}
            </span>
            <div className="absolute bottom-2.5 left-3">
              <h3 className="font-bold text-sm text-white drop-shadow-md">{h.name}</h3>
              <div className="flex mt-0.5">
                {Array.from({ length: h.stars }, (_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3 text-indigo-500" />{h.city}
              </span>
              <Stars rating={h.rating} size="sm" showNumber />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-indigo-400">
                ${h.pricePerNight.toLocaleString()}
                <span className="text-[11px] font-normal text-[var(--muted-foreground)]"> {t("services", "per_night")}</span>
              </p>
              <div className="flex gap-1">
                {h.amenities.slice(0, 3).map((a) => (
                  <span key={a} title={a} className="w-6 h-6 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
                    {AMENITY_ICONS[a] ?? <span className="text-[9px] font-bold">{a[0]}</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Guides ────────────────────────────────────────────────
function GuidesTab({ search }: { search: string }) {
  const { t } = useTranslation();
  const q = search.toLowerCase();
  const filtered = GUIDES.filter(
    (g) => !q || g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.langs.some((l) => l.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🧭</p>
        <p className="text-sm text-[var(--muted-foreground)]">{t("services", "not_found_guide")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((g) => (
        <div key={g.id} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-indigo-500/40 hover:shadow-md transition-all duration-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={g.img}
                  alt={g.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--border)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name)}&background=50c878&color=fff&size=64`;
                  }}
                />
                {g.available && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-indigo-400 rounded-full border-2 border-[var(--card)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-sm text-[var(--foreground)] truncate">{g.name}</h3>
                  {g.verified && <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                    <MapPin className="w-3 h-3 text-indigo-500" />{g.city}
                  </span>
                  <Stars rating={g.rating} size="sm" showNumber />
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {g.langs.map((l) => (
                    <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-medium">
                      {l}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">{g.bio}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]/50 bg-[var(--muted)]/30">
            <div>
              <span className="text-base font-bold text-indigo-400">${g.pricePerDay.toLocaleString()}</span>
              <span className="text-[11px] text-[var(--muted-foreground)]">{t("services", "per_day")}</span>
            </div>
            <span className={cn(
              "text-[10px] px-2.5 py-1 rounded-full font-semibold",
              g.available
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                : "bg-red-500/15 text-red-400 border border-red-500/30"
            )}>
              ● {g.available ? t("services", "available") : t("services", "busy")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Transport ─────────────────────────────────────────────
function TransportTab() {
  const { t } = useTranslation();

  function formatDuration(hours: number, mins: number): string {
    const h = t("services", "hours_unit");
    const m = t("services", "min_unit");
    if (hours > 0 && mins > 0) return `${hours} ${h} ${mins} ${m}`;
    if (hours > 0) return `${hours} ${h}`;
    return `${mins} ${m}`;
  }

  function formatPrice(uzs: number): string {
    return `${new Intl.NumberFormat("uz-UZ").format(uzs)} ${t("services", "uzs_unit")}`;
  }

  const TRANSPORT_OPTIONS = [
    {
      type: t("services", "train_type"),
      emoji: "🚄",
      icon: <Train className="w-4 h-4" />,
      desc: t("services", "train_desc"),
      routes: [
        { from: "Toshkent", to: "Samarqand", hours: 2,   mins: 0,  priceUZS: 80000 },
        { from: "Toshkent", to: "Buxoro",    hours: 3,   mins: 30, priceUZS: 120000 },
        { from: "Samarqand", to: "Buxoro",   hours: 1,   mins: 30, priceUZS: 60000 },
      ],
    },
    {
      type: t("services", "bus_type"),
      emoji: "🚌",
      icon: <Bus className="w-4 h-4" />,
      desc: t("services", "bus_desc"),
      routes: [
        { from: "Toshkent", to: "Namangan", hours: 4, mins: 0,  priceUZS: 40000 },
        { from: "Toshkent", to: "Andijon",  hours: 5, mins: 0,  priceUZS: 50000 },
        { from: "Toshkent", to: "Termiz",   hours: 8, mins: 0,  priceUZS: 70000 },
      ],
    },
    {
      type: t("services", "taxi_type"),
      emoji: "🚕",
      icon: <Zap className="w-4 h-4" />,
      desc: t("services", "taxi_desc"),
      routes: [
        { from: "Toshkent",  to: "Chimgan",    hours: 1, mins: 30, priceUZS: 150000 },
        { from: "Urgench",   to: "Xiva",       hours: 0, mins: 30, priceUZS: 30000 },
        { from: "Buxoro",    to: "Shahrisabz", hours: 1, mins: 30, priceUZS: 100000 },
      ],
    },
  ];

  const EMERGENCY = [
    { name: t("services", "emergency_ambulance"), number: "103", emoji: "🚑" },
    { name: t("services", "emergency_fire"),      number: "101", emoji: "🚒" },
    { name: t("services", "emergency_police"),    number: "102", emoji: "👮" },
    { name: t("services", "emergency_gas"),       number: "104", emoji: "⚠️" },
    { name: t("services", "emergency_tourism"),   number: "1219", emoji: "ℹ️" },
  ];

  return (
    <div className="space-y-5">
      {TRANSPORT_OPTIONS.map((opt) => (
        <div key={opt.type}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-xl">
              {opt.emoji}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">{opt.type}</h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">{opt.desc}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]/50">
            {opt.routes.map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="flex items-center justify-between px-4 py-3 bg-[var(--card)] hover:bg-[var(--muted)]/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    {route.from} → {route.to}
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatDuration(route.hours, route.mins)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-400">~{formatPrice(route.priceUZS)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Emergency numbers */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-red-500/15">
          <Phone className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-[var(--foreground)]">{t("services", "emergency")}</h3>
        </div>
        <div className="divide-y divide-[var(--border)]/30">
          {EMERGENCY.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between px-4 py-3 bg-[var(--card)] hover:bg-[var(--muted)]/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span>{item.emoji}</span>
                {item.name}
              </span>
              <span className="text-sm font-bold text-red-400">{item.number}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Currency ──────────────────────────────────────────────
function CurrencyTab() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");

  const currencies = Object.entries(CURRENCY_RATES).map(([code, rate]) => ({ code, rate }));
  const numericAmount = parseFloat(amount) || 0;
  const baseRate = CURRENCY_RATES[fromCurrency] ?? 1;
  const uzsAmount = numericAmount * baseRate;

  // No flag emojis — Windows without color-emoji font support renders
  // regional-indicator flags as literal two-letter text pills, not a flag.

  return (
    <div className="space-y-4">
      {/* Converter */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">{t("services", "currency_calc_title")}</h3>
            <p className="text-[11px] text-[var(--muted-foreground)]">{t("services", "currency_calc_desc")}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            className={cn(
              "flex-1 px-3 py-2.5 rounded-xl",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm font-semibold",
              "outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            )}
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className={cn(
              "px-3 py-2.5 rounded-xl min-w-[5rem]",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm font-semibold",
              "outline-none focus:border-indigo-500 transition-all"
            )}
          >
            {currencies.map(({ code }) => (
              <option key={code} value={code}>{code}</option>
            ))}
            <option value="UZS">UZS</option>
          </select>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          {fromCurrency !== "UZS" ? (
            <>
              <p className="text-[11px] text-[var(--muted-foreground)] mb-1">
                {numericAmount} {fromCurrency} =
              </p>
              <p className="text-xl font-bold text-indigo-400">
                {new Intl.NumberFormat("uz-UZ").format(Math.round(uzsAmount))}{" "}
                <span className="text-base font-semibold text-indigo-400/70">{t("services", "uzs_unit")}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-[var(--muted-foreground)] mb-1">
                {numericAmount.toLocaleString()} UZS =
              </p>
              <p className="text-xl font-bold text-indigo-400">
                ${(numericAmount / CURRENCY_RATES.USD).toFixed(2)}{" "}
                <span className="text-base font-semibold text-indigo-400/70">USD</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Rates grid */}
      <div>
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-2.5 flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-indigo-400" />
          {t("services", "currency_table_title")}
          <span className="text-[10px] font-normal text-[var(--muted-foreground)]">{t("services", "currency_table_unit")}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currencies.map(({ code, rate }) => (
            <button
              key={code}
              type="button"
              onClick={() => setFromCurrency(code)}
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left min-h-[56px]",
                fromCurrency === code
                  ? "bg-indigo-500/10 border-indigo-500/40"
                  : "bg-[var(--card)] border-[var(--border)] hover:border-indigo-500/20"
              )}
            >
              <span className={cn(
                "w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-extrabold tracking-tight",
                fromCurrency === code
                  ? "bg-indigo-500 text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]"
              )}>
                {code}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--foreground)]">{code}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
                  {new Intl.NumberFormat("uz-UZ").format(rate)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function Services() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("restoranlar");
  const [search, setSearch] = useState("");

  const TABS: { key: Tab; label: string; emoji: string; icon: React.ReactNode }[] = [
    { key: "restoranlar", label: t("services", "tab_restaurants"), emoji: "🍽️", icon: <Utensils className="w-3.5 h-3.5" /> },
    { key: "hotellar",    label: t("services", "tab_hotels"),      emoji: "🏨", icon: <Hotel className="w-3.5 h-3.5" /> },
    { key: "gidlar",      label: t("services", "tab_guides"),      emoji: "🧭", icon: <Compass className="w-3.5 h-3.5" /> },
    { key: "transport",   label: t("services", "tab_transport"),   emoji: "🚌", icon: <Train className="w-3.5 h-3.5" /> },
    { key: "valyuta",     label: t("services", "tab_currency"),    emoji: "💱", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  const TAB_META: Record<Tab, { title: string; desc: string; emoji: string }> = {
    restoranlar: { title: t("services", "restaurants_title"), desc: t("services", "restaurants_desc"), emoji: "🍽️" },
    hotellar:    { title: t("services", "hotels_title"),      desc: t("services", "hotels_desc"),      emoji: "🏨" },
    gidlar:      { title: t("services", "guides_title"),      desc: t("services", "guides_desc"),      emoji: "🧭" },
    transport:   { title: t("services", "transport_title"),   desc: t("services", "transport_desc"),   emoji: "🚌" },
    valyuta:     { title: t("services", "currency_title"),    desc: t("services", "currency_desc"),    emoji: "💱" },
  };

  const showSearch = ["restoranlar", "hotellar", "gidlar"].includes(activeTab);
  const meta = TAB_META[activeTab];

  return (
    <div className="pb-6">
      {/* Page header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">{t("services", "title")}</h1>
        <p className="text-xs text-[var(--muted-foreground)]">{t("services", "subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSearch(""); }}
            className={cn(
              "flex items-center gap-1.5 px-3.5 rounded-xl border text-xs font-semibold shrink-0 transition-all min-h-[44px]",
              activeTab === tab.key
                ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="px-4 mb-3 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg shrink-0">
          {meta.emoji}
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--foreground)]">{meta.title}</h2>
          <p className="text-[11px] text-[var(--muted-foreground)]">{meta.desc}</p>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder={`${meta.title} ${t("services", "search_placeholder")}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl",
                "bg-[var(--muted)] border border-[var(--border)]",
                "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
                "outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              )}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "restoranlar" && <RestaurantsTab search={search} />}
            {activeTab === "hotellar"    && <HotelsTab    search={search} />}
            {activeTab === "gidlar"      && <GuidesTab    search={search} />}
            {activeTab === "transport"   && <TransportTab />}
            {activeTab === "valyuta"     && <CurrencyTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

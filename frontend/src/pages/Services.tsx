import { useState } from "react";
import { Search, MapPin, Star, Clock, Phone, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RESTAURANTS,
  HOTELS,
  GUIDES,
  CURRENCY_RATES,
} from "@/data";
import { Stars } from "@/components/ui/stars";

type Tab = "restoranlar" | "hotellar" | "gidlar" | "transport" | "valyuta";

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "restoranlar", label: "Restoranlar", emoji: "🍽️" },
  { key: "hotellar", label: "Hotellar", emoji: "🏨" },
  { key: "gidlar", label: "Gidlar", emoji: "🧭" },
  { key: "transport", label: "Transport", emoji: "🚌" },
  { key: "valyuta", label: "Valyuta", emoji: "💱" },
];

const TRANSPORT_OPTIONS = [
  {
    type: "Poyezd",
    emoji: "🚂",
    routes: [
      { from: "Toshkent", to: "Samarqand", duration: "2 soat", price: "80 000 so'm" },
      { from: "Toshkent", to: "Buxoro", duration: "3.5 soat", price: "120 000 so'm" },
      { from: "Samarqand", to: "Buxoro", duration: "1.5 soat", price: "60 000 so'm" },
    ],
  },
  {
    type: "Avtobus",
    emoji: "🚌",
    routes: [
      { from: "Toshkent", to: "Namangan", duration: "4 soat", price: "40 000 so'm" },
      { from: "Toshkent", to: "Andijon", duration: "5 soat", price: "50 000 so'm" },
      { from: "Toshkent", to: "Termiz", duration: "8 soat", price: "70 000 so'm" },
    ],
  },
  {
    type: "Taksi",
    emoji: "🚕",
    routes: [
      { from: "Toshkent", to: "Chimgan", duration: "1.5 soat", price: "~150 000 so'm" },
      { from: "Urgench", to: "Xiva", duration: "30 daqiqa", price: "~30 000 so'm" },
      { from: "Buxoro", to: "Shahrisabz", duration: "1.5 soat", price: "~100 000 so'm" },
    ],
  },
];

function RestaurantsTab({ search }: { search: string }) {
  const q = search.toLowerCase();
  const filtered = RESTAURANTS.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-3">
      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted-foreground)] text-sm py-8">
          Restoran topilmadi
        </p>
      )}
      {filtered.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden"
        >
          <img
            src={r.img}
            alt={r.name}
            className="w-full h-36 object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=60";
            }}
          />
          <div className="p-3 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm text-[var(--foreground)]">{r.name}</h3>
              <span className="text-xs font-semibold text-teal-400 shrink-0">
                {r.priceRange}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3" />{r.city}
              </span>
              <Stars rating={r.rating} size="sm" showNumber />
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <Clock className="w-3 h-3" />{r.hours}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Taom: {r.cuisine}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HotelsTab({ search }: { search: string }) {
  const q = search.toLowerCase();
  const filtered = HOTELS.filter(
    (h) =>
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-3">
      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted-foreground)] text-sm py-8">
          Hotel topilmadi
        </p>
      )}
      {filtered.map((h) => (
        <div
          key={h.id}
          className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden"
        >
          <div className="relative">
            <img
              src={h.img}
              alt={h.name}
              className="w-full h-36 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=60";
              }}
            />
            {!h.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-red-500/80">
                  Band
                </span>
              </div>
            )}
            <span
              className={cn(
                "absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm",
                h.available ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {h.available ? "Bo'sh" : "Band"}
            </span>
          </div>
          <div className="p-3 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm text-[var(--foreground)]">{h.name}</h3>
              <div className="flex">
                {Array.from({ length: h.stars }, (_, i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3" />{h.city}
              </span>
              <Stars rating={h.rating} size="sm" showNumber />
            </div>
            <p className="text-sm font-bold text-teal-400">
              ${h.pricePerNight}{" "}
              <span className="text-xs font-normal text-[var(--muted-foreground)]">
                / kecha
              </span>
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {h.amenities.slice(0, 4).map((a) => (
                <span
                  key={a}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GuidesTab({ search }: { search: string }) {
  const q = search.toLowerCase();
  const filtered = GUIDES.filter(
    (g) =>
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q) ||
      g.langs.some((l) => l.toLowerCase().includes(q))
  );

  return (
    <div className="space-y-3">
      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted-foreground)] text-sm py-8">
          Gid topilmadi
        </p>
      )}
      {filtered.map((g) => (
        <div
          key={g.id}
          className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
        >
          <div className="flex items-start gap-3">
            <img
              src={g.img}
              alt={g.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[var(--border)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(g.name)}&background=14b8a6&color=fff&size=56`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-sm text-[var(--foreground)]">{g.name}</h3>
                {g.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                  <MapPin className="w-3 h-3" />{g.city}
                </span>
                <Stars rating={g.rating} size="sm" showNumber />
              </div>
              <div className="flex flex-wrap gap-1 mb-1">
                {g.langs.map((l) => (
                  <span
                    key={l}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{g.bio}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]/50">
            <span className="text-sm font-bold text-teal-400">
              ${g.pricePerDay}
              <span className="text-xs font-normal text-[var(--muted-foreground)]">/kun</span>
            </span>
            <span
              className={cn(
                "text-[10px] px-2.5 py-1 rounded-full font-semibold",
                g.available
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              )}
            >
              {g.available ? "Bo'sh" : "Band"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransportTab() {
  return (
    <div className="space-y-4">
      {TRANSPORT_OPTIONS.map((opt) => (
        <div key={opt.type}>
          <h3 className="text-sm font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
            <span className="text-lg">{opt.emoji}</span>
            {opt.type}
          </h3>
          <div className="space-y-2">
            {opt.routes.map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    {route.from} → {route.to}
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {route.duration}
                  </p>
                </div>
                <span className="text-sm font-bold text-teal-400">
                  {route.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Emergency numbers */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-400" /> Muhim raqamlar
        </h3>
        <div className="space-y-2">
          {[
            { name: "Tez yordam", number: "103" },
            { name: "Yong'in xizmati", number: "101" },
            { name: "Politsiya", number: "102" },
            { name: "Gaz xizmati", number: "104" },
            { name: "Turizm axborot markazi", number: "1219" },
          ].map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
            >
              <span className="text-sm text-[var(--foreground)]">{item.name}</span>
              <span className="text-sm font-bold text-teal-400">{item.number}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrencyTab() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");

  const currencies = Object.entries(CURRENCY_RATES).map(([code, rate]) => ({
    code,
    rate,
  }));

  const numericAmount = parseFloat(amount) || 0;
  const baseRate = CURRENCY_RATES[fromCurrency] ?? 1;

  function convertToUZS(amount: number, fromRate: number): number {
    return amount * fromRate;
  }

  function convertFromUZS(uzsAmount: number, toRate: number): number {
    return uzsAmount / toRate;
  }

  const uzsAmount = convertToUZS(numericAmount, baseRate);

  return (
    <div className="space-y-4">
      {/* Converter */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <h3 className="text-sm font-bold text-[var(--foreground)]">
          Valyuta kalkulyatori
        </h3>

        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            className={cn(
              "flex-1 px-3 py-2.5 rounded-xl",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm",
              "outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
            )}
            placeholder="Miqdor"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className={cn(
              "px-3 py-2.5 rounded-xl",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm",
              "outline-none focus:border-teal-500 transition-all"
            )}
          >
            {currencies.map(({ code }) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
            <option value="UZS">UZS</option>
          </select>
        </div>

        {fromCurrency !== "UZS" ? (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Natija (UZS):</p>
            <p className="text-lg font-bold text-teal-400">
              {new Intl.NumberFormat("uz-UZ").format(Math.round(uzsAmount))}{" "}
              so&apos;m
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">
              {numericAmount.toLocaleString()} UZS teng:
            </p>
            <p className="text-base font-bold text-teal-400">
              ${(numericAmount / CURRENCY_RATES.USD).toFixed(2)} USD
            </p>
          </div>
        )}
      </div>

      {/* Rates table */}
      <div>
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
          Kurslar (1 valyuta = X so&apos;m)
        </h3>
        <div className="space-y-2">
          {currencies.map(({ code, rate }) => (
            <div
              key={code}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-sm font-bold text-[var(--foreground)]">
                  {code.slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {code}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    1 {code}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--foreground)]">
                  {new Intl.NumberFormat("uz-UZ").format(rate)}
                </p>
                <p className="text-[10px] text-[var(--muted-foreground)]">so&apos;m</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<Tab>("restoranlar");
  const [search, setSearch] = useState("");

  const showSearch = ["restoranlar", "hotellar", "gidlar"].includes(activeTab);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">
          Xizmatlar
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Restoran, hotel, gid va boshqa xizmatlar
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSearch("");
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium shrink-0 transition-all",
              activeTab === tab.key
                ? "bg-teal-500 border-teal-500 text-white"
                : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-teal-500/30"
            )}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl",
                "bg-[var(--muted)] border border-[var(--border)]",
                "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
                "outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
              )}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
        {activeTab === "restoranlar" && <RestaurantsTab search={search} />}
        {activeTab === "hotellar" && <HotelsTab search={search} />}
        {activeTab === "gidlar" && <GuidesTab search={search} />}
        {activeTab === "transport" && <TransportTab />}
        {activeTab === "valyuta" && <CurrencyTab />}
      </div>
    </div>
  );
}

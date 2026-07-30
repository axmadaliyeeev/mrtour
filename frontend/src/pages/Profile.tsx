import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Map,
  Globe,
  Moon,
  Sun,
  Star,
  Save,
  Bot,
  BookmarkX,
  ChevronRight,
  User as UserIcon,
  Shield,
  Sparkles,
  Phone,
  Lock,
  ClipboardList,
  Settings,
  Building2,
  DollarSign,
  Ambulance,
  Flame,
  AlertTriangle,
  Info,
  Bookmark,
  MessageSquare,
  Compass,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { syncRemoveFromPlan } from "@/lib/plan-sync";
import { Stars } from "@/components/ui/stars";
import { useTranslation } from "@/i18n";
import type { Lang } from "@/i18n";
import type { Location } from "@/types";
import { LOCATIONS } from "@/data";

/* Trip totals computed from the saved plan */
function PlanSummary({ plan, freeLabel }: { plan: Location[]; freeLabel: string }) {
  const cities = new Set(plan.map((l) => l.city)).size;
  const total = plan.reduce((sum, l) => sum + (l.priceUSD ?? 0), 0);
  const items = [
    { Icon: MapPin, value: plan.length },
    { Icon: Building2, value: cities },
    { Icon: DollarSign, value: total === 0 ? freeLabel : `~$${total}` },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/20"
        >
          <it.Icon className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
          <span className="text-sm font-extrabold text-[var(--foreground)] tabular-nums">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Flag emojis are dropped on purpose — Windows without color-emoji font
// support renders them as literal two-letter text pills ("UZ", "RU"...)
// instead of a flag, which reads as a broken/unfinished UI.
const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

const EMERGENCY_NUMBERS_RAW = [
  { Icon: Ambulance,     key: "emergency_ambulance" as const, number: "103" },
  { Icon: Flame,         key: "emergency_fire"      as const, number: "101" },
  { Icon: Shield,        key: "emergency_police"    as const, number: "102" },
  { Icon: AlertTriangle, key: "emergency_gas"       as const, number: "104" },
  { Icon: Info,          key: "emergency_tourism"   as const, number: "1219" },
];

type ProfileTab = "itineraries" | "saved" | "reviews" | "settings";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProfileTab>("saved");
  const {
    user,
    isLoggedIn,
    logout,
    plan,
    lang,
    setLang,
    removeFromPlan,
    theme,
    toggleTheme,
    openAuthModal,
    userReviews,
    showToast,
  } = useAppStore();

  // Flatten { locationId: Review[] } into a single list with the location
  // name attached, so "My Reviews" reads like a real activity feed
  // instead of raw store internals.
  const myReviews = Object.entries(userReviews).flatMap(([locationId, reviews]) =>
    reviews.map((r) => ({ ...r, locationName: LOCATIONS.find((l) => l.id === locationId)?.name ?? locationId }))
  );

  function handleLogout() {
    // Best-effort: also terminate the session server-side (clears the
    // httpOnly refresh cookie + DB refreshToken) so a stray 401 elsewhere
    // can't silently mint a fresh access token after "logging out".
    apiClient.delete("/auth/logout").catch(() => {});
    localStorage.removeItem("trova-token");
    logout();
  }

  async function handleLanguageChange(newLang: Lang) {
    setLang(newLang);
    if (user) {
      try {
        await apiClient.patch("/users/me", { lang: newLang });
      } catch {
        // silent — local lang already updated
      }
    }
  }

  // Monoline lucide set instead of multicolor emoji (map/robot/star icons
  // rendered in whatever colors the OS emoji font picked) — single emerald
  // color family, matching the icon system everywhere else in the app.
  const GUEST_BENEFITS = [
    { Icon: Map, title: t("profile", "benefit1_title"), desc: t("profile", "benefit1_desc") },
    { Icon: Bot, title: t("profile", "benefit2_title"), desc: t("profile", "benefit2_desc") },
    { Icon: Star, title: t("profile", "benefit3_title"), desc: t("profile", "benefit3_desc") },
    { Icon: Save, title: t("profile", "benefit4_title"), desc: t("profile", "benefit4_desc") },
  ];

  /* ── Guest view ───────────────────────────────────────────── */
  if (!isLoggedIn || !user) {
    return (
      <div className="pb-8 px-4 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="pt-4 pb-6">
          <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">
            {t("profile", "title")}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("profile", "subtitle")}
          </p>
        </div>

        {/* Guest card */}
        <div className="relative overflow-hidden flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] mb-6 text-center shadow-[var(--shadow-card)]">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none animate-breathe" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500/8 rounded-full blur-2xl pointer-events-none" />
          {/* A gradient ring (emerald → mint) around a dark center reads
              as a deliberate placeholder treatment rather than a flat
              filled circle; the thinner stroke keeps it feeling refined
              instead of a generic bold person glyph. */}
          <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-indigo-500 to-[#7fe0ae] shadow-md animate-pop-in">
            <div className="w-full h-full rounded-full bg-[var(--card)] flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] mb-1">
              {t("profile", "guest_title")}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("profile", "guest_desc")}
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={openAuthModal}
              className="btn-shine ripple flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              {t("profile", "login_btn")}
            </button>
            <button
              onClick={openAuthModal}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm font-semibold hover:border-indigo-500/40 transition-colors"
            >
              {t("profile", "register_btn")}
            </button>
          </div>
        </div>

        {/* Plan list for guests (if they added items) */}
        {plan.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-indigo-400" /> {t("profile", "plan_title")}
                <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[11px] font-bold">
                  {plan.length}
                </span>
              </h3>
              <button
                onClick={() => navigate("/locations")}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {t("profile", "plan_add")} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <PlanSummary plan={plan} freeLabel={t("detail", "free")} />
            <div className="space-y-2">
              {plan.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] group"
                >
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=100&q=60";
                    }}
                  />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/locations/${loc.id}`)}
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">{loc.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{loc.city}
                    </p>
                    <Stars rating={loc.rating} size="sm" showNumber />
                  </div>
                  <button
                    onClick={() => { removeFromPlan(loc.id); syncRemoveFromPlan(loc.id); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label={t("detail", "remove_plan")}
                  >
                    <BookmarkX className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Save prompt */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gold-500/8 border border-gold-500/25">
                <Lock className="w-4 h-4 text-gold-500 shrink-0" />
                <p className="text-xs text-[var(--muted-foreground)]">
                  {t("profile", "guest_plan_save_hint")}
                  {" "}
                  <button
                    onClick={openAuthModal}
                    className="text-indigo-400 font-semibold hover:underline"
                  >
                    {t("profile", "login_btn")}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Language selector for guest */}
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--foreground)] mb-3 px-1">
            <Globe className="w-4 h-4 text-indigo-400" /> {t("profile", "lang_title")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all",
                  lang === l.code
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                    : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          <p className="text-sm font-bold text-[var(--foreground)] mb-3">
            {t("profile", "benefits_title")}
          </p>
          {GUEST_BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className="animate-fade-up flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] hover:border-indigo-500/35 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/10 transition-all"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <b.Icon className="w-5 h-5 text-indigo-400" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{b.title}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Theme toggle for guest */}
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Sun className="w-4 h-4 text-indigo-400" />
              )}
              <span className="text-sm font-medium text-[var(--foreground)]">
                {theme === "dark" ? t("profile", "theme_dark") : t("profile", "theme_light")}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                theme === "dark" ? "bg-indigo-500" : "bg-[var(--muted)] border border-[var(--border)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all",
                  theme === "dark" ? "left-6" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-[var(--muted-foreground)]/60 mt-6">
          mrforce.uz tomonidan ishlab chiqildi
        </p>
      </div>
    );
  }

  /* ── Authenticated view ───────────────────────────────────── */
  return (
    <div className="pb-8 w-full max-w-2xl mx-auto">
      {/* Avatar + name header */}
      <div className="relative overflow-hidden px-4 pt-5 pb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/12 via-transparent to-purple-500/8 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none animate-breathe" />
        <div className="relative flex items-center gap-4">
          <div className="relative animate-pop-in">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-md ring-2 ring-indigo-500/25 ring-offset-2 ring-offset-[var(--background)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {user.isPremium && (
              <div className="glint absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold-500 border-2 border-[var(--background)] flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-[var(--foreground)] truncate">
              {user.name} {user.surname}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {user.country && (
                <span className="text-[11px] flex items-center gap-1 text-[var(--muted-foreground)]">
                  <Globe className="w-3 h-3" />{user.country}
                </span>
              )}
              {user.isPremium && (
                <span className="border-glow-spin text-[10px] px-2 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 font-semibold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-gold-500" /> <span className="text-shimmer-gold">Premium</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row — trips planned (cities in the saved plan), places
          saved, and reviews written. Scaled-down version of Home's stat
          tiles for this context. */}
      <div className="px-4 mb-5 grid grid-cols-3 gap-2.5">
        {[
          { Icon: Globe, value: new Set(plan.map((l) => l.city)).size, label: t("profile", "stat_trips") },
          { Icon: Bookmark, value: plan.length, label: t("profile", "stat_saved") },
          { Icon: MessageSquare, value: myReviews.length, label: t("profile", "stat_reviews") },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] shadow-[var(--shadow-card)]"
          >
            <s.Icon className="w-4 h-4 text-indigo-500" strokeWidth={2} />
            <span className="text-lg font-extrabold text-[var(--foreground)] tabular-nums">{s.value}</span>
            <span className="text-[10px] text-[var(--muted-foreground)] text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tab bar — same solid-fill active pill language as the sidebar/
          category filters, so this reads as one consistent design system
          rather than a one-off segmented control. */}
      <div className="px-4 mb-5">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {(
            [
              { key: "saved" as const,       Icon: Bookmark,      label: t("profile", "tab_saved") },
              { key: "itineraries" as const, Icon: Compass,       label: t("profile", "tab_itineraries") },
              { key: "reviews" as const,      Icon: MessageSquare, label: t("profile", "tab_reviews") },
              { key: "settings" as const,     Icon: Settings,      label: t("profile", "tab_settings") },
            ]
          ).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-[0.97]",
                tab === key
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Places tab — same plan data source as the dedicated /saved
          page (both read straight from the store's `plan`, so there's one
          source of truth rather than two copies of the same list). */}
      {tab === "saved" && (
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-indigo-400" /> {t("profile", "plan_title")}
            <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[11px] font-bold">
              {plan.length}
            </span>
          </h3>
          {plan.length > 0 && (
            <button
              onClick={() => navigate("/locations")}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {t("profile", "plan_add")} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {plan.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] text-center">
            <Map className="w-9 h-9 text-indigo-400/60" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {t("profile", "plan_empty_title")}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("profile", "plan_empty_desc")}
            </p>
            <button
              onClick={() => navigate("/locations")}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
            >
              {t("profile", "plan_empty_btn")}
            </button>
          </div>
        ) : (
          <>
          <PlanSummary plan={plan} freeLabel={t("detail", "free")} />
          <div className="space-y-2">
            {plan.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] group"
              >
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=100&q=60";
                  }}
                />
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/locations/${loc.id}`)}
                >
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                    {loc.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{loc.city}
                  </p>
                  <Stars rating={loc.rating} size="sm" showNumber />
                </div>
                <button
                  onClick={() => { removeFromPlan(loc.id); syncRemoveFromPlan(loc.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  aria-label={t("detail", "remove_plan")}
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* AI tour creation button */}
            <button
              onClick={() => navigate("/chat")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              {t("profile", "plan_ai_btn")}
            </button>
          </div>
          </>
        )}
      </section>
      )}

      {/* My Itineraries tab — there's no backend persistence for
          AI-generated tour plans yet (Trova AI's plans live only in the
          chat transcript, nothing is saved as a structured itinerary), so
          this is an honest empty state pointing at the one real path to
          creating one, not a stub pretending data exists. */}
      {tab === "itineraries" && (
      <section className="px-4 mb-5">
        <div className="flex flex-col items-center gap-3 py-10 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] text-center">
          <Compass className="w-9 h-9 text-indigo-400/60" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {t("profile", "itineraries_empty_title")}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] max-w-[260px]">
            {t("profile", "itineraries_empty_desc")}
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            {t("profile", "plan_ai_btn")}
          </button>
        </div>
      </section>
      )}

      {/* My Reviews tab */}
      {tab === "reviews" && (
      <section className="px-4 mb-5">
        {myReviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] text-center">
            <MessageSquare className="w-7 h-7 text-indigo-400/50" strokeWidth={1.5} />
            <p className="text-xs text-[var(--muted-foreground)] max-w-[220px]">
              {t("profile", "reviews_empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {myReviews.map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--foreground)]">{r.locationName}</span>
                  <Stars rating={r.stars} size="sm" />
                </div>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {/* Settings tab — language, theme, linked accounts, delete account */}
      {tab === "settings" && (
      <>
      <section className="px-4 mb-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-[var(--foreground)] mb-3">
          <Globe className="w-4 h-4 text-indigo-400" /> {t("profile", "lang_title")}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all",
                lang === l.code
                  ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-400"
                  : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/30"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 mb-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-[var(--foreground)] mb-3">
          <Settings className="w-4 h-4 text-indigo-400" /> {t("profile", "settings_title")}
        </h3>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Sun className="w-4 h-4 text-indigo-400" />
              )}
              <span className="text-sm font-medium text-[var(--foreground)]">
                {theme === "dark" ? t("profile", "theme_dark") : t("profile", "theme_light")}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                theme === "dark" ? "bg-indigo-500" : "bg-[var(--muted)] border border-[var(--border)]"
              )}
              aria-label="Theme toggle"
            >
              <span
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all",
                  theme === "dark" ? "left-6" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Linked accounts — reflects what's actually true: this account
          was created with email/password, and Google/Apple sign-in
          isn't wired to real OAuth yet (see AuthModal's social buttons),
          so showing them as "connected" would be fabricating a state
          that doesn't exist. */}
      <section className="px-4 mb-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-[var(--foreground)] mb-3">
          <Shield className="w-4 h-4 text-indigo-400" /> {t("profile", "linked_accounts_title")}
        </h3>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground)]">{user.email}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-semibold">
              {t("profile", "linked_email")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">Google</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-semibold">
              {t("profile", "linked_not_connected")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">Apple</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-semibold">
              {t("profile", "linked_not_connected")}
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 mb-5">
        <button
          onClick={() => showToast(t("profile", "delete_account_soon"), undefined, "info")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/15 transition-colors active:scale-[0.98]"
        >
          <Trash2 className="w-4 h-4" />
          {t("profile", "delete_account")}
        </button>
      </section>
      </>
      )}

      {/* Emergency numbers */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-400" /> {t("profile", "emergency_label")}
        </h3>
        <div className="p-3 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] space-y-1">
          {EMERGENCY_NUMBERS_RAW.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <item.Icon className="w-4 h-4 text-red-400" strokeWidth={2} />
                {t("services", item.key)}
              </span>
              <span className="text-sm font-bold text-red-400">{item.number}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Logout */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          {t("profile", "logout")}
        </button>
      </div>

      <p className="text-center text-[10px] text-[var(--muted-foreground)]/60 mt-6">
        mrforce.uz tomonidan ishlab chiqildi
      </p>
    </div>
  );
}

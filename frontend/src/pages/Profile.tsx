import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Globe,
  Moon,
  Sun,
  Star,
  BookmarkX,
  ChevronRight,
  User as UserIcon,
  Shield,
  Sparkles,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { Stars } from "@/components/ui/stars";
import { useTranslation } from "@/i18n";
import type { Lang } from "@/i18n";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek"   },
  { code: "ru", label: "Русский"  },
  { code: "en", label: "English"  },
  { code: "zh", label: "中文"     },
  { code: "de", label: "Deutsch"  },
  { code: "fr", label: "Français" },
];

const EMERGENCY_NUMBERS_RAW = [
  { emoji: "🚑", key: "emergency_ambulance" as const, number: "103" },
  { emoji: "🚒", key: "emergency_fire"      as const, number: "101" },
  { emoji: "👮", key: "emergency_police"    as const, number: "102" },
  { emoji: "⚠️", key: "emergency_gas"       as const, number: "104" },
  { emoji: "ℹ️", key: "emergency_tourism"   as const, number: "1219" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  } = useAppStore();

  function handleLogout() {
    localStorage.removeItem("mrtour-token");
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

  const GUEST_BENEFITS = [
    { icon: "🗺️", title: t("profile", "benefit1_title"), desc: t("profile", "benefit1_desc") },
    { icon: "🤖", title: t("profile", "benefit2_title"), desc: t("profile", "benefit2_desc") },
    { icon: "⭐", title: t("profile", "benefit3_title"), desc: t("profile", "benefit3_desc") },
    { icon: "💾", title: t("profile", "benefit4_title"), desc: t("profile", "benefit4_desc") },
  ];

  /* ── Guest view ───────────────────────────────────────────── */
  if (!isLoggedIn || !user) {
    return (
      <div className="pb-8 px-4">
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
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--muted)] border-2 border-[var(--border)] flex items-center justify-center">
            <UserIcon className="w-9 h-9 text-[var(--muted-foreground)]" />
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
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
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

        {/* Language selector for guest */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[var(--foreground)] mb-3 px-1">
            🌐 {t("profile", "lang_title")}
          </p>
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
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          <p className="text-sm font-bold text-[var(--foreground)] mb-3">
            {t("profile", "benefits_title")}
          </p>
          {GUEST_BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{b.title}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Theme toggle for guest */}
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
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
      </div>
    );
  }

  /* ── Authenticated view ───────────────────────────────────── */
  return (
    <div className="pb-8">
      {/* Avatar + name header */}
      <div className="relative overflow-hidden px-4 pt-5 pb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {user.isPremium && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-[var(--background)] flex items-center justify-center">
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 font-semibold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan list */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
            📋 {t("profile", "plan_title")}
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
          <div className="flex flex-col items-center gap-3 py-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
            <div className="text-4xl">🗺️</div>
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
          <div className="space-y-2">
            {plan.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] group"
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
                  onClick={() => removeFromPlan(loc.id)}
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              {t("profile", "plan_ai_btn")}
            </button>
          </div>
        )}
      </section>

      {/* Language selector */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">
          🌐 {t("profile", "lang_title")}
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

      {/* Theme toggle */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">
          ⚙️ {t("profile", "settings_title")}
        </h3>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
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

      {/* Emergency numbers */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-400" /> {t("profile", "emergency_label")}
        </h3>
        <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          {EMERGENCY_NUMBERS_RAW.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span>{item.emoji}</span>
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
    </div>
  );
}

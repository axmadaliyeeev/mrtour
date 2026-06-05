import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MapPin,
  Globe,
  Moon,
  Sun,
  Phone,
  Star,
  BookmarkX,
  ChevronRight,
  User as UserIcon,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Stars } from "@/components/ui/stars";

const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const EMERGENCY_NUMBERS = [
  { label: "Tez yordam", number: "103", emoji: "🚑" },
  { label: "Yong'in xizmati", number: "101", emoji: "🚒" },
  { label: "Politsiya", number: "102", emoji: "👮" },
  { label: "Gaz xizmati", number: "104", emoji: "⚠️" },
  { label: "Turizm info", number: "1219", emoji: "ℹ️" },
];

const GUEST_BENEFITS = [
  { icon: "🗺️", title: "Tur rejasi tuzish", desc: "Joylarni saqlash va marshrutni tartiblashtirish" },
  { icon: "🤖", title: "AI Bek bilan suhbat", desc: "Shaxsiy sayohat yordamchisi" },
  { icon: "⭐", title: "Sharh qoldirish", desc: "Boʻlgan joylar haqida fikr bildiring" },
  { icon: "💾", title: "Ma'lumotlarni saqlash", desc: "Reja va sozlamalar bulutda saqlanadi" },
];

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    logout,
    plan,
    removeFromPlan,
    theme,
    toggleTheme,
    openAuthModal,
    updateUser,
  } = useAppStore();

  function handleLogout() {
    localStorage.removeItem("mrtour-token");
    logout();
  }

  function handleLanguageChange(lang: string) {
    if (user) updateUser({ lang });
  }

  /* ── Guest view ───────────────────────────────────────────── */
  if (!isLoggedIn || !user) {
    return (
      <div className="pb-8 px-4">
        {/* Header */}
        <div className="pt-4 pb-6">
          <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">
            Profil
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Kirish yoki ro&apos;yxatdan o&apos;tish
          </p>
        </div>

        {/* Guest card */}
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--muted)] border-2 border-[var(--border)] flex items-center justify-center">
            <UserIcon className="w-9 h-9 text-[var(--muted-foreground)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] mb-1">
              Mehmon sifatida kiryapsiz
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Barcha imkoniyatlardan foydalanish uchun kiring
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={openAuthModal}
              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
            >
              Kirish
            </button>
            <button
              onClick={openAuthModal}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm font-semibold hover:border-teal-500/40 transition-colors"
            >
              Ro&apos;yxatdan o&apos;tish
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          <p className="text-sm font-bold text-[var(--foreground)] mb-3">
            Akkaunt imkoniyatlari
          </p>
          {GUEST_BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {b.title}
                </p>
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
                {theme === "dark" ? "Tungi rejim" : "Kunduzgi rejim"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                theme === "dark" ? "bg-teal-500" : "bg-[var(--muted)] border border-[var(--border)]"
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
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
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
            📋 Mening rejam
            <span className="ml-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[11px] font-bold">
              {plan.length}
            </span>
          </h3>
          {plan.length > 0 && (
            <button
              onClick={() => navigate("/locations")}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Joy qo&apos;shish <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {plan.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
            <div className="text-4xl">🗺️</div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Reja bo&apos;sh
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Joylarni bookmarklab rejangizni tuzing
            </p>
            <button
              onClick={() => navigate("/locations")}
              className="px-4 py-2 rounded-xl bg-teal-500 text-white text-xs font-semibold hover:bg-teal-600 transition-colors"
            >
              Joylarni ko&apos;rish
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
                  aria-label="Rejadan olib tashlash"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Language selector */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">
          🌐 Til
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all",
                user.lang === lang.code
                  ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                  : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-teal-500/30"
              )}
            >
              <span className="text-xl">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      {/* Theme toggle */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">
          ⚙️ Sozlamalar
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
                {theme === "dark" ? "Tungi rejim" : "Kunduzgi rejim"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                theme === "dark" ? "bg-teal-500" : "bg-[var(--muted)] border border-[var(--border)]"
              )}
              aria-label="Tema almashtirish"
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
          <Phone className="w-4 h-4 text-red-400" /> Favqulodda raqamlar
        </h3>
        <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          {EMERGENCY_NUMBERS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span>{item.emoji}</span>
                {item.label}
              </span>
              <span className="text-sm font-bold text-teal-400">{item.number}</span>
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
          Chiqish
        </button>
      </div>
    </div>
  );
}

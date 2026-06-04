"use client";

import { useState } from "react";
import { LogOut, MapPin, Globe, Moon, Sun, ChevronRight, Phone, Trash2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Location } from "@/types";

// ── Emergency numbers ─────────────────────────────────
const EMERGENCY = [
  { icon: "🚔", label: "Politsiya",         number: "1003", color: "text-blue-400"  },
  { icon: "🚑", label: "Tez yordam",         number: "103",  color: "text-red-400"   },
  { icon: "📞", label: "Turistik yordam",    number: "1182", color: "text-teal-400"  },
  { icon: "🔥", label: "Yong'in xizmati",   number: "101",  color: "text-orange-400" },
];

const BENEFITS = [
  { icon: "🗺️", text: "Shaxsiy tur rejasi yaratish" },
  { icon: "🤖", text: "AI Bek bilan to'liq suhbat" },
  { icon: "⭐",  text: "Joylarni saqlash va rejalash" },
  { icon: "🔔", text: "Yangi joylar haqida xabar" },
  { icon: "💎", text: "Premium xizmatlar chegirmalari" },
];

const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

// ── Plan mini-card ─────────────────────────────────────
function PlanCard({ location }: { location: Location }) {
  const { removeFromPlan } = useAppStore();
  return (
    <div className="relative shrink-0 w-36 rounded-xl overflow-hidden border border-border bg-card group">
      <div className="h-20 bg-muted overflow-hidden">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-foreground truncate">{location.name}</p>
        <p className="text-[10px] text-muted-foreground">{location.city}</p>
      </div>
      <button
        onClick={() => removeFromPlan(location.id)}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-2.5 h-2.5 text-white" />
      </button>
    </div>
  );
}

// ── Unauthenticated view ──────────────────────────────
function GuestProfile({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mb-6">
        👤
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Xush kelibsiz!</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        MRTOUR.UZ ning barcha imkoniyatlaridan foydalanish uchun tizimga kiring
      </p>

      <div className="w-full max-w-xs space-y-3 mb-8">
        <button
          onClick={onSignIn}
          className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors active:scale-[0.98]"
        >
          Kirish
        </button>
        <button
          onClick={onSignIn}
          className="w-full py-3 rounded-xl border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 font-semibold text-sm transition-colors active:scale-[0.98]"
        >
          Ro'yxatdan o'tish
        </button>
      </div>

      <div className="w-full max-w-xs space-y-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Ro'yxatdan o'tish afzalliklari
        </p>
        {BENEFITS.map((b) => (
          <div key={b.text} className="flex items-center gap-3 text-sm text-foreground/80">
            <span className="text-lg">{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Authenticated view ────────────────────────────────
export default function ProfilePage() {
  const { user, plan, clearPlan, setActiveTab } = useAppStore();
  const { logout, openAuthModal } = useAuth();
  const [lang, setLang] = useState(user?.lang ?? "uz");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return <GuestProfile onSignIn={openAuthModal} />;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "DELETE" });
    } catch { /* ignore */ }
    logout();
    setIsLoggingOut(false);
  }

  const initials = `${user.name.charAt(0)}${user.surname?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen px-4 py-4 space-y-5 animate-fade-up">

      {/* ── Avatar + info ───────────────────────────── */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-lg truncate">
            {user.name} {user.surname}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            <span>{user.country || "Mamlakat ko'rsatilmagan"}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          {user.isPremium && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
              💎 Premium
            </span>
          )}
        </div>
      </div>

      {/* ── My Plan ─────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-400" />
            Mening Rejam
            {plan.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400">
                {plan.length}
              </span>
            )}
          </h2>
          {plan.length > 0 && (
            <button
              onClick={clearPlan}
              className="text-[11px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Tozalash
            </button>
          )}
        </div>

        {plan.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="Reja bo'sh"
            description="Joylar sahifasidan joylarga +Reja tugmasini bosib saqlang"
            actionLabel="Joylarni ko'rish"
            onAction={() => setActiveTab("locations")}
          />
        ) : (
          <>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {plan.map((l) => (
                <PlanCard key={l.id} location={l as Location} />
              ))}
            </div>
            <button
              onClick={() => setActiveTab("chat")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium hover:bg-teal-500/20 transition-colors"
            >
              <Bot className="w-4 h-4" />
              AI bilan tur rejasi tuzish
            </button>
          </>
        )}
      </div>

      {/* ── Settings ────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <h2 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
          Sozlamalar
        </h2>

        {/* Language */}
        <div className="px-4 py-3 border-b border-border/60">
          <p className="text-sm font-medium text-foreground mb-2">Til</p>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                  lang === l.code
                    ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                    : "bg-muted border-border text-muted-foreground hover:border-teal-500/20"
                )}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
          <p className="text-sm font-medium text-foreground">Interfeys temasi</p>
          <ThemeToggle />
        </div>

        {/* Notifications */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Bildirishnomalar</p>
            <p className="text-xs text-muted-foreground">Yangi joylar va chegirmalar</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* ── Emergency ───────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <h2 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          Favqulodda raqamlar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {EMERGENCY.map((e, i) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                "hover:bg-muted transition-colors",
                i < EMERGENCY.length - 1 && "border-b border-border/60 sm:border-b-0",
                i % 2 === 0 && i + 1 < EMERGENCY.length && "sm:border-r sm:border-border/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{e.icon}</span>
                <span className="text-sm font-medium text-foreground">{e.label}</span>
              </div>
              <span className={cn("font-mono font-bold text-sm", e.color)}>
                {e.number}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Logout ──────────────────────────────────── */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
          "border border-red-500/30 text-red-400",
          "hover:bg-red-500/10 transition-colors active:scale-[0.98]",
          isLoggingOut && "opacity-60 cursor-not-allowed"
        )}
      >
        {isLoggingOut ? (
          <LoadingSpinner size="sm" color="text-red-400" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span className="text-sm font-semibold">
          {isLoggingOut ? "Chiqilmoqda..." : "Chiqish"}
        </span>
      </button>

      <div className="pb-4 text-center text-[10px] text-muted-foreground/50">
        MRTOUR.UZ v1.0 · Barcha huquqlar himoyalangan
      </div>
    </div>
  );
}

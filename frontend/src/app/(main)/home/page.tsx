"use client";

import { useEffect, useRef } from "react";
import { Bot, ChevronRight, MapPin, Star, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { LocationCard } from "@/components/locations/location-card";
import { LOCATIONS } from "@/data";

const STATS = [
  { icon: MapPin,  value: "8",     label: "UNESCO joylar" },
  { icon: Star,    value: "4.8★",  label: "O'rtacha reyting" },
  { icon: Users,   value: "3 000+",label: "Mamnun sayohatchi" },
  { icon: Zap,     value: "AI",    label: "Yordamchi doim tayyor" },
];

const CATEGORIES = [
  { id: "tarix",       emoji: "🏛️", label: "Tarix"       },
  { id: "tabiat",      emoji: "🌿", label: "Tabiat"      },
  { id: "madaniyat",   emoji: "🎭", label: "Madaniyat"   },
  { id: "din",         emoji: "🕌", label: "Din"         },
  { id: "arxeologiya", emoji: "⛏️", label: "Arxeologiya" },
];

export default function HomePage() {
  const { setActiveTab } = useAppStore();
  const { openAuthModal, user } = useAuth();
  const featured = LOCATIONS.filter((l) => l.featured);

  return (
    <div className="min-h-screen">

      {/* ── Hero ───────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-400/5 blur-3xl pointer-events-none" />

        <div className="relative px-4 pt-6 pb-8">
          {/* Greeting */}
          <p className="text-sm text-muted-foreground mb-1">
            {user ? `Xush kelibsiz, ${user.name}! 👋` : "Xush kelibsiz! 👋"}
          </p>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-1">
            O'zbekistonni
          </h1>
          <h1 className="text-3xl font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Kashf Et
            </span>{" "}
            <span className="text-foreground">🇺🇿</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
            AI yordamida shaxsiy tur rejasi tuz, eng yaxshi joylarni topib,
            unutilmas sayohat boshla.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold",
                "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
                "shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40",
                "transition-all duration-200 active:scale-[0.97]"
              )}
            >
              <Bot className="w-4 h-4" />
              AI bilan boshlash
            </button>
            <button
              onClick={() => setActiveTab("locations")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold",
                "border border-border bg-card text-foreground",
                "hover:border-teal-500/40 transition-all duration-200 active:scale-[0.97]"
              )}
            >
              Joylar
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-1",
                "rounded-xl border border-border bg-card text-center"
              )}
            >
              <s.icon className="w-4 h-4 text-teal-400 mb-1" />
              <p className="text-sm font-bold text-foreground leading-tight">{s.value}</p>
              <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ─────────────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Toifalar</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab("locations")}
              className={cn(
                "shrink-0 flex flex-col items-center gap-1.5 px-4 py-3",
                "rounded-xl border border-border bg-card",
                "hover:border-teal-500/40 hover:bg-teal-500/5",
                "transition-all duration-200 active:scale-95"
              )}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Locations ─────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-sm font-bold text-foreground">Mashhur Joylar</h2>
          <button
            onClick={() => setActiveTab("locations")}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-0.5 transition-colors"
          >
            Barchasi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div
          className="flex gap-3 overflow-x-auto px-4 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {featured.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              variant="featured"
              className="w-64"
            />
          ))}
        </div>
      </div>

      {/* ── All Locations grid ─────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Barcha Joylar</h2>
          <span className="text-[11px] text-muted-foreground">{LOCATIONS.length} ta joy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </div>

      {/* ── AI Banner ──────────────────────────────────── */}
      <div className="px-4 mb-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-5",
            "bg-gradient-to-br from-teal-600/20 via-teal-500/10 to-transparent",
            "border border-teal-500/30"
          )}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Bek — AI Yordamchi</p>
                <p className="text-[10px] text-teal-400">● Online, doim tayyor</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Har qanday savol bering — tur reja, narxlar, transport, eng yaxshi vaqt.
              Claude AI texnologiyasi bilan ishlaydi.
            </p>
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold",
                "bg-teal-500 hover:bg-teal-600 text-white",
                "transition-colors active:scale-95"
              )}
            >
              <Bot className="w-3.5 h-3.5" />
              Suhbat boshlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

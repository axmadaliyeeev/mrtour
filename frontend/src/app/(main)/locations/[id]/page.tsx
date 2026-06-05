"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Star, Bookmark, BookmarkCheck, ExternalLink, Calendar, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { useAppStore } from "@/store";
import { LOCATIONS, INIT_REVIEWS } from "@/data";

const CATEGORY_COLOR: Record<string, string> = {
  tarix:       "bg-amber-500/20 text-amber-400 border-amber-500/30",
  tabiat:      "bg-green-500/20 text-green-400 border-green-500/30",
  madaniyat:   "bg-purple-500/20 text-purple-400 border-purple-500/30",
  din:         "bg-teal-500/20 text-teal-400 border-teal-500/30",
  arxeologiya: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const CATEGORY_EMOJI: Record<string, string> = {
  tarix: "🏛️", tabiat: "🌿", madaniyat: "🎭", din: "🕌", arxeologiya: "⛏️",
};

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const router  = useRouter();
  const { addToPlan, removeFromPlan, isInPlan } = useAppStore();
  const location = LOCATIONS.find((l) => l.id === params.id);

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <span className="text-5xl">🗺️</span>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Joy topilmadi</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Bu joy mavjud emas yoki o'chirilgan</p>
        <button
          onClick={() => router.push("/locations")}
          className="px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-semibold"
        >
          Joylarga qaytish
        </button>
      </div>
    );
  }

  const inPlan      = isInPlan(location.id);
  const locationReviews = (INIT_REVIEWS[location.id] ?? []).slice(0, 5);
  const catColor    = CATEGORY_COLOR[location.category] ?? "";
  const catEmoji    = CATEGORY_EMOJI[location.category] ?? "📍";

  return (
    <div className="min-h-screen pb-8">
      {/* ── Hero Image ─────────────────────────────────── */}
      <div className="relative h-72 bg-[var(--muted)] overflow-hidden">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Bookmark */}
        <button
          onClick={() => inPlan ? removeFromPlan(location.id) : addToPlan(location)}
          className={cn(
            "absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-sm transition-all active:scale-90",
            inPlan ? "bg-teal-500 text-white" : "bg-black/50 text-white hover:bg-black/70"
          )}
        >
          {inPlan ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>

        {/* Category + name */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className={cn("inline-flex text-[10px] font-semibold px-2 py-1 rounded-full border mb-2", catColor)}>
            {catEmoji} {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
          </span>
          <h1 className="text-2xl font-extrabold text-white leading-tight">{location.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-3.5 h-3.5" />{location.city}, {location.region}
            </span>
            <Stars rating={location.rating} size="sm" showNumber count={location.reviewCount} showCount />
          </div>
        </div>
      </div>

      {/* ── Info cards ─────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Banknote className="w-4 h-4 text-teal-400 mb-1" />
            <p className="text-xs font-bold text-[var(--foreground)]">{location.priceUSD === 0 ? "Bepul" : `~$${location.priceUSD}`}</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Kirish</p>
          </div>
          <div className="flex flex-col items-center py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Clock className="w-4 h-4 text-teal-400 mb-1" />
            <p className="text-xs font-bold text-[var(--foreground)]">{location.duration}</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Davomiylik</p>
          </div>
          <div className="flex flex-col items-center py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Calendar className="w-4 h-4 text-teal-400 mb-1" />
            <p className="text-xs font-bold text-[var(--foreground)] text-center leading-tight">{location.bestSeason?.split(",")[0]}</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Eng yaxshi vaqt</p>
          </div>
        </div>
      </div>

      {/* ── Description ────────────────────────────────── */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">Tavsif</h2>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          {location.fullDesc || location.shortDesc}
        </p>
      </div>

      {/* ── Practical info ─────────────────────────────── */}
      <div className="px-4 mt-5 space-y-3">
        <h2 className="text-sm font-bold text-[var(--foreground)]">Amaliy ma'lumot</h2>
        <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] divide-y divide-[var(--border)]">
          {location.hours && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-[var(--muted-foreground)]">🕐 Ish vaqti</span>
              <span className="text-xs font-medium text-[var(--foreground)]">{location.hours}</span>
            </div>
          )}
          {location.transport && (
            <div className="flex items-start justify-between px-4 py-3 gap-4">
              <span className="text-xs text-[var(--muted-foreground)] shrink-0">🚌 Transport</span>
              <span className="text-xs font-medium text-[var(--foreground)] text-right">{location.transport}</span>
            </div>
          )}
          {location.price && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-[var(--muted-foreground)]">💰 Narx</span>
              <span className="text-xs font-medium text-teal-400">{location.price}</span>
            </div>
          )}
          {location.bestSeason && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-[var(--muted-foreground)]">🌤️ Eng yaxshi mavsum</span>
              <span className="text-xs font-medium text-[var(--foreground)]">{location.bestSeason}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tags ───────────────────────────────────────── */}
      <div className="px-4 mt-5">
        <div className="flex flex-wrap gap-2">
          {location.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Reviews ────────────────────────────────────── */}
      {locationReviews.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">
            Sharhlar
            <span className="ml-2 text-xs text-[var(--muted-foreground)] font-normal">({location.reviewCount})</span>
          </h2>
          <div className="space-y-3">
            {locationReviews.map((review) => (
              <div key={review.id} className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{review.country}</span>
                    <div>
                      <p className="text-xs font-semibold text-[var(--foreground)]">{review.author}</p>
                      <Stars rating={review.stars} size="sm" />
                    </div>
                  </div>
                  {review.trustScore >= 70 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400">
                      ✓ Tasdiqlangan
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ────────────────────────────────────────── */}
      <div className="px-4 mt-6 space-y-2">
        <button
          onClick={() => inPlan ? removeFromPlan(location.id) : addToPlan(location)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]",
            inPlan
              ? "border border-teal-500/40 bg-teal-500/10 text-teal-400"
              : "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20"
          )}
        >
          {inPlan ? <><BookmarkCheck className="w-4 h-4" /> Rejada bor</> : <><Bookmark className="w-4 h-4" /> Rejaga qo'shish</>}
        </button>
        {location.googleMapsUrl && (
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-teal-500/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Maps da ko'rish
          </a>
        )}
      </div>
    </div>
  );
}

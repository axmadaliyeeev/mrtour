import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Bus,
  ExternalLink,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCATIONS, INIT_REVIEWS } from "@/data";
import { Stars } from "@/components/ui/stars";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToPlan, removeFromPlan, isInPlan } = useAppStore();
  const { t } = useTranslation();

  const location = LOCATIONS.find((l) => l.id === id);
  const reviews = id ? (INIT_REVIEWS[id] ?? []) : [];

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-6xl">🗺️</div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          {t("detail", "not_found_title")}
        </h2>
        <p className="text-[var(--muted-foreground)] text-sm text-center">
          {t("detail", "not_found_desc")}
        </p>
        <button
          onClick={() => navigate("/locations")}
          className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
        >
          {t("detail", "back_to_list")}
        </button>
      </div>
    );
  }

  const loc = location; // narrowed - location is defined here (early return above)
  const inPlan = isInPlan(loc.id);

  function togglePlan() {
    if (inPlan) removeFromPlan(loc.id);
    else addToPlan(loc);
  }

  return (
    <div className="pb-8">
      {/* ── Hero image ──────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={location.img}
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Orqaga"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Bookmark */}
        <button
          onClick={togglePlan}
          className={cn(
            "absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-sm text-white flex items-center justify-center transition-all active:scale-90",
            inPlan ? "bg-indigo-500" : "bg-black/50 hover:bg-indigo-500/70"
          )}
          aria-label={inPlan ? t("detail", "remove_plan") : t("detail", "add_plan")}
        >
          {inPlan ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/80 text-white backdrop-blur-sm mb-2">
            {location.category.charAt(0).toUpperCase() +
              location.category.slice(1)}
          </span>
          <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
            {location.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {location.city}, {location.region}
            </span>
            <Stars
              rating={location.rating}
              size="sm"
              showNumber
              showCount
              count={location.reviewCount}
            />
          </div>
        </div>
      </div>

      {/* ── Info cards ──────────────────────────────────────────── */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2 mb-5">
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <DollarSign className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-[var(--foreground)] text-center leading-tight">
            {location.price}
          </span>
          <span className="text-[10px] text-[var(--muted-foreground)]">{t("detail", "price_label")}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-[var(--foreground)] text-center leading-tight">
            {location.duration}
          </span>
          <span className="text-[10px] text-[var(--muted-foreground)]">{t("detail", "duration_label")}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-[var(--foreground)] text-center leading-tight">
            {location.bestSeason.split(",")[0] ?? location.bestSeason}
          </span>
          <span className="text-[10px] text-[var(--muted-foreground)]">{t("detail", "season_label")}</span>
        </div>
      </div>

      {/* ── Description ─────────────────────────────────────────── */}
      <section className="px-4 mb-5">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-2">
          {t("detail", "description")}
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          {location.fullDesc}
        </p>
      </section>

      {/* ── Practical info ──────────────────────────────────────── */}
      <section className="px-4 mb-5">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-3">
          {t("detail", "practical_info")}
        </h2>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Clock className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                {t("detail", "hours")}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {location.hours}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Bus className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                {t("detail", "how_to_get")}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {location.transport}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                {t("detail", "best_season")}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {location.bestSeason}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tags ────────────────────────────────────────────────── */}
      <section className="px-4 mb-5">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" /> {t("detail", "tags_section")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {location.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="px-4 mb-5">
          <h2 className="text-base font-bold text-[var(--foreground)] mb-3">
            {t("detail", "reviews")} ({reviews.length})
          </h2>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        {review.author}
                      </p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">
                        {review.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        ✓ {t("detail", "verified")}
                      </span>
                    )}
                    <Stars rating={review.stars} size="sm" />
                  </div>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {review.text}
                </p>
                {review.aiTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {review.aiTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-[var(--muted-foreground)]/60 mt-2">
                  {review.time}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Action buttons ──────────────────────────────────────── */}
      <div className="px-4 flex gap-3">
        <button
          onClick={togglePlan}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]",
            inPlan
              ? "bg-indigo-500/15 border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/25"
              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
          )}
        >
          {inPlan ? (
            <>
              <BookmarkCheck className="w-4 h-4" /> {t("detail", "remove_plan")}
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" /> {t("detail", "add_plan")}
            </>
          )}
        </button>

        <a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 text-[var(--foreground)] text-sm font-semibold transition-all active:scale-[0.97]"
        >
          <ExternalLink className="w-4 h-4 text-indigo-400" />
          {t("detail", "map")}
        </a>
      </div>
    </div>
  );
}

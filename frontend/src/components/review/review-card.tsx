"use client";

import { cn } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { TrustBadge } from "@/components/ui/trust-badge";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  className?: string;
}

function trustBorderColor(score: number): string {
  if (score >= 70) return "border-l-emerald-400";
  if (score >= 40) return "border-l-amber-400";
  return "border-l-red-400";
}

function tagDotColor(score: number): string {
  if (score >= 70) return "🟢";
  if (score >= 40) return "🟡";
  return "🔴";
}

function formatTimeAgo(time: string): string {
  const date = new Date(time);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Bugun";
  if (days === 1) return "Kecha";
  if (days < 30) return `${days} kun oldin`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} oy oldin`;
  return `${Math.floor(months / 12)} yil oldin`;
}

export function ReviewCard({ review, showActions = false, className }: ReviewCardProps) {
  const dot = tagDotColor(review.trustScore);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        "border-l-4 pl-4 pr-4 py-3.5",
        "animate-fade-up",
        trustBorderColor(review.trustScore),
        className
      )}
    >
      {/* ── Header row ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none shrink-0" title={review.country}>
            {review.country.length <= 4 ? review.country : "🌍"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {review.author}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {formatTimeAgo(review.time)}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <TrustBadge score={review.trustScore} showScore />
          {review.verified && (
            <span className="text-[10px] text-emerald-400">✓ Tasdiqlangan</span>
          )}
        </div>
      </div>

      {/* ── Stars ──────────────────────────────────────── */}
      <div className="mb-2">
        <Stars rating={review.stars} size="sm" />
      </div>

      {/* ── Review text ────────────────────────────────── */}
      <blockquote
        className={cn(
          "text-sm text-foreground/90 italic leading-relaxed",
          "before:content-['«'] after:content-['»']",
          "before:text-teal-400 after:text-teal-400",
          "before:font-bold after:font-bold before:not-italic after:not-italic"
        )}
      >
        {review.text}
      </blockquote>

      {/* ── AI tags ────────────────────────────────────── */}
      {review.aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {review.aiTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5",
                "rounded-full text-[11px] font-medium",
                "bg-muted border border-border text-muted-foreground"
              )}
            >
              <span className="leading-none text-xs">{dot}</span>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Actions ────────────────────────────────────── */}
      {showActions && (
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
          <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            👍 Foydali
          </button>
          <button className="text-[11px] text-muted-foreground hover:text-red-400 transition-colors">
            🚩 Bildirish
          </button>
        </div>
      )}
    </div>
  );
}

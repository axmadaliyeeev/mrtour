"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { ReviewCard } from "./review-card";
import { AIInsight } from "./ai-insight";
import { Stars } from "@/components/ui/stars";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Location, Review } from "@/types";

// ── Types ────────────────────────────────────────────
interface SmartReviewPanelProps {
  location: Location;
  reviews: Review[];
  onAddReview: (text: string, stars: number) => Promise<void>;
  loading: boolean;
  onClose?: () => void;
}

interface ReviewStats {
  avgRating: number;
  verifiedAvg: number;
  trustIndex: number;
  total: number;
  verified: number;
  suspicious: number;
  fake: number;
}

type TabId = "reviews" | "write" | "insight";

// ── Helpers ──────────────────────────────────────────
function calcStats(reviews: Review[]): ReviewStats {
  if (!reviews.length) {
    return { avgRating: 0, verifiedAvg: 0, trustIndex: 0, total: 0, verified: 0, suspicious: 0, fake: 0 };
  }
  const avgRating   = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
  const verifiedSet = reviews.filter((r) => r.trustScore >= 70);
  const verifiedAvg = verifiedSet.length
    ? verifiedSet.reduce((s, r) => s + r.stars, 0) / verifiedSet.length
    : 0;
  const trustIndex  = Math.round(reviews.reduce((s, r) => s + r.trustScore, 0) / reviews.length);

  return {
    avgRating,
    verifiedAvg,
    trustIndex,
    total:      reviews.length,
    verified:   reviews.filter((r) => r.trustScore >= 70).length,
    suspicious: reviews.filter((r) => r.trustScore >= 40 && r.trustScore < 70).length,
    fake:       reviews.filter((r) => r.trustScore < 40).length,
  };
}

function trustBarColor(index: number) {
  if (index >= 70) return "bg-emerald-400";
  if (index >= 40) return "bg-amber-400";
  return "bg-red-400";
}

// ── Sub-component: clickable star selector ───────────
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="text-2xl leading-none transition-transform hover:scale-110 active:scale-95"
          aria-label={`${n} yulduz`}
        >
          <span className={n <= display ? "text-amber-400" : "text-gray-500/50"}>
            ★
          </span>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {["", "Yomon", "Qoniqarli", "O'rtacha", "Yaxshi", "A'lo!"][value]}
        </span>
      )}
    </div>
  );
}

// ── Sub-component: stat card ─────────────────────────
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-xl p-2.5 text-center">
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[9px] text-teal-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Write review tab ─────────────────────────────────
function WriteReviewTab({
  onSubmit,
  submitting,
}: {
  onSubmit: (text: string, stars: number) => Promise<void>;
  submitting: boolean;
}) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const charCount = text.trim().length;
  const isHighTrust = charCount >= 50;
  const canSubmit = stars > 0 && charCount >= 10 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    await onSubmit(text.trim(), stars);
    setSubmitted(true);
    setStars(0);
    setText("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 animate-fade-up">
        <span className="text-4xl">✅</span>
        <p className="text-sm font-semibold text-emerald-400">Sharh qabul qilindi!</p>
        <p className="text-xs text-muted-foreground text-center">
          AI tahlil qilinmoqda. Natija tez orada ko'rinadi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stars */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Baho bering</p>
        <StarSelector value={stars} onChange={setStars} />
      </div>

      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Fikringiz</p>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-[10px] font-medium transition-colors",
                isHighTrust ? "text-emerald-400" : "text-muted-foreground"
              )}
            >
              {charCount}/1000
            </span>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder="Ushbu joy haqida batafsil yozing..."
          rows={4}
          disabled={submitting}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl border border-border bg-muted",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none resize-none transition-all",
            "focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30",
            submitting && "opacity-60 cursor-not-allowed"
          )}
        />

        {/* Trust indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 mt-1.5 text-[11px] transition-colors",
            isHighTrust ? "text-emerald-400" : "text-muted-foreground/60"
          )}
        >
          <span>{isHighTrust ? "✓" : "ℹ"}</span>
          <span>
            {isHighTrust
              ? "Batafsil sharh — yuqori ishonch bali"
              : `50+ belgi = yuqori ishonch (hozir ${charCount})`}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          "w-full py-2.5 rounded-xl text-sm font-semibold",
          "transition-all duration-200 active:scale-[0.98]",
          canSubmit
            ? "bg-teal-500 hover:bg-teal-600 text-white shadow-md"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" color="text-white" />
            AI tahlil qilinmoqda...
          </span>
        ) : (
          "Sharh yuborish"
        )}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────
export function SmartReviewPanel({
  location,
  reviews,
  onAddReview,
  loading,
  onClose,
}: SmartReviewPanelProps) {
  const { isMobile } = useBreakpoint();
  const [tab, setTab] = useState<TabId>("reviews");
  const stats = calcStats(reviews);

  const TABS: { id: TabId; label: string }[] = [
    { id: "reviews", label: `Sharhlar (${reviews.length})` },
    { id: "write",   label: "Sharh yozish" },
    { id: "insight", label: "AI Insight" },
  ];

  const content = (
    <div className={cn("flex flex-col", isMobile ? "max-h-[85vh]" : "max-h-[600px]")}>

      {/* ── Panel header ─────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-foreground">{location.name}</p>
          <p className="text-xs text-muted-foreground">Smart Review System</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* ── Stats block ──────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-b border-border space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Umumiy ★"      value={stats.avgRating.toFixed(1)} />
          <StatCard label="Tasdiqlangan ★" value={stats.verifiedAvg.toFixed(1)} sub="Ishonchli" />
          <StatCard label="Ishonch %"     value={`${stats.trustIndex}%`} />
          <StatCard label="Jami"          value={String(stats.total)} />
        </div>

        {/* Trust progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Ishonch indeksi</span>
            <span>{stats.trustIndex}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", trustBarColor(stats.trustIndex))}
              style={{ width: `${stats.trustIndex}%` }}
            />
          </div>
        </div>

        {/* Trust breakdown */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            🟢 {stats.verified} haqiqiy
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            🟡 {stats.suspicious} shubhali
          </span>
          <span className="flex items-center gap-1 text-red-400">
            🔴 {stats.fake} soxta
          </span>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="shrink-0 flex border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium transition-colors",
              tab === t.id
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "reviews" && (
          <div className="space-y-3">
            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            )}
            {!loading && reviews.length === 0 && (
              <EmptyState
                icon="💬"
                title="Hali sharhlar yo'q"
                description="Birinchi bo'lib fikringizni qoldiring!"
                actionLabel="Sharh yozish"
                onAction={() => setTab("write")}
              />
            )}
            {!loading &&
              reviews.map((r) => (
                <ReviewCard key={r.id} review={r} showActions />
              ))}
          </div>
        )}

        {tab === "write" && (
          <WriteReviewTab onSubmit={onAddReview} submitting={loading} />
        )}

        {tab === "insight" && (
          <AIInsight
            locationId={location.id}
            locationName={location.name}
          />
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
        {/* Bottom sheet */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50",
            "rounded-t-2xl bg-card border-t border-border",
            "animate-fade-up shadow-2xl"
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>
          {content}
        </div>
      </>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
      {content}
    </div>
  );
}

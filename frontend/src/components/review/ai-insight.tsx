"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { INIT_REVIEWS } from "@/data";

interface AIInsightProps {
  locationId: string;
  locationName: string;
  className?: string;
}

export function AIInsight({ locationId, locationName, className }: AIInsightProps) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function fetchInsight() {
    setLoading(true);
    try {
      const reviews = INIT_REVIEWS[locationId] ?? [];
      const data = await apiClient.post<{ insight: string }>("/ai/analyze-reviews", {
        locationId,
        locationName,
        reviews: reviews.slice(0, 20).map(({ author, stars, text, trustScore }) => ({
          author, stars, text, trustScore,
        })),
      });
      setText(data.insight);
      setLoaded(true);
    } catch {
      setText(
        `**${locationName}** uchun AI tahlil hozircha mavjud emas.\n\n` +
          "Backend ulangandan so'ng bu funksiya to'liq ishlaydi. " +
          "Sharhlar yig'ilishi davom etmoqda..."
      );
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setText(null);
    setLoaded(false);
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* ── Idle state ─────────────────────────────────── */}
      {!loaded && !loading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <span className="text-3xl">🔍</span>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">AI Sharh Tahlili</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Claude AI barcha sharhlarni tahlil qilib, umumiy xulosa va tendentsiyalarni
              chiqaradi
            </p>
          </div>
          <button
            onClick={fetchInsight}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full",
              "bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold",
              "transition-all active:scale-95 shadow-md"
            )}
          >
            🔍 AI Tahlil boshlash
          </button>
        </div>
      )}

      {/* ── Loading state ───────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-xl",
              "bg-teal-500/10 border border-teal-500/30"
            )}
          >
            🤖
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Tahlil qilinmoqda...</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Claude AI sharhlarni o'qimoqda
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-teal-400 dot-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Result state ───────────────────────────────── */}
      {loaded && text && (
        <div className="space-y-3 animate-fade-up">
          <div
            className={cn(
              "rounded-xl border border-teal-500/25",
              "bg-teal-500/5 p-4"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🤖</span>
              <p className="text-xs font-semibold text-teal-400">
                Claude AI tahlili · {locationName}
              </p>
            </div>
            <p
              className={cn(
                "text-sm text-foreground/90 leading-relaxed",
                "whitespace-pre-wrap"
              )}
            >
              {text}
            </p>
          </div>

          <button
            onClick={reset}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "border border-border bg-muted hover:bg-accent",
              "text-xs text-muted-foreground hover:text-foreground",
              "transition-colors active:scale-95"
            )}
          >
            <RefreshCw className="w-3 h-3" />
            Yangilash
          </button>
        </div>
      )}
    </div>
  );
}

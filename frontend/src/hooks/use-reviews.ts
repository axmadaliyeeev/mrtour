"use client";

import { useState, useCallback } from "react";
import type { Review } from "@/types";
import { INIT_REVIEWS } from "@/data";
import { apiClient } from "@/lib/api-client";

interface ReviewStats {
  avgRating: number;
  trustIndex: number;
  verified: number;
  suspicious: number;
  fake: number;
}

interface AIAnalysis {
  trustScore: number;
  aiTags: string[];
  verified: boolean;
}

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  addReview: (text: string, stars: number) => Promise<void>;
  analyzeReview: (text: string, stars: number) => Promise<AIAnalysis | null>;
  generateInsight: () => Promise<string | null>;
  getStats: () => ReviewStats;
}

function makeOptimisticReview(
  locationId: string,
  text: string,
  stars: number
): Review {
  return {
    id: `opt-${Date.now()}`,
    locationId,
    author: "Siz",
    country: "🌍",
    text,
    stars,
    time: new Date().toISOString(),
    trustScore: 0,
    aiTags: [],
    verified: false,
  };
}

export function useReviews(locationId: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>(
    INIT_REVIEWS[locationId] ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // ── fetchReviews ──────────────────────────────────
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Review[]>(
        `/reviews?locationId=${locationId}`
      );
      setReviews(data.length > 0 ? data : (INIT_REVIEWS[locationId] ?? []));
    } catch {
      setReviews(INIT_REVIEWS[locationId] ?? []);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  // ── addReview with optimistic update + rollback ───
  const addReview = useCallback(
    async (text: string, stars: number) => {
      const optimistic = makeOptimisticReview(locationId, text, stars);

      // 1. Optimistically prepend
      setReviews((prev) => [optimistic, ...prev]);
      setLoading(true);
      setError(null);

      try {
        // 2. Persist to backend
        const created = await apiClient.post<Review>("/reviews", {
          locationId,
          text,
          stars,
        });

        // 3. Replace optimistic entry with real one
        setReviews((prev) =>
          prev.map((r) => (r.id === optimistic.id ? created : r))
        );

        // 4. Enrich with AI analysis asynchronously (no await, non-blocking)
        apiClient
          .post<AIAnalysis>("/ai/analyze-review", { text, stars })
          .then((analysis) => {
            setReviews((prev) =>
              prev.map((r) =>
                r.id === created.id
                  ? {
                      ...r,
                      trustScore: analysis.trustScore,
                      aiTags:     analysis.aiTags,
                      verified:   analysis.verified,
                    }
                  : r
              )
            );
          })
          .catch(() => {
            // Non-critical — AI enrichment is best-effort
          });
      } catch (err) {
        // Rollback optimistic entry
        setReviews((prev) => prev.filter((r) => r.id !== optimistic.id));
        setError(err instanceof Error ? err.message : "Sharh yuborishda xato");
      } finally {
        setLoading(false);
      }
    },
    [locationId]
  );

  // ── analyzeReview ─────────────────────────────────
  const analyzeReview = useCallback(
    async (text: string, stars: number): Promise<AIAnalysis | null> => {
      try {
        return await apiClient.post<AIAnalysis>("/ai/analyze-review", {
          text,
          stars,
        });
      } catch {
        return null;
      }
    },
    []
  );

  // ── generateInsight ───────────────────────────────
  const generateInsight = useCallback(async (): Promise<string | null> => {
    try {
      const payload = reviews.slice(0, 20).map(({ author, stars, text, trustScore }) => ({
        author,
        stars,
        text,
        trustScore,
      }));
      const data = await apiClient.post<{ insight: string }>("/ai/analyze-reviews", {
        locationId,
        reviews: payload,
      });
      return data.insight;
    } catch {
      return null;
    }
  }, [locationId, reviews]);

  // ── getStats ──────────────────────────────────────
  const getStats = useCallback((): ReviewStats => {
    if (!reviews.length) {
      return { avgRating: 0, trustIndex: 0, verified: 0, suspicious: 0, fake: 0 };
    }

    const avgRating  = reviews.reduce((s, r) => s + r.stars,      0) / reviews.length;
    const trustIndex = Math.round(
      reviews.reduce((s, r) => s + r.trustScore, 0) / reviews.length
    );
    const verified   = reviews.filter((r) => r.trustScore >= 75).length;
    const suspicious = reviews.filter((r) => r.trustScore >= 40 && r.trustScore < 75).length;
    const fake       = reviews.filter((r) => r.trustScore < 40).length;

    return { avgRating, trustIndex, verified, suspicious, fake };
  }, [reviews]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview,
    analyzeReview,
    generateInsight,
    getStats,
  };
}

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

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  addReview: (text: string, stars: number) => Promise<void>;
  getStats: () => ReviewStats;
}

export function useReviews(locationId: string): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>(
    INIT_REVIEWS[locationId] ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Review[]>(
        `/reviews?locationId=${locationId}`
      );
      setReviews(data.length > 0 ? data : (INIT_REVIEWS[locationId] ?? []));
    } catch {
      // API unavailable — keep static fallback, don't surface error to user
      setReviews(INIT_REVIEWS[locationId] ?? []);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  const addReview = useCallback(
    async (text: string, stars: number) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.post<Review>("/reviews", {
          locationId,
          text,
          stars,
        });
        setReviews((prev) => [created, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit review");
      } finally {
        setLoading(false);
      }
    },
    [locationId]
  );

  const getStats = useCallback((): ReviewStats => {
    if (reviews.length === 0) {
      return { avgRating: 0, trustIndex: 0, verified: 0, suspicious: 0, fake: 0 };
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;

    const verified = reviews.filter((r) => r.trustScore >= 75).length;
    const suspicious = reviews.filter(
      (r) => r.trustScore >= 40 && r.trustScore < 75
    ).length;
    const fake = reviews.filter((r) => r.trustScore < 40).length;

    const trustIndex = Math.round(
      reviews.reduce((sum, r) => sum + r.trustScore, 0) / reviews.length
    );

    return { avgRating, trustIndex, verified, suspicious, fake };
  }, [reviews]);

  return { reviews, loading, error, fetchReviews, addReview, getStats };
}

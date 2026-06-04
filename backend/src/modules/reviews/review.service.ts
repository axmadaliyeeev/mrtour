import type { FilterQuery } from "mongoose";
import { Review, type IReview } from "./review.model";
import * as aiService from "@/modules/ai/ai.service";
import { createError } from "@/middleware/error-handler";
import { buildPagination, type PaginationMeta } from "@/utils/response";

// ── Types ─────────────────────────────────────────────
export interface CreateReviewDto {
  locationId: string;
  text: string;
  stars: number;
  author?: string;
  country?: string;
  userId?: string;
}

export interface ReviewStats {
  avgRating:  number;
  trustIndex: number;
  verified:   number;
  suspicious: number;
  fake:       number;
  total:      number;
}

interface GetByLocationResult {
  reviews:    IReview[];
  total:      number;
  pagination: PaginationMeta;
}

// ── getByLocation ─────────────────────────────────────
export async function getByLocation(
  locationId: string,
  page  = 1,
  limit = 10
): Promise<GetByLocationResult> {
  const safeLimit = Math.min(50, Math.max(1, limit));
  const safePage  = Math.max(1, page);
  const skip      = (safePage - 1) * safeLimit;

  const query: FilterQuery<IReview> = { locationId };

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("userId", "name")
      .lean<IReview[]>(),
    Review.countDocuments(query),
  ]);

  return {
    reviews,
    total,
    pagination: buildPagination(safePage, safeLimit, total),
  };
}

// ── create (with AI analysis) ─────────────────────────
export async function create(data: CreateReviewDto): Promise<IReview> {
  // Step 1: Persist the review immediately (triggers post-save hook → location.rating)
  const review = await Review.create({
    locationId: data.locationId,
    text:       data.text,
    stars:      data.stars,
    author:     data.author?.trim() || "Anonim",
    country:    data.country || "🌍",
    ...(data.userId && { userId: data.userId }),
    trustScore: 0,
    aiTags:     [],
    verified:   false,
  });

  // Step 2–3: AI analysis & update (non-fatal if it fails)
  try {
    const analysis = await aiService.analyzeReview(data.text, data.stars);

    review.trustScore = analysis.trustScore;
    review.aiTags     = analysis.aiTags;
    review.verified   = analysis.verified;

    // Step 4: save() triggers post-save hook → recalculates location.rating
    await review.save();
  } catch (err) {
    console.warn("[review.service] AI analysis failed:", (err as Error).message);
    // Review is already saved — return without AI enrichment
  }

  // Step 5: Return the enriched (or plain) document
  return review.toObject() as IReview;
}

// ── getStats ──────────────────────────────────────────
export async function getStats(locationId: string): Promise<ReviewStats> {
  const [result] = await Review.aggregate<ReviewStats & { _id: null }>([
    { $match: { locationId: { $toString: locationId } } },
    {
      $group: {
        _id:        null,
        avgRating:  { $avg: "$stars" },
        trustIndex: { $avg: "$trustScore" },
        total:      { $sum: 1 },
        verified: {
          $sum: { $cond: [{ $gte: ["$trustScore", 70] }, 1, 0] },
        },
        suspicious: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$trustScore", 40] }, { $lt: ["$trustScore", 70] }] },
              1, 0,
            ],
          },
        },
        fake: {
          $sum: { $cond: [{ $lt: ["$trustScore", 40] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id:        0,
        avgRating:  { $round: ["$avgRating",  1] },
        trustIndex: { $round: ["$trustIndex", 0] },
        total:      1,
        verified:   1,
        suspicious: 1,
        fake:       1,
      },
    },
  ]);

  return (
    result ?? {
      avgRating: 0, trustIndex: 0,
      total: 0, verified: 0, suspicious: 0, fake: 0,
    }
  );
}

// ── deleteById ────────────────────────────────────────
export async function deleteById(id: string, userId: string): Promise<void> {
  const review = await Review.findById(id);
  if (!review) throw createError("Review not found", 404);
  if (review.userId?.toString() !== userId) {
    throw createError("Forbidden", 403);
  }
  await review.deleteOne();
}

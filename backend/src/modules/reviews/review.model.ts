import {
  Schema,
  model,
  type Model,
  type HydratedDocument,
  type Types,
} from "mongoose";

export interface IReview {
  locationId: Types.ObjectId;
  userId?: Types.ObjectId;
  author: string;
  country: string;
  text: string;
  stars: number;
  trustScore: number;
  aiTags: string[];
  verified: boolean;
  createdAt: Date;
}

export type ReviewDocument = HydratedDocument<IReview>;
export type ReviewModel = Model<IReview>;

const reviewSchema = new Schema<IReview>(
  {
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    userId:     { type: Schema.Types.ObjectId, ref: "User" },
    author:     { type: String, required: true, trim: true },
    country:    { type: String, default: "🌍" },
    text:       { type: String, required: true, minlength: 5, maxlength: 1000, trim: true },
    stars:      { type: Number, required: true, min: 1, max: 5 },
    trustScore: { type: Number, min: 0, max: 100, default: 0 },
    aiTags:     [{ type: String }],
    verified:   { type: Boolean, default: false },
    createdAt:  { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

// ── Indexes ───────────────────────────────────────────
reviewSchema.index({ locationId: 1, createdAt: -1 });

// ── Post-save: recalculate Location rating ────────────
reviewSchema.post("save", async function () {
  // Lazy import to avoid circular dependency at module load time
  const { Location } = await import("@/modules/locations/location.model");

  const [stats] = await Review.aggregate<{
    avgRating: number;
    count: number;
  }>([
    { $match: { locationId: this.locationId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$stars" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats) {
    await Location.findByIdAndUpdate(this.locationId, {
      rating: Math.round(stats.avgRating * 10) / 10,
      reviewCount: stats.count,
    });
  }
});

// ── Post-deleteOne: recalculate after removal ─────────
reviewSchema.post("deleteOne", { document: true, query: false }, async function () {
  const { Location } = await import("@/modules/locations/location.model");

  const [stats] = await Review.aggregate<{
    avgRating: number;
    count: number;
  }>([
    { $match: { locationId: this.locationId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$stars" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Location.findByIdAndUpdate(this.locationId, {
    rating: stats ? Math.round(stats.avgRating * 10) / 10 : 0,
    reviewCount: stats?.count ?? 0,
  });
});

export const Review = model<IReview, ReviewModel>("Review", reviewSchema);

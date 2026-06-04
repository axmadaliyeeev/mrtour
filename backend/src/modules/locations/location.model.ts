import { Schema, model, type Document, type Model, type HydratedDocument } from "mongoose";

export interface ILocation {
  name: string;
  city: string;
  region: string;
  category: "tarix" | "tabiat" | "madaniyat" | "din" | "arxeologiya";
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  transport: string;
  hours: string;
  price: string;
  priceUSD: number;
  googleMapsUrl: string;
  bestSeason: string;
  duration: string;
  featured: boolean;
  createdAt: Date;
  // virtual
  img?: string;
}

export type LocationDocument = HydratedDocument<ILocation>;
export type LocationModel = Model<ILocation>;

const locationSchema = new Schema<ILocation>(
  {
    name:         { type: String, required: true, trim: true },
    city:         { type: String, required: true, trim: true },
    region:       { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["tarix", "tabiat", "madaniyat", "din", "arxeologiya"],
      required: true,
    },
    rating:       { type: Number, min: 0, max: 5, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    images:       [{ type: String }],
    tags:         [{ type: String, trim: true }],
    shortDesc:    { type: String, trim: true },
    fullDesc:     { type: String, trim: true },
    transport:    { type: String },
    hours:        { type: String },
    price:        { type: String },
    priceUSD:     { type: Number, default: 0 },
    googleMapsUrl: { type: String },
    bestSeason:   { type: String },
    duration:     { type: String },
    featured:     { type: Boolean, default: false },
    createdAt:    { type: Date, default: () => new Date() },
  },
  {
    versionKey: false,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────
locationSchema.index({ city: 1 });
locationSchema.index({ category: 1 });
locationSchema.index({ featured: 1 });
locationSchema.index({ rating: -1 });
locationSchema.index({ name: "text", shortDesc: "text", city: "text" });

// ── Virtual: img (first image) ────────────────────────
locationSchema.virtual("img").get(function (this: ILocation) {
  return this.images?.[0] ?? null;
});

export const Location = model<ILocation, LocationModel>("Location", locationSchema);

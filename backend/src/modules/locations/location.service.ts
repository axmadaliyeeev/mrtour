import type { FilterQuery, SortOrder } from "mongoose";
import { Location, type ILocation } from "./location.model";
import { createError } from "@/middleware/error-handler";

// ── Types ─────────────────────────────────────────────
export interface LocationFilters {
  category?: ILocation["category"];
  region?: string;
  search?: string;
  featured?: boolean;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export type SortField = "rating" | "reviewCount" | "price";

const SORT_MAP: Record<SortField, Record<string, SortOrder>> = {
  rating:      { rating: -1 },
  reviewCount: { reviewCount: -1 },
  price:       { priceUSD: 1 },
};

interface GetAllResult {
  locations: ILocation[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

// ── getAll ────────────────────────────────────────────
export async function getAll(
  filters: LocationFilters = {},
  pagination: PaginationInput = {},
  sort: SortField = "rating"
): Promise<GetAllResult> {
  const page  = Math.max(1, pagination.page  ?? 1);
  const limit = Math.min(50, Math.max(1, pagination.limit ?? 12));
  const skip  = (page - 1) * limit;

  const query: FilterQuery<ILocation> = {};

  if (filters.category) query.category = filters.category;
  if (filters.region)   query.region   = { $regex: filters.region, $options: "i" };
  if (typeof filters.featured === "boolean") query.featured = filters.featured;

  if (filters.search?.trim()) {
    const rx = { $regex: filters.search.trim(), $options: "i" };
    query.$or = [{ name: rx }, { city: rx }, { shortDesc: rx }, { tags: rx }];
  }

  const [locations, total] = await Promise.all([
    Location.find(query)
      .sort(SORT_MAP[sort] ?? SORT_MAP.rating)
      .skip(skip)
      .limit(limit)
      .lean<ILocation[]>(),
    Location.countDocuments(query),
  ]);

  return { locations, total, pages: Math.ceil(total / limit), page, limit };
}

// ── getById ───────────────────────────────────────────
export async function getById(id: string): Promise<ILocation> {
  const location = await Location.findById(id).lean<ILocation>();

  if (!location) {
    throw createError(`Location '${id}' not found`, 404);
  }

  return location;
}

// ── getFeatured ───────────────────────────────────────
export async function getFeatured(): Promise<ILocation[]> {
  return Location.find({ featured: true })
    .sort({ rating: -1 })
    .limit(6)
    .lean<ILocation[]>();
}

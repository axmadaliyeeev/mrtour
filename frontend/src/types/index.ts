export interface Location {
  id: string;
  name: string;
  city: string;
  region: string;
  category: "tarix" | "tabiat" | "madaniyat" | "din" | "arxeologiya";
  rating: number;
  reviewCount: number;
  img: string;
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
}

export interface Review {
  id: string;
  locationId: string;
  author: string;
  country: string;
  stars: number;
  text: string;
  time: string;
  trustScore: number;
  aiTags: string[];
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  country: string;
  lang: string;
  plan: Location[];
  isPremium: boolean;
  // Legacy: set by the Google Sign-In flow, which has since been replaced
  // by emailed verification codes. The column is still on the User model
  // (dropping it would be a destructive migration), so the field is kept
  // here for type accuracy even though nothing reads it any more.
  googleId?: string | null;
  // False until the emailed 6-digit code has been confirmed. Existing
  // accounts predating this feature were backfilled to true.
  emailVerified?: boolean;
  // A resized JPEG data URL, or null/undefined for the initial-letter
  // fallback avatar. There is no object storage wired up, so the photo
  // itself lives in this field rather than a CDN URL.
  avatarUrl?: string | null;
}

export interface Guide {
  id: string;
  name: string;
  city: string;
  langs: string[];
  rating: number;
  pricePerDay: number;
  available: boolean;
  bio: string;
  verified: boolean;
  img: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface MenuItem {
  name: string;
  price: number;
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  address: string;
  hours: string;
  img: string;
  menu: MenuItem[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  address: string;
  img: string;
  available: boolean;
}

export type CategoryKey = Location["category"];

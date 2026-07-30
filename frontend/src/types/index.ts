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
  // Set by the Google Sign-In flow; null/absent for email-password-only
  // accounts. Backend's sanitize() passes it through (only passwordHash
  // and refreshToken are stripped), so Profile can show the real
  // linked-account state.
  googleId?: string | null;
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

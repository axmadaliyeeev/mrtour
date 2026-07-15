import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Location, Review } from "@/types";
import type { Lang } from "@/i18n/translations";

export interface Toast {
  id: string;
  message: string;
  icon?: string;
  type?: "success" | "info" | "error";
}

interface AppStore {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  // Plan
  plan: Location[];
  addToPlan: (location: Location) => void;
  removeFromPlan: (id: string) => void;
  isInPlan: (id: string) => boolean;
  clearPlan: () => void;

  // Language (app-level, persisted, works for guests too)
  lang: Lang;
  setLang: (lang: Lang) => void;

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // UI
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, icon?: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;

  // User reviews (persisted locally, works without backend)
  userReviews: Record<string, Review[]>;
  addUserReview: (locationId: string, review: Omit<Review, "id" | "locationId">) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────
      user: null,
      isLoggedIn: false,

      login: (user) =>
        set((state) => ({
          user,
          isLoggedIn: true,
          lang: (user.lang as Lang) ?? state.lang,
        })),

      logout: () => set({ user: null, isLoggedIn: false, plan: [] }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      // ── Plan ──────────────────────────────────────────
      plan: [],

      addToPlan: (location) =>
        set((state) => {
          if (state.plan.some((l) => l.id === location.id)) return state;
          return { plan: [...state.plan, location] };
        }),

      removeFromPlan: (id) =>
        set((state) => ({ plan: state.plan.filter((l) => l.id !== id) })),

      isInPlan: (id) => get().plan.some((l) => l.id === id),

      clearPlan: () => set({ plan: [] }),

      // ── Language ──────────────────────────────────────
      lang: "en",

      setLang: (lang) =>
        set((state) => ({
          lang,
          user: state.user ? { ...state.user, lang } : null,
        })),

      // ── Theme ─────────────────────────────────────────
      theme: "dark",

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      // ── UI ────────────────────────────────────────────
      authModalOpen: false,
      openAuthModal: () => set({ authModalOpen: true }),
      closeAuthModal: () => set({ authModalOpen: false }),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // ── Toasts ────────────────────────────────────────
      toasts: [],

      showToast: (message, icon, type = "success") => {
        const id = Date.now().toString();
        set((state) => ({ toasts: [...state.toasts, { id, message, icon, type }] }));
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
      },

      dismissToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      // ── User Reviews (local-first) ────────────────────
      userReviews: {},

      addUserReview: (locationId, review) =>
        set((state) => {
          const newReview: Review = {
            ...review,
            id: `usr-${Date.now()}`,
            locationId,
          };
          return {
            userReviews: {
              ...state.userReviews,
              [locationId]: [newReview, ...(state.userReviews[locationId] ?? [])],
            },
          };
        }),
    }),
    {
      name: "karvon-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        theme: state.theme,
        lang: state.lang,
        userReviews: state.userReviews,
      }),
      // Bumping this forces a one-time migration: browsers that already
      // persisted "uz" from before the default changed to English get
      // reset to "en" instead of being stuck on the old value forever.
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as { lang?: Lang };
        if (version < 1) state.lang = "en";
        return state;
      },
    }
  )
);

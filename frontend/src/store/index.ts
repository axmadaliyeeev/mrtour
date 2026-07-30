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
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  hasEnteredApp: boolean;
  enterAsGuest: () => void;
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
      authModalTab: "login",
      openAuthModal: (tab = "login") => set({ authModalOpen: true, authModalTab: tab }),
      closeAuthModal: () => set({ authModalOpen: false }),

      // Guests who pick "Continue as Guest" on the landing page shouldn't
      // be routed back to it on every subsequent visit — this flag (like
      // auth) is part of the persisted slice below, so it survives a
      // refresh the same way a logged-in session would.
      hasEnteredApp: false,
      enterAsGuest: () => set({ hasEnteredApp: true }),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // ── Toasts ────────────────────────────────────────
      toasts: [],

      showToast: (message, icon, type = "success") => {
        // A rapid run of clicks that each call showToast with the SAME
        // message (thumbs-up spam being the reported case) used to stack
        // an unbounded pile, since every call unconditionally pushed a
        // new entry with its own independent 3s timer. If an identical
        // message is already showing, just no-op instead of adding a
        // twin — the user already sees the feedback they need.
        const alreadyShowing = get().toasts.some((t) => t.message === message);
        if (alreadyShowing) return;

        // Date.now() alone collides when two toasts fire in the same
        // millisecond (e.g. two quick "added to plan" taps) — both would
        // share a key, so dismissing one via its timeout silently killed
        // both and React warned about duplicate keys. A random suffix
        // guarantees uniqueness without needing crypto.randomUUID (not
        // available in non-secure/older WebView contexts).
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        set((state) => {
          // Defensive cap: even with de-duping above, distinct messages
          // firing back-to-back (e.g. several different "added to plan"
          // taps) shouldn't be able to bury the screen — keep at most 3
          // visible, dropping the oldest first.
          const next = [...state.toasts, { id, message, icon, type }];
          return { toasts: next.length > 3 ? next.slice(next.length - 3) : next };
        });
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
            id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      name: "trova-v1",
      storage: createJSONStorage(() => localStorage),
      // hasEnteredApp is deliberately NOT persisted here — it used to be,
      // which meant clicking "Continue as Guest" just once permanently
      // skipped the landing page on every future visit to this browser,
      // even weeks later after closing it entirely. It should only skip
      // the landing for the rest of THIS session (so SPA navigation back
      // to "/" after entering doesn't re-show it), not forever — a fresh
      // page load/new visit is exactly when the landing is supposed to
      // greet the visitor.
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

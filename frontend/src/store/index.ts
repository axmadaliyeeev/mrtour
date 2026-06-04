import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Location } from "@/types";

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

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────
      user: null,
      isLoggedIn: false,

      login: (user) => set({ user, isLoggedIn: true }),

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

      // ── Theme ─────────────────────────────────────────
      theme: "dark",

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      // ── UI ────────────────────────────────────────────
      activeTab: "overview",

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "mrtour-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        theme: state.theme,
      }),
    }
  )
);

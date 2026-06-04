"use client";

import { useCallback, useState } from "react";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  authModalOpen: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  requireAuth: (callback: () => void) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export function useAuth(): UseAuthReturn {
  const { user, isLoggedIn, login, logout, updateUser } = useAppStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("mrtour-token") : null;

    if (!token) return;

    try {
      const me = await apiClient.get<User>("/auth/me");
      login(me);
    } catch {
      // Token invalid or expired — clear it silently
      localStorage.removeItem("mrtour-token");
      logout();
    }
  }, [login, logout]);

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isLoggedIn) {
        callback();
      } else {
        setAuthModalOpen(true);
      }
    },
    [isLoggedIn]
  );

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  return {
    user,
    isLoggedIn,
    authModalOpen,
    login,
    logout,
    updateUser,
    checkAuth,
    requireAuth,
    openAuthModal,
    closeAuthModal,
  };
}

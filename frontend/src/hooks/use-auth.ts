"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

interface UseAuthReturn {
  user:          User | null;
  isLoggedIn:    boolean;
  authModalOpen: boolean;
  login:         (user: User) => void;
  logout:        () => void;
  updateUser:    (data: Partial<User>) => void;
  checkAuth:     () => Promise<void>;
  requireAuth:   (callback: () => void) => void;
  openAuthModal: () => void;
  closeAuthModal:() => void;
}

export function useAuth(): UseAuthReturn {
  const {
    user, isLoggedIn, login, logout, updateUser,
    authModalOpen, openAuthModal, closeAuthModal,
  } = useAppStore();

  const checkAuth = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mrtour-token") : null;
    if (!token) return;
    try {
      const me = await apiClient.get<User>("/auth/me");
      login(me);
    } catch {
      localStorage.removeItem("mrtour-token");
      logout();
    }
  }, [login, logout]);

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isLoggedIn) callback();
      else openAuthModal();
    },
    [isLoggedIn, openAuthModal]
  );

  return {
    user, isLoggedIn, authModalOpen,
    login, logout, updateUser,
    checkAuth, requireAuth,
    openAuthModal, closeAuthModal,
  };
}

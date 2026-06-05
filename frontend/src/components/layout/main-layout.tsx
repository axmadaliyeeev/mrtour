"use client";

import { useEffect, useRef } from "react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { TopHeader } from "./top-header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isDesktop }                      = useBreakpoint();
  const { plan }                           = useAppStore();
  const { user, checkAuth, openAuthModal } = useAuth();
  const checkedRef                         = useRef(false);

  // Run only once per session — not on every re-render
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const headerProps = { user, planCount: plan.length, onSignIn: openAuthModal };

  if (isDesktop) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="ml-60 flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopHeader {...headerProps} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-[var(--background)]">
      <TopHeader {...headerProps} />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

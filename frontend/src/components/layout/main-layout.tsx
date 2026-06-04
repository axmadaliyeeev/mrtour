"use client";

import { useEffect } from "react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { TopHeader } from "./top-header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isDesktop } = useBreakpoint();
  const { activeTab, plan } = useAppStore();
  const { user, checkAuth, openAuthModal } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const headerProps = {
    activeTab,
    user,
    planCount: plan.length,
    onSignIn: openAuthModal,
  };

  if (isDesktop) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="ml-60 flex-1 flex flex-col min-h-screen">
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

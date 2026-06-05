import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopHeader } from "./TopHeader";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAuth } from "@/hooks/useAuth";

export function MainLayout() {
  const { isDesktop } = useBreakpoint();
  const { checkAuth } = useAuth();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    checkAuth();
  }, []); // eslint-disable-line

  if (isDesktop) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="ml-60 flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-[var(--background)]">
      <TopHeader />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

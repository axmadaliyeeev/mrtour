import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopHeader } from "./TopHeader";
import { Toaster } from "@/components/ui/Toaster";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main.scroll-main");
    if (!main) return;
    mainRef.current = main;
    const handler = () => setVisible(main.scrollTop > 320);
    main.addEventListener("scroll", handler, { passive: true });
    return () => main.removeEventListener("scroll", handler);
  }, [pathname]);

  const scrollUp = () => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 z-40 w-10 h-10 rounded-full",
        "bg-[var(--card)] border border-[var(--border)] shadow-lg",
        "flex items-center justify-center",
        "text-[var(--muted-foreground)] hover:text-indigo-400 hover:border-indigo-500/40",
        "transition-all duration-250 active:scale-90",
        "bottom-[76px] md:bottom-6",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}

export function MainLayout() {
  const { isDesktop } = useBreakpoint();
  const { checkAuth } = useAuth();
  const { pathname } = useLocation();
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
          <main key={pathname} className="scroll-main flex-1 overflow-y-auto animate-page-in">
            <Outlet />
          </main>
        </div>
        <Toaster />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[var(--background)]">
      <TopHeader />
      <main
        key={pathname}
        className="scroll-main flex-1 overflow-y-auto animate-page-in"
        style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Outlet />
      </main>
      <BottomNav />
      <Toaster />
      <ScrollToTop />
    </div>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { Bookmark, LogIn, ChevronRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAppStore } from "@/store";

const ROUTE_LABELS: Record<string, string> = {
  "/home": "Asosiy",
  "/locations": "Joylar",
  "/chat": "AI Yordamchi",
  "/services": "Xizmatlar",
  "/profile": "Profil",
};

export function TopHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDesktop } = useBreakpoint();
  const { user, plan, theme, toggleTheme, openAuthModal } = useAppStore();
  const planCount = plan.length;

  const label =
    ROUTE_LABELS[pathname] ??
    (pathname.startsWith("/locations/") ? "Joy tafsilotlari" : "");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 flex items-center px-4 gap-3",
        "bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]"
      )}
    >
      {/* Left: logo or breadcrumb */}
      {isDesktop ? (
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-[var(--muted-foreground)]">MRTOUR.UZ</span>
          {label && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]/50 shrink-0" />
              <span className="font-semibold text-[var(--foreground)] truncate">
                {label}
              </span>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/home")}
          className="flex-1 min-w-0 text-left"
        >
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[var(--foreground)]">MR</span>
            <span className="text-teal-500">TOUR</span>
            <span className="text-[var(--muted-foreground)] text-base font-normal">
              .UZ
            </span>
          </span>
        </button>
      )}

      {/* Right: controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--muted)] border border-[var(--border)] hover:border-teal-500/40 transition-all"
          aria-label={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
          )}
        </button>

        {/* Plan bookmark */}
        <button
          onClick={() => navigate("/profile")}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--muted)] border border-[var(--border)] hover:border-teal-500/40 transition-all"
          aria-label={`${planCount} joy rejada`}
        >
          <Bookmark
            className={cn(
              "w-4 h-4",
              planCount > 0 ? "text-teal-400 fill-teal-400/30" : "text-[var(--muted-foreground)]"
            )}
          />
          {planCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-teal-500 text-white leading-none">
              {planCount > 9 ? "9+" : planCount}
            </span>
          )}
        </button>

        {/* User avatar or login button */}
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow-md"
            aria-label="Profil"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors active:scale-95 shadow-md"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { Bookmark, LogIn, ChevronRight, Sun, Moon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export function TopHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDesktop } = useBreakpoint();
  const { user, plan, theme, toggleTheme, openAuthModal, setSearchOpen } = useAppStore();
  const { t } = useTranslation();
  const planCount = plan.length;

  const ROUTE_LABELS: Record<string, string> = {
    "/home":       t("nav", "home"),
    "/locations":  t("nav", "locations"),
    "/chat":       "Trova AI",
    "/services":   t("nav", "services"),
    "/profile":    t("nav", "profile"),
    "/uzbekistan": t("nav", "about"),
  };

  const label =
    ROUTE_LABELS[pathname] ??
    (pathname.startsWith("/locations/") ? t("nav", "locations") : "");

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center px-4 gap-3 glass bg-[var(--header-bg)] border-b border-[var(--border)]">

      {/* ── Left side ── */}
      {isDesktop ? (
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-[var(--muted-foreground)] text-xs font-semibold tracking-wider uppercase">
            trova
          </span>
          {label && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--border)] shrink-0" />
              <span key={label} className="font-semibold text-[var(--foreground)] truncate animate-fade-in">
                {label}
              </span>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/home")}
          className="flex items-center flex-1 min-w-0 active:opacity-70 transition-opacity"
        >
          <img src="/img/logo-l.svg" alt="trova" className="h-6 w-auto dark:hidden" />
          <img src="/img/logo-d.svg" alt="trova" className="h-6 w-auto hidden dark:block" />
        </button>
      )}

      {/* ── Right controls ── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Global search */}
        {isDesktop ? (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 h-8 px-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 text-[var(--muted-foreground)] transition-all active:scale-95"
            aria-label={t("locations", "search_placeholder")}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">{t("locations", "search_placeholder")}</span>
            <kbd className="text-[9px] font-semibold bg-[var(--card)] border border-[var(--border)] rounded px-1 py-px">
              Ctrl K
            </kbd>
          </button>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 transition-all active:scale-90"
            aria-label={t("locations", "search_placeholder")}
          >
            <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 transition-all active:scale-90"
          aria-label={theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          )}
        </button>

        {/* Plan bookmark */}
        <button
          onClick={() => navigate("/profile")}
          className="relative hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 transition-all active:scale-90"
          aria-label={`${planCount} ${t("profile", "plan_count_suffix")}`}
        >
          <Bookmark
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              planCount > 0 ? "text-indigo-500 fill-indigo-500/20" : "text-[var(--muted-foreground)]"
            )}
          />
          {planCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-bold bg-indigo-500 text-white leading-none shadow-sm">
              {planCount > 9 ? "9+" : planCount}
            </span>
          )}
        </button>

        {/* User avatar or login */}
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-transform shadow-md shadow-indigo-500/30 active:scale-95"
            aria-label={t("nav", "profile")}
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-all active:scale-95 shadow-md shadow-indigo-500/30 hover:-translate-y-px"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t("auth", "login")}</span>
          </button>
        )}
      </div>
    </header>
  );
}

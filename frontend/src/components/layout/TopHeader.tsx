import { useNavigate, useLocation } from "react-router-dom";
import { Bookmark, LogIn, ChevronRight, Sun, Moon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export function TopHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDesktop } = useBreakpoint();
  const { user, plan, theme, toggleTheme, openAuthModal } = useAppStore();
  const { t } = useTranslation();
  const planCount = plan.length;

  const ROUTE_LABELS: Record<string, string> = {
    "/home":      t("nav", "home"),
    "/locations": t("nav", "locations"),
    "/chat":      "AI Bek",
    "/services":  t("nav", "services"),
    "/profile":   t("nav", "profile"),
  };

  const label =
    ROUTE_LABELS[pathname] ??
    (pathname.startsWith("/locations/") ? t("detail", "practical_info") : "");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 flex items-center px-4 gap-3",
        "glass bg-[var(--header-bg)] border-b border-[var(--border)]"
      )}
    >
      {/* Left */}
      {isDesktop ? (
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-[var(--muted-foreground)] text-xs font-medium">
            MRTOUR
          </span>
          {label && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--border)] shrink-0" />
              <span className="font-semibold text-[var(--foreground)] truncate">
                {label}
              </span>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-[var(--foreground)]">MR</span>
            <span className="text-indigo-500">TOUR</span>
          </span>
        </button>
      )}

      {/* Right: controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 transition-all"
          aria-label={theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          )}
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-indigo-500/40 transition-all"
          aria-label={`${planCount} ${t("profile", "plan_count_suffix")}`}
        >
          <Bookmark
            className={cn(
              "w-3.5 h-3.5",
              planCount > 0
                ? "text-indigo-400 fill-indigo-400/30"
                : "text-[var(--muted-foreground)]"
            )}
          />
          {planCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold bg-indigo-500 text-white leading-none">
              {planCount > 9 ? "9+" : planCount}
            </span>
          )}
        </button>

        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-transform shadow-indigo-sm"
            aria-label={t("nav", "profile")}
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-all active:scale-95 shadow-indigo-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t("auth", "login")}</span>
          </button>
        )}
      </div>
    </header>
  );
}

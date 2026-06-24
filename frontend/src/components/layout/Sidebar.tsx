import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPin, Bot, LayoutGrid, User, Sun, Moon, ChevronRight, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 34 };

const NAV_TABS = [
  { route: "/home",      Icon: Home,       key: "home"      },
  { route: "/locations", Icon: MapPin,     key: "locations" },
  { route: "/services",  Icon: LayoutGrid, key: "services"  },
] as const;

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, plan, theme, toggleTheme, openAuthModal } = useAppStore();
  const { t } = useTranslation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 z-40 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] overflow-hidden">

      {/* ── Subtle top gradient glow ───────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/6 to-transparent pointer-events-none" />

      {/* ── Logo ───────────────────────────────────────── */}
      <div className="relative flex items-center gap-3 px-5 h-[68px] border-b border-[var(--sidebar-border)] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <MapPin className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight leading-none">
            <span className="text-[var(--foreground)]">MR</span>
            <span className="text-indigo-500">TOUR</span>
          </span>
          <p className="text-[9px] text-[var(--muted-foreground)] font-medium tracking-wider uppercase mt-0.5">
            Travel Guide
          </p>
        </div>
      </div>

      {/* ── Main navigation ────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">

        {NAV_TABS.map(({ route, Icon, key }) => {
          const active = pathname === route || (route !== "/home" && pathname.startsWith(route));
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={cn(
                "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group active:scale-[0.98]",
                active
                  ? "bg-indigo-500/12 text-indigo-500 shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {/* Left active bar — shared sliding indicator */}
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  transition={SPRING}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-indigo-500"
                />
              )}

              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                active
                  ? "bg-indigo-500/15 shadow-sm"
                  : "bg-[var(--muted)] group-hover:bg-[var(--card-hover)]"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-all",
                  active ? "text-indigo-500 scale-110" : "text-[var(--muted-foreground)]"
                )} />
              </div>

              <span className={cn(
                "text-sm font-medium transition-colors",
                active ? "font-semibold text-indigo-500" : ""
              )}>
                {t("nav", key)}
              </span>

              {/* Plan badge on profile nav */}
              {route === "/locations" && plan.length > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500/20 text-indigo-500 text-[9px] font-bold flex items-center justify-center border border-indigo-500/25">
                  {plan.length}
                </span>
              )}
            </button>
          );
        })}

        {/* ── Divider + AI Bek ───────────────────────── */}
        <div className="mt-2 pt-3 border-t border-[var(--sidebar-border)]">
          {(() => {
            const route = "/chat";
            const active = pathname === route || pathname.startsWith(route);
            return (
              <button
                onClick={() => navigate(route)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all relative active:scale-[0.98]",
                  active
                    ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/10"
                    : "hover:bg-indigo-500/6"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    transition={SPRING}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-indigo-500 rounded-r-full"
                  />
                )}
                <div className={cn(
                  "w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md transition-all",
                  active ? "shadow-indigo-500/50 scale-105" : "shadow-indigo-500/25 hover:scale-105"
                )}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "text-sm font-semibold leading-tight transition-colors",
                    active ? "text-indigo-500" : "text-indigo-400"
                  )}>
                    AI Bek
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] font-medium">
                    Sayohat yordamchisi
                  </p>
                </div>
                <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 font-bold border border-indigo-500/20">
                  AI
                </span>
              </button>
            );
          })()}
        </div>

        {/* ── Profile nav item ───────────────────────── */}
        <div className="mt-1">
          {(() => {
            const route = "/profile";
            const active = pathname === route;
            return (
              <button
                onClick={() => navigate(route)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group active:scale-[0.98]",
                  active
                    ? "bg-indigo-500/12 text-indigo-500"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    transition={SPRING}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-indigo-500"
                  />
                )}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                  active
                    ? "bg-indigo-500/15"
                    : "bg-[var(--muted)] group-hover:bg-[var(--card-hover)]"
                )}>
                  <User className={cn(
                    "w-4 h-4 transition-all",
                    active ? "text-indigo-500 scale-110" : "text-[var(--muted-foreground)]"
                  )} />
                </div>
                <span className={cn(
                  "text-sm transition-colors flex-1 text-left",
                  active ? "font-semibold text-indigo-500" : "font-medium"
                )}>
                  {t("nav", "profile")}
                </span>
                {plan.length > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {plan.length > 99 ? "99+" : plan.length}
                  </span>
                )}
              </button>
            );
          })()}
        </div>
      </nav>

      {/* ── Bottom: theme + user card ──────────────────── */}
      <div className="shrink-0 border-t border-[var(--sidebar-border)]">

        {/* Theme toggle */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--sidebar-border)]/60">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            {t("profile", "theme_label")}
          </span>
          <button
            onClick={toggleTheme}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors duration-300 active:scale-95",
              theme === "dark"
                ? "bg-indigo-500 shadow-md shadow-indigo-500/30"
                : "bg-[var(--muted)] border border-[var(--border)]"
            )}
            aria-label={theme === "dark" ? t("profile", "theme_light") : t("profile", "theme_dark")}
          >
            <span className={cn(
              "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300",
              theme === "dark" ? "left-5" : "left-0.5"
            )}>
              {theme === "dark"
                ? <Moon className="w-2.5 h-2.5 text-indigo-500" />
                : <Sun className="w-2.5 h-2.5 text-amber-400" />
              }
            </span>
          </button>
        </div>

        {/* User / guest card */}
        <div className="p-3">
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--muted)] transition-all group active:scale-[0.98]"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-indigo-500/30">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate leading-tight">
                  {user.name} {user.surname}
                </p>
                <p className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5">
                  {user.email}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/8 to-purple-500/5 border border-indigo-500/15">
              <p className="text-xs font-semibold text-[var(--foreground)] mb-0.5">
                {t("profile", "guest")}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)] mb-2.5 leading-snug">
                {t("profile", "sidebar_login_hint")}
              </p>
              <button
                onClick={openAuthModal}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors active:scale-[0.97]"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("auth", "login")}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

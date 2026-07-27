import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPin, Bot, LayoutGrid, User, ChevronRight, LogIn, Globe2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 34 };

// A soft S-curve instead of a flat rectangle — echoes the route-motif from
// the wordmark so "you are here" reads as a point on a path, not just a
// highlighted menu row.
function RouteIndicator({ layoutId }: { layoutId: string }) {
  return (
    <motion.svg
      layoutId={layoutId}
      transition={SPRING}
      className="absolute left-0 top-1/2 -translate-y-1/2"
      width="4" height="26" viewBox="0 0 4 26" fill="none"
    >
      <path
        d="M3.5 1C3.5 6 0.5 8 0.5 13C0.5 18 3.5 20 3.5 25"
        stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"
      />
    </motion.svg>
  );
}

const NAV_TABS = [
  { route: "/home",       Icon: Home,       key: "home"      },
  { route: "/locations",  Icon: MapPin,     key: "locations" },
  { route: "/saved",      Icon: Bookmark,   key: "saved"     },
  { route: "/uzbekistan", Icon: Globe2,     key: "about"     },
  { route: "/services",   Icon: LayoutGrid, key: "services"  },
] as const;

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, plan, openAuthModal } = useAppStore();
  const { t } = useTranslation();

  return (
    // border-r replaced with a barely-there shadow — a hard rule down the
    // full height of the screen next to a dense icon+label nav column is
    // exactly the CMS/admin-dashboard silhouette; a soft edge reads as a
    // floating panel instead.
    <aside className="glass fixed left-0 top-0 h-screen w-60 z-40 flex flex-col bg-[var(--sidebar-bg)] shadow-[1px_0_0_0_var(--sidebar-border)] overflow-hidden">

      {/* ── Subtle top gradient glow ───────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/6 to-transparent pointer-events-none" />

      {/* ── Logo — real brand mark (mark + wordmark in one image) instead
             of a generic MapPin icon standing in for it. Theme-matched
             variant (dark text for light bg, light text for dark bg).
             Dropped the "Travel Guide" tagline underneath — it was
             restating the obvious and added a line of dashboard-style
             chrome for nothing. ── */}
      <div className="relative flex items-center px-5 h-[72px] shrink-0">
        <img src="/img/logo-l.svg" alt="trova" className="h-7 w-auto dark:hidden" />
        <img src="/img/logo-d.svg" alt="trova" className="h-7 w-auto hidden dark:block" />
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
              {active && <RouteIndicator layoutId="sidebar-indicator" />}

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

              {/* Plan count badge — belongs on Saved Places now, not Locations */}
              {route === "/saved" && plan.length > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500/20 text-indigo-500 text-[9px] font-bold flex items-center justify-center border border-indigo-500/25">
                  {plan.length}
                </span>
              )}
            </button>
          );
        })}

        {/* ── Divider + Trova AI ───────────────────────── */}
        <div className="mt-3 pt-4 border-t border-[var(--sidebar-border)]/40">
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
                {active && <RouteIndicator layoutId="sidebar-indicator" />}
                <div className={cn(
                  "border-glow-spin w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 shadow-sm transition-all",
                  active ? "scale-105" : "hover:scale-105"
                )}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "text-sm font-semibold leading-tight transition-colors",
                    active ? "text-indigo-500" : "text-indigo-400"
                  )}>
                    Trova AI
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] font-medium">
                    Sayohat yordamchisi
                  </p>
                </div>
                <span className="glint shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-gold-500/15 text-shimmer-gold font-bold border border-gold-500/30">
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
                {active && <RouteIndicator layoutId="sidebar-indicator" />}
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
              </button>
            );
          })()}
        </div>
      </nav>

      {/* ── Bottom: user card ─────────────────────────────
          (theme toggle lives in the header now — it read as a
          stranded debug switch tucked at the bottom of the sidebar) */}
      <div className="shrink-0 shadow-[0_-1px_0_0_var(--sidebar-border)]">

        {/* User / guest card */}
        <div className="p-3">
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--muted)] transition-all group active:scale-[0.98]"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
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
                <LogIn className="w-3.5 h-3.5 text-gold-200" />
                {t("auth", "login")}
              </button>
            </div>
          )}
        </div>

        {/* Credit */}
        <p className="text-center text-[9px] text-[var(--muted-foreground)]/60 pb-2 tracking-wide">
          mrforce.uz tomonidan ishlab chiqildi
        </p>
      </div>
    </aside>
  );
}

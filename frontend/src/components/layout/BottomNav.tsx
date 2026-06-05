import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Bot, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import { useAppStore } from "@/store";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const planCount = useAppStore((s) => s.plan.length);

  function isActive(route: string) {
    if (route === "/home") return pathname === "/home";
    // exact match for top-level routes; also catch sub-routes for /locations
    if (route === "/locations") return pathname === "/locations" || pathname.startsWith("/locations/");
    return pathname === route || pathname.startsWith(route + "/");
  }

  const TABS = [
    { route: "/home",      Icon: Home,       label: t("nav", "home")      },
    { route: "/locations", Icon: MapPin,     label: t("nav", "locations") },
    { route: "/chat",      Icon: Bot,        label: "AI Bek",  isAI: true  },
    { route: "/services",  Icon: LayoutGrid, label: t("nav", "services")  },
    { route: "/profile",   Icon: User,       label: t("nav", "profile")   },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--nav-bg)] border-t border-[var(--border)] glass"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center h-[58px]">
        {TABS.map(({ route, Icon, label, ...rest }) => {
          const ai = "isAI" in rest && rest.isAI;
          const active = isActive(route);

          if (ai) {
            /* ── AI: inline, pill-styled, slightly elevated look ── */
            return (
              <button
                key={route}
                onClick={() => navigate(route)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-90"
                aria-label="AI Bek"
              >
                <div className={cn(
                  "flex items-center justify-center w-12 h-[34px] rounded-2xl transition-all duration-250",
                  "bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30",
                  active ? "scale-105 shadow-indigo-500/50" : "hover:scale-102"
                )}>
                  <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <span className={cn(
                  "text-[9px] font-bold leading-none transition-colors",
                  active ? "text-indigo-500" : "text-[var(--muted-foreground)]"
                )}>
                  AI Bek
                </span>
              </button>
            );
          }

          /* ── Regular tab ── */
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5",
                "transition-all duration-200 active:scale-90",
                "min-w-[44px]", // touch target
                active ? "opacity-100" : "opacity-50 hover:opacity-80"
              )}
            >
              {/* Active top line */}
              <span className={cn(
                "absolute top-0 h-0.5 rounded-b-full bg-indigo-500 transition-all duration-300",
                active ? "w-6 opacity-100" : "w-0 opacity-0"
              )} />

              {/* Icon + badge */}
              <div className="relative flex items-center justify-center w-6 h-6">
                <Icon className={cn(
                  "transition-all duration-250",
                  active ? "w-5 h-5 text-indigo-500 scale-110" : "w-5 h-5 text-[var(--foreground)]"
                )} />
                {route === "/profile" && planCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-[3px] rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {planCount > 9 ? "9+" : planCount}
                  </span>
                )}
              </div>

              <span className={cn(
                "text-[9px] font-medium leading-none transition-colors",
                active ? "text-indigo-500 font-semibold" : "text-[var(--foreground)]"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Bot, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const TABS = [
    { route: "/home",      Icon: Home,       label: t("nav", "home"),      isAI: false },
    { route: "/locations", Icon: MapPin,     label: t("nav", "locations"), isAI: false },
    { route: "/chat",      Icon: Bot,        label: "AI Bek",              isAI: true  },
    { route: "/services",  Icon: LayoutGrid, label: t("nav", "services"),  isAI: false },
    { route: "/profile",   Icon: User,       label: t("nav", "profile"),   isAI: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)] bg-[var(--nav-bg)]">
      <div className="flex items-end h-[60px] px-1 pb-1">
        {TABS.map(({ route, Icon, label, isAI }) => {
          const active = pathname === route || (route !== "/home" && pathname.startsWith(route));

          if (isAI) {
            return (
              <button
                key={route}
                onClick={() => navigate(route)}
                className="relative flex flex-col items-center flex-1 -translate-y-3 gap-0"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all duration-200",
                    active ? "scale-105 shadow-indigo-glow" : ""
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-semibold transition-colors",
                    active ? "text-indigo-400" : "text-[var(--muted-foreground)]"
                  )}
                >
                  AI Bek
                </span>
              </button>
            );
          }

          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 flex-1 pt-2 pb-1 transition-all duration-200",
                active ? "opacity-100" : "opacity-45 hover:opacity-70"
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-indigo-400" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  active ? "text-indigo-400 scale-110" : "text-[var(--foreground)]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-indigo-400" : "text-[var(--foreground)]"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Bot, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const TABS = [
    { route: "/home",      Icon: Home,       label: t("nav", "home") },
    { route: "/locations", Icon: MapPin,     label: t("nav", "locations") },
    { route: "/chat",      Icon: Bot,        label: t("nav", "ai"),      isAI: true },
    { route: "/services",  Icon: LayoutGrid, label: t("nav", "services") },
    { route: "/profile",   Icon: User,       label: t("nav", "profile") },
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
                className={cn(
                  "relative flex flex-col items-center gap-0.5 flex-1 pt-2 pb-1 transition-all duration-200",
                  active ? "opacity-100" : "opacity-55 hover:opacity-80"
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-indigo-400" />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 transition-all duration-200",
                    active ? "scale-110 shadow-indigo-glow" : "shadow-md shadow-indigo-500/30"
                  )}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors",
                    active ? "text-indigo-400" : "text-[var(--foreground)]"
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

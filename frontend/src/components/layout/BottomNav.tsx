import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Bot, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { route: "/home",      Icon: Home,       label: "Asosiy" },
  { route: "/locations", Icon: MapPin,     label: "Joylar" },
  { route: "/chat",      Icon: Bot,        label: "AI",     isAI: true },
  { route: "/services",  Icon: LayoutGrid, label: "Xizmat" },
  { route: "/profile",   Icon: User,       label: "Profil" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
                className="relative flex flex-col items-center flex-1 -translate-y-3.5"
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 transition-all duration-300",
                    active ? "scale-110 shadow-teal-glow" : "shadow-lg shadow-teal-500/40"
                  )}
                  style={{ width: 52, height: 52 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <span
                  className={cn(
                    "text-[10px] mt-0.5 font-semibold transition-colors",
                    active ? "text-teal-400" : "text-[var(--muted-foreground)]"
                  )}
                >
                  {label}
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
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-teal-400" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  active ? "text-teal-400 scale-110" : "text-[var(--foreground)]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-teal-400" : "text-[var(--foreground)]"
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

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
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
      <div className="flex items-end h-16 px-2">
        {TABS.map(({ route, Icon, label, isAI }) => {
          const active = pathname === route;
          if (isAI) return (
            <button key={route} onClick={() => navigate(route)}
              className="relative flex flex-col items-center flex-1 -translate-y-3">
              <span className={cn("flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 transition-all", active && "scale-110")}
                style={{ boxShadow: "0 4px 20px rgba(13,148,136,.5)" }}>
                <Icon className="w-6 h-6 text-white" />
              </span>
              <span className={cn("text-[10px] mt-1 font-medium", active ? "text-teal-400" : "text-[var(--muted-foreground)]")}>{label}</span>
            </button>
          );
          return (
            <button key={route} onClick={() => navigate(route)}
              className={cn("relative flex flex-col items-center gap-1 flex-1 py-2 transition-all", active ? "opacity-100" : "opacity-40")}>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-teal-400" />}
              <Icon className={cn("w-5 h-5", active ? "text-teal-400" : "text-[var(--foreground)]")} />
              <span className={cn("text-[10px] font-medium", active ? "text-teal-400" : "text-[var(--foreground)]")}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

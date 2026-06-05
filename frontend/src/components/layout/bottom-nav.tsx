"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, MapPin, Bot, LayoutGrid, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id:    string;
  route: string;
  icon:  LucideIcon;
  label: string;
  isAI?: boolean;
}

export const TABS: Tab[] = [
  { id: "home",      route: "/home",      icon: Home,       label: "Asosiy"  },
  { id: "locations", route: "/locations", icon: MapPin,     label: "Joylar"  },
  { id: "chat",      route: "/chat",      icon: Bot,        label: "AI",      isAI: true },
  { id: "services",  route: "/services",  icon: LayoutGrid, label: "Xizmat"  },
  { id: "profile",   route: "/profile",   icon: User,       label: "Profil"  },
];

export function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto",
      "border-t border-[var(--border)]",
      "bg-[var(--background)]/95 backdrop-blur-xl"
    )}>
      <div className="flex items-end h-16 px-2">
        {TABS.map((tab) => {
          const Icon     = tab.icon;
          const isActive = pathname === tab.route;

          if (tab.isAI) {
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.route)}
                className="relative flex flex-col items-center flex-1 -translate-y-3"
                aria-label={tab.label}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-teal-500 to-teal-600",
                    "transition-all duration-200",
                    isActive && "animate-pulse"
                  )}
                  style={{ boxShadow: "0 4px 20px rgba(13,148,136,0.5)" }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </span>
                <span className={cn(
                  "text-[10px] mt-1 font-medium transition-colors",
                  isActive ? "text-teal-400" : "text-[var(--muted-foreground)]"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.route)}
              className={cn(
                "relative flex flex-col items-center gap-1 flex-1 py-2",
                "transition-all duration-200",
                isActive ? "opacity-100" : "opacity-40 grayscale"
              )}
              aria-label={tab.label}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-teal-400 animate-fade-in" />
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-teal-400" : "text-[var(--foreground)]")} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-teal-400" : "text-[var(--foreground)]")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

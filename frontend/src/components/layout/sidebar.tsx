"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { TABS } from "./bottom-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const EMERGENCY = [
  { icon: "🚔", label: "Politsiya", number: "1003" },
  { icon: "🚑", label: "Tez yordam", number: "103" },
  { icon: "📞", label: "Turistik yordam", number: "1182" },
];

export function Sidebar() {
  const { user, activeTab, setActiveTab, plan } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-60 z-40",
        "flex flex-col",
        "bg-brand-card border-r border-brand-border",
        "animate-slide-in"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-[var(--border)] shrink-0">
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-[var(--foreground)]">MR</span>
          <span className="text-teal-500">TOUR</span>
          <span className="text-[var(--muted-foreground)] font-normal text-lg">.UZ</span>
        </span>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-brand-border shrink-0">
        {user ? (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center shrink-0",
                "w-10 h-10 rounded-full text-sm font-bold",
                "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
              )}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate text-foreground">
                {user.name} {user.surname}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.country}
              </p>
              {plan.length > 0 && (
                <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-teal-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                  {plan.length} joy rejada
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Mehmon</p>
              <p className="text-xs text-muted-foreground">Kirish qiling</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAI) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                  "bg-gradient-to-r from-teal-600/20 to-teal-500/10",
                  "border border-teal-500/30",
                  "hover:from-teal-600/30 hover:to-teal-500/20",
                  "transition-all duration-200 group",
                  isActive && "from-teal-600/30 to-teal-500/20 shadow-[0_0_16px_rgba(13,148,136,0.25)]"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center",
                    "w-8 h-8 rounded-full shrink-0",
                    "bg-gradient-to-br from-teal-500 to-teal-600",
                    isActive && "animate-pulse"
                  )}
                  style={{ boxShadow: "0 2px 12px rgba(13,148,136,0.4)" }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </span>
                <span className="text-sm font-semibold text-teal-400">
                  AI Yordamchi
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  isActive ? "text-teal-400" : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium">{tab.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + emergency */}
      <div className="px-4 py-4 border-t border-brand-border shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Favqulodda
          </p>
          {EMERGENCY.map((e) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className={cn(
                "flex items-center justify-between",
                "px-2 py-1 rounded-lg",
                "text-xs text-muted-foreground hover:text-foreground",
                "hover:bg-muted transition-colors"
              )}
            >
              <span>
                {e.icon} {e.label}
              </span>
              <span className="font-mono font-semibold text-teal-400/80">
                {e.number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

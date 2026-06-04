"use client";

import { Bookmark, LogIn, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { TABS } from "./bottom-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { User } from "@/types";

interface TopHeaderProps {
  activeTab: string;
  user: User | null;
  planCount: number;
  onSignIn: () => void;
}

const TAB_LABELS: Record<string, string> = Object.fromEntries(
  TABS.map((t) => [t.id, t.label])
);

export function TopHeader({ activeTab, user, planCount, onSignIn }: TopHeaderProps) {
  const { isDesktop } = useBreakpoint();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14",
        "flex items-center px-4 gap-3",
        "bg-brand-bg/95 backdrop-blur-xl",
        "border-b border-brand-border"
      )}
    >
      {/* ── Desktop: breadcrumb ─────────────────────────── */}
      {isDesktop ? (
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-muted-foreground">MRTOUR.UZ</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="font-semibold text-foreground capitalize truncate">
            {TAB_LABELS[activeTab] ?? activeTab}
          </span>
        </div>
      ) : (
        /* ── Mobile/Tablet: logo ─────────────────────────── */
        <div className="flex-1 min-w-0">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            MR<span className="text-teal-500">TOUR</span>
            <span className="text-muted-foreground text-base font-normal">.UZ</span>
          </span>
        </div>
      )}

      {/* ── Right actions (shared) ───────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />

        {/* Plan badge */}
        {planCount > 0 && (
          <button
            className={cn(
              "relative flex items-center justify-center",
              "w-9 h-9 rounded-full",
              "bg-muted hover:bg-accent",
              "border border-border",
              "transition-colors"
            )}
            aria-label={`${planCount} joy rejada`}
          >
            <Bookmark className="w-4 h-4 text-teal-400" />
            <span
              className={cn(
                "absolute -top-1 -right-1",
                "flex items-center justify-center",
                "w-4 h-4 rounded-full text-[10px] font-bold",
                "bg-teal-500 text-white"
              )}
            >
              {planCount > 9 ? "9+" : planCount}
            </span>
          </button>
        )}

        {/* Avatar or sign in */}
        {user ? (
          <button
            className={cn(
              "flex items-center justify-center shrink-0",
              "w-9 h-9 rounded-full",
              "bg-gradient-to-br from-teal-500 to-teal-600",
              "text-white text-sm font-bold",
              "hover:scale-105 transition-transform"
            )}
            aria-label="Profil"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className={cn(
              "flex items-center gap-1.5 px-3 h-8 rounded-full",
              "bg-teal-500 hover:bg-teal-600",
              "text-white text-xs font-semibold",
              "transition-colors active:scale-95"
            )}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bookmark, LogIn, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { User } from "@/types";

const ROUTE_LABELS: Record<string, string> = {
  "/home":      "Asosiy",
  "/locations": "Joylar",
  "/chat":      "AI Yordamchi",
  "/services":  "Xizmatlar",
  "/profile":   "Profil",
};

interface TopHeaderProps {
  user:      User | null;
  planCount: number;
  onSignIn:  () => void;
}

export function TopHeader({ user, planCount, onSignIn }: TopHeaderProps) {
  const { isDesktop } = useBreakpoint();
  const pathname      = usePathname();
  const router        = useRouter();

  return (
    <header className={cn(
      "sticky top-0 z-50 h-14 flex items-center px-4 gap-3",
      "bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]"
    )}>
      {isDesktop ? (
        <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <span className="text-[var(--muted-foreground)]">MRTOUR.UZ</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]/50 shrink-0" />
          <span className="font-semibold text-[var(--foreground)] truncate">
            {ROUTE_LABELS[pathname] ?? ""}
          </span>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[var(--foreground)]">MR</span>
            <span className="text-teal-500">TOUR</span>
            <span className="text-[var(--muted-foreground)] text-base font-normal">.UZ</span>
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />

        {planCount > 0 && (
          <button
            onClick={() => router.push("/profile")}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)] border border-[var(--border)] transition-colors"
            aria-label={`${planCount} joy rejada`}
          >
            <Bookmark className="w-4 h-4 text-teal-400" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-teal-500 text-white">
              {planCount > 9 ? "9+" : planCount}
            </span>
          </button>
        )}

        {user ? (
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-sm font-bold hover:scale-105 transition-transform"
            aria-label="Profil"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
}

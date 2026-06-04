"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-full bg-muted animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <div className={cn("relative group", className)}>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex items-center justify-center",
          "w-9 h-9 rounded-full",
          "bg-muted hover:bg-accent",
          "border border-border",
          "transition-all duration-300",
          "active:scale-90"
        )}
        aria-label={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
      >
        <span
          className={cn(
            "transition-all duration-500",
            isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
          )}
        >
          <Moon className="w-4 h-4 text-teal-400" />
        </span>
        <span
          className={cn(
            "transition-all duration-500",
            !isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute"
          )}
        >
          <Sun className="w-4 h-4 text-amber-400" />
        </span>
      </button>

      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
          "whitespace-nowrap rounded-md px-2 py-1",
          "bg-brand-card border border-brand-border",
          "text-xs text-foreground",
          "opacity-0 group-hover:opacity-100",
          "translate-y-1 group-hover:translate-y-0",
          "transition-all duration-200"
        )}
      >
        {isDark ? "Yorug' tema" : "Qorong'i tema"}
      </span>
    </div>
  );
}

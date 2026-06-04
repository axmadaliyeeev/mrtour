"use client";

import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: string;
  count?: number;
  className?: string;
}

export function FilterPill({
  label,
  active,
  onClick,
  icon,
  count,
  className,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5",
        "rounded-full border text-sm font-medium",
        "transition-all duration-200 active:scale-95 select-none",
        active
          ? [
              "bg-teal-500/15 border-teal-500/50 text-teal-400",
              "shadow-[0_0_12px_rgba(20,184,166,0.15)]",
            ]
          : [
              "bg-transparent border-border text-muted-foreground",
              "hover:border-teal-500/30 hover:text-foreground hover:bg-muted",
            ],
        className
      )}
    >
      {icon && <span className="leading-none">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center",
            "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold",
            active
              ? "bg-teal-500/30 text-teal-300"
              : "bg-muted text-muted-foreground"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

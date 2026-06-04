"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-16 px-6 text-center",
        "animate-fade-up",
        className
      )}
    >
      <span
        className="text-5xl mb-4 select-none"
        role="img"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium",
            "bg-teal-500 hover:bg-teal-600",
            "text-white transition-colors active:scale-95"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

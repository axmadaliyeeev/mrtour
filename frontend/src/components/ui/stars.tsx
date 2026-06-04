"use client";

import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

const SIZE_PX: Record<NonNullable<StarsProps["size"]>, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function Stars({
  rating,
  size = "md",
  showNumber = false,
  showCount = false,
  count,
  className,
}: StarsProps) {
  const px = SIZE_PX[size];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Reyting: ${rating} dan 5`}
    >
      <span
        className="inline-flex items-center gap-0.5 leading-none"
        style={{ fontSize: px }}
      >
        {Array.from({ length: full }, (_, i) => (
          <span key={`f${i}`} className="text-amber-400">
            ★
          </span>
        ))}
        {half && (
          <span
            key="half"
            className="relative inline-block text-gray-500"
          >
            ★
            <span
              className="absolute inset-0 overflow-hidden text-amber-400"
              style={{ width: "50%" }}
            >
              ★
            </span>
          </span>
        )}
        {Array.from({ length: empty }, (_, i) => (
          <span key={`e${i}`} className="text-gray-500/60">
            ☆
          </span>
        ))}
      </span>

      {showNumber && (
        <span
          className="text-muted-foreground font-medium tabular-nums"
          style={{ fontSize: px }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {showCount && count !== undefined && (
        <span
          className="text-muted-foreground/70"
          style={{ fontSize: px - 1 }}
        >
          ({formatCount(count)} sharh)
        </span>
      )}
    </span>
  );
}

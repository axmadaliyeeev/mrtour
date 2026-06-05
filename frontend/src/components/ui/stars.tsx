import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  size?: "sm" | "md";
  showNumber?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

const SIZE_PX: Record<NonNullable<StarsProps["size"]>, number> = {
  sm: 12,
  md: 14,
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
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
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Reyting: ${clamped.toFixed(1)} / 5`}
    >
      {/* Stars row */}
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
          <span className="relative inline-block text-[var(--muted-foreground)]">
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
          <span key={`e${i}`} className="text-[var(--muted-foreground)]/50">
            ★
          </span>
        ))}
      </span>

      {showNumber && (
        <span
          className="text-[var(--muted-foreground)] font-medium tabular-nums"
          style={{ fontSize: px }}
        >
          {clamped.toFixed(1)}
        </span>
      )}

      {showCount && count !== undefined && (
        <span
          className="text-[var(--muted-foreground)]/70"
          style={{ fontSize: px - 1 }}
        >
          ({formatCount(count)})
        </span>
      )}
    </span>
  );
}

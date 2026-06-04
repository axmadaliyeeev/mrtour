"use client";

import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  score: number;
  showScore?: boolean;
  className?: string;
}

type Level = "verified" | "suspicious" | "fake";

function getLevel(score: number): Level {
  if (score >= 70) return "verified";
  if (score >= 40) return "suspicious";
  return "fake";
}

const LEVEL_CONFIG: Record<
  Level,
  { icon: string; label: string; classes: string }
> = {
  verified: {
    icon: "✓",
    label: "Tasdiqlangan",
    classes:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  suspicious: {
    icon: "⚠",
    label: "Shubhali",
    classes: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  fake: {
    icon: "✗",
    label: "Soxta",
    classes: "text-red-400 bg-red-500/10 border-red-500/30",
  },
};

export function TrustBadge({ score, showScore = false, className }: TrustBadgeProps) {
  const level = getLevel(score);
  const { icon, label, classes } = LEVEL_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "rounded-full border text-xs font-medium",
        "select-none whitespace-nowrap",
        classes,
        className
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {showScore && (
        <span className="opacity-60">· {score}%</span>
      )}
    </span>
  );
}

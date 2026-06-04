"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  color,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Yuklanmoqda..."
      className={cn(
        "rounded-full animate-spin",
        "border-current border-t-transparent",
        SIZE_CLASSES[size],
        color ?? "text-teal-500",
        className
      )}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function InlineSpinner({ className }: { className?: string }) {
  return <LoadingSpinner size="sm" className={cn("inline-block", className)} />;
}

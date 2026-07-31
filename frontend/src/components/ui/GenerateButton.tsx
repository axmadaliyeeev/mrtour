import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Animated "generate" call-to-action.
 *
 * Adapted from a 21st.dev component. The original shipped its CSS in a
 * `<style jsx>` block, which is styled-jsx — a Next.js feature. This project
 * is Vite + Tailwind, where that tag renders as a literal <style> containing
 * unscoped CSS (or is stripped, depending on the pipeline), so the animation
 * silently wouldn't work. The rules now live in index.css under `.gen-btn`,
 * which also lets them use the app's own tokens instead of hardcoded hues.
 *
 * The letter-by-letter shimmer is kept, but driven by CSS `--i` custom
 * properties rather than 13 hand-written :nth-child delay rules — the
 * original capped out at 13 characters, silently dropping the stagger for
 * any longer label, and every label here is translated to six languages.
 */
export function GenerateButton({
  onClick,
  generating = false,
  disabled = false,
  labelIdle,
  labelActive,
  className,
}: {
  onClick?: () => void;
  generating?: boolean;
  disabled?: boolean;
  labelIdle: string;
  labelActive: string;
  className?: string;
}) {
  const label = generating ? labelActive : labelIdle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || generating}
      aria-busy={generating}
      className={cn(
        "gen-btn group relative inline-flex items-center justify-center gap-2.5",
        "rounded-2xl px-6 py-3.5 text-sm font-bold",
        "bg-indigo-500 text-white shadow-md shadow-indigo-500/25",
        "transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg",
        "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        className
      )}
    >
      <Sparkles
        className={cn("w-4 h-4 shrink-0", generating && "gen-btn-spark")}
        strokeWidth={2}
      />
      {/* Keyed on the label so switching idle→active restarts the stagger
          instead of letting half-finished letter animations carry over. */}
      <span key={label} className="inline-flex">
        {Array.from(label).map((ch, i) => (
          <span
            key={i}
            className={cn("gen-btn-letter", generating && "is-generating")}
            style={{ ["--i" as string]: String(i) }}
          >
            {/* A literal space collapses in an inline-block, which would run
                multi-word labels together. */}
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </button>
  );
}

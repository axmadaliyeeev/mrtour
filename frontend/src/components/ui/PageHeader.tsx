import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * One page-title treatment for every top-level screen.
 *
 * Before this, each page hand-rolled its own: Locations used text-2xl with
 * tracking-tight, while Services/SavedPlaces/Profile used text-xl without
 * it — so navigating between tabs visibly resized the heading, which reads
 * as unfinished rather than deliberate. The subtitle sizes drifted too
 * (text-xs everywhere but the scale it sat against kept changing).
 *
 * The staggered entrance is intentionally small (title, then subtitle ~60ms
 * later) — enough to feel like the page composes itself, not so much that
 * it delays reading.
 */
export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: React.ReactNode;
  /** Optional right-aligned element (count pill, filter button, etc). */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 pt-5 pb-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-[13px] text-[var(--muted-foreground)] mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            {action}
          </motion.div>
        )}
      </div>
    </div>
  );
}

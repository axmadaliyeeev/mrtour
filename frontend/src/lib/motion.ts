import type { Variants } from "framer-motion";

/**
 * Shared entrance motion, so every list/grid in the app enters the same way
 * instead of each page inventing its own timing. Landing.tsx had these
 * defined locally; the rest of the app had either bare CSS `animate-fade-up`
 * with hand-tuned inline `animationDelay` math, or nothing at all.
 *
 * The easing is the same [0.16, 1, 0.3, 1] curve already used by the page
 * transition and modal entrances — a fast start that settles gently, which
 * reads as responsive rather than floaty.
 */

/** Parent: staggers its children. Pair with `staggerItem` on each child. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Child of `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Standalone fade-up for a single element (no parent stagger). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Reveal-on-scroll props for a stagger parent. `once: true` matches the
 * existing useInView hook's behaviour (it disconnects after firing) — content
 * that re-animates every time it scrolls back into view is distracting.
 */
export const revealOnScroll = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.15 },
} as const;

/** Same, but for content already on screen at mount (above the fold). */
export const revealOnMount = {
  initial: "hidden",
  animate: "show",
} as const;

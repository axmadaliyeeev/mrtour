import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * LCP hero images that need `fetchpriority="high"`. React 18.3 (what this
 * app runs) only types the camelCase `fetchPriority` prop, which lands in
 * React 19 — the lowercase DOM attribute the browser actually needs works
 * fine at runtime today, but disagrees with the type defs. Previously each
 * page duplicated its own `@ts-expect-error` for this; centralizing it here
 * means a future React 19 upgrade only requires removing it in one place.
 */
export function PriorityImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // @ts-expect-error — intentionally lowercase for React 18's actual runtime support, see file comment
  return <img fetchpriority="high" {...props} />;
}

export function PriorityMotionImg(props: HTMLMotionProps<"img">) {
  // @ts-expect-error — intentionally lowercase for React 18's actual runtime support, see file comment
  return <motion.img fetchpriority="high" {...props} />;
}

"use client";

import { useState, useEffect } from "react";

interface Breakpoint {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

function getBreakpoint(width: number): Breakpoint {
  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width <= 1100,
    isDesktop: width > 1100,
  };
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth)
      : { width: 1200, isMobile: false, isTablet: false, isDesktop: true }
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => setBp(getBreakpoint(window.innerWidth));

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
}

import { useState, useEffect } from "react";

interface Breakpoint {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setBp({
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
        isDesktop: w >= 1024,
      });
    }
    update();
    // Debounced — an undebounced listener re-renders every consumer of
    // this hook on every intermediate frame of a window drag, not just
    // once it settles.
    let timer: ReturnType<typeof setTimeout> | undefined;
    function onResize() {
      clearTimeout(timer);
      timer = setTimeout(update, 120);
    }
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return bp;
}

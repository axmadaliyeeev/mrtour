import { useEffect } from "react";
import { useTour, TOUR_IDS } from "@/components/ui/Tour";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

/**
 * Loads the tour's steps and decides when it should run.
 *
 * Desktop only, deliberately: every step points at a sidebar item, and the
 * sidebar doesn't exist below the desktop breakpoint. Pointing a spotlight at
 * an element that isn't rendered would dim the screen around nothing.
 */
export function TourRunner() {
  const { setSteps, startTour } = useTour();
  const { isDesktop } = useBreakpoint();
  const { t } = useTranslation();
  const tourSeen = useAppStore((s) => s.tourSeen);

  useEffect(() => {
    setSteps([
      { selectorId: TOUR_IDS.AI,        position: "right", title: t("tour", "ai_title"),      body: t("tour", "ai_body") },
      { selectorId: TOUR_IDS.LOCATIONS, position: "right", title: t("tour", "loc_title"),     body: t("tour", "loc_body") },
      { selectorId: TOUR_IDS.SAVED,     position: "right", title: t("tour", "saved_title"),   body: t("tour", "saved_body") },
      { selectorId: TOUR_IDS.PROFILE,   position: "right", title: t("tour", "profile_title"), body: t("tour", "profile_body") },
    ]);
  }, [setSteps, t]);

  useEffect(() => {
    if (tourSeen || !isDesktop) return;
    // One frame is not enough on a cold load — the sidebar mounts with the
    // layout, but its final geometry settles after fonts and the logo image
    // resolve. Starting too early spotlights a box that then moves.
    const id = setTimeout(startTour, 900);
    return () => clearTimeout(id);
  }, [tourSeen, isDesktop, startTour]);

  return null;
}

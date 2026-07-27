import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, MapPin, Bot, Sparkles, BookmarkX } from "lucide-react";
import { useAppStore } from "@/store";
import { syncRemoveFromPlan } from "@/lib/plan-sync";
import { useTranslation } from "@/i18n";
import { Stars } from "@/components/ui/stars";
import type { Location } from "@/types";

// A dedicated home for "Add to Plan" — the header bookmark icon used to
// route to Profile, which read as unrelated to bookmarking a place. This
// page groups whatever's saved by city so a multi-city trip reads as a
// plan, not just an undifferentiated list.
export default function SavedPlaces() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { plan, removeFromPlan } = useAppStore();

  const byCity = useMemo(() => {
    const groups = new Map<string, Location[]>();
    for (const loc of plan) {
      const list = groups.get(loc.city) ?? [];
      list.push(loc);
      groups.set(loc.city, list);
    }
    return [...groups.entries()];
  }, [plan]);

  const total = plan.reduce((sum, l) => sum + (l.priceUSD ?? 0), 0);

  function remove(id: string) {
    removeFromPlan(id);
    syncRemoveFromPlan(id);
  }

  if (plan.length === 0) {
    return (
      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-0.5">
          {t("saved", "title")}
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mb-6">{t("saved", "subtitle")}</p>

        <div className="flex flex-col items-center text-center gap-3 py-16 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-indigo-500/60" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{t("saved", "empty_title")}</p>
          <p className="text-xs text-[var(--muted-foreground)] max-w-xs">{t("saved", "empty_desc")}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigate("/locations")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors active:scale-[0.97]"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t("saved", "explore_btn")}
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold hover:border-indigo-500/40 transition-all active:scale-[0.97]"
            >
              <Bot className="w-3.5 h-3.5" />
              {t("saved", "ai_btn")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-extrabold text-[var(--foreground)]">{t("saved", "title")}</h1>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          {plan.length}
        </span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mb-4">
        {byCity.length} {t("saved", "cities_suffix")} · {total === 0 ? t("detail", "free") : `~$${total}`}
      </p>

      <button
        onClick={() => navigate("/chat")}
        className="w-full flex items-center gap-2.5 p-3 mb-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm active:scale-[0.98] transition-transform"
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold flex-1 text-left">{t("saved", "ai_banner")}</span>
      </button>

      <div className="space-y-6">
        {byCity.map(([city, locs]) => (
          <div key={city}>
            <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wide mb-2">
              <MapPin className="w-3 h-3 text-indigo-500" />
              {city}
            </p>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {locs.map((loc) => (
                  <motion.div
                    key={loc.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] group"
                  >
                    <img
                      src={loc.img}
                      alt={loc.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => navigate(`/locations/${loc.id}`)}
                    />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/locations/${loc.id}`)}
                    >
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">{loc.name}</p>
                      <Stars rating={loc.rating} size="sm" showNumber />
                    </div>
                    <button
                      onClick={() => remove(loc.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                      aria-label={t("detail", "remove_plan")}
                    >
                      <BookmarkX className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

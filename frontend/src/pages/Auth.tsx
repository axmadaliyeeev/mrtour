import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginTab, RegisterTab } from "@/components/auth/AuthForms";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

import registanImg from "@/data/registan.jpg";
import ichanQalaImg from "@/data/ichan-qala.jpg";
import chimganImg from "@/data/chimgan-toglari.jpeg";
import chorsuImg from "@/data/chorsu-rinok.jpg";

/**
 * Full-page sign in / sign up, adapted from a 21st.dev split-screen layout.
 *
 * Substantive departures from the source, all forced by what this app
 * actually is:
 *   • The original's whole left panel advertised an image generator, with
 *     stock artwork and "/imagine" prompt captions. Replaced with the real
 *     location photography already in this repo — showing a travel app's
 *     sign-up next to AI art someone else generated would be a lie about
 *     the product.
 *   • Its "Sign up with Google / Apple" pair is gone. Social sign-in was
 *     deliberately replaced with emailed verification codes; rendering those
 *     buttons would promise an auth method that does not exist here.
 *   • Its inputs were an uncontrolled demo that wiped a hardcoded value on
 *     first focus. The real forms are imported from AuthForms, so this page
 *     and the modal share one implementation of the code-verification and
 *     password-reset flows rather than two that can drift.
 */

const SHOWCASE = [
  { img: registanImg,  key: "shot_registan"  },
  { img: ichanQalaImg, key: "shot_ichanqala" },
  { img: chimganImg,   key: "shot_chimgan"   },
  { img: chorsuImg,    key: "shot_chorsu"    },
] as const;

export default function Auth() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  // The route itself picks the tab, so /signup and /login are each a real,
  // shareable address rather than one page with hidden internal state.
  const [tab, setTab] = useState<"login" | "register">(
    pathname === "/signup" ? "register" : "login"
  );
  const [active, setActive] = useState(0);
  const [showcasePaused, setShowcasePaused] = useState(false);

  useEffect(() => {
    setTab(pathname === "/signup" ? "register" : "login");
  }, [pathname]);

  // Someone who is already signed in has no business on this page.
  useEffect(() => {
    if (isLoggedIn) navigate("/home", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Respects both: someone hovering to actually read a caption
    // shouldn't have it swapped out from under them, and someone who
    // asked their OS to reduce motion shouldn't get an auto-advancing
    // slideshow at all (the crossfade/scale transitions on each panel
    // aren't covered by the CSS reduced-motion rule since they're driven
    // by framer-motion, not a CSS animation/transition).
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (showcasePaused || reduceMotion) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % SHOWCASE.length), 5000);
    return () => window.clearInterval(id);
  }, [showcasePaused]);

  function done() {
    navigate("/home", { replace: true });
  }

  return (
    <div className="app-bg min-h-dvh p-3">
      <div className="grid min-h-[calc(100dvh-1.5rem)] gap-4 lg:grid-cols-[0.95fr_1.05fr]">

        {/* ── Showcase (desktop only) ────────────────────────────
            Hidden below lg rather than stacked: on a phone it would push
            the actual form a full screen down, turning sign-in into a
            scroll hunt. */}
        <div
          onMouseEnter={() => setShowcasePaused(true)}
          onMouseLeave={() => setShowcasePaused(false)}
          className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-3xl bg-black p-10 text-white"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={SHOWCASE[active].img}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />

          <div className="relative">
            <img src="/img/logo-d.svg" alt="trova" className="h-7 w-auto" />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-2xl font-extrabold tracking-tight leading-tight max-w-sm">
                  {t("auth", SHOWCASE[active].key)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-2">
              {SHOWCASE.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={t("auth", s.key)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === active ? "w-10 bg-white" : "w-4 bg-white/35 hover:bg-white/55"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-10">
          <div className="w-full max-w-sm">
            <button
              onClick={() => navigate("/")}
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("auth", "back_home")}
            </button>

            {/* Logo repeats here for the mobile layout, where the showcase
                panel that carries it is hidden. */}
            <div className="lg:hidden mb-6">
              <img src="/img/logo-l.svg" alt="trova" className="h-7 w-auto dark:hidden" />
              <img src="/img/logo-d.svg" alt="trova" className="h-7 w-auto hidden dark:block" />
            </div>

            <div className="flex rounded-xl bg-[var(--muted)] p-1 mb-6 gap-1">
              {(["login", "register"] as const).map((key) => {
                const isActive = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => navigate(key === "login" ? "/login" : "/signup", { replace: true })}
                    className={cn(
                      "relative flex-1 py-2 rounded-lg text-sm font-semibold transition-colors",
                      isActive ? "text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="auth-page-pill"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        className="absolute inset-0 rounded-lg bg-indigo-500 shadow-sm"
                      />
                    )}
                    <span className="relative">
                      {key === "login" ? t("auth", "login") : t("auth", "register")}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* onClose means "you're done here" to both hosts; the modal
                    closes itself, this page navigates into the app. */}
                {tab === "login" ? <LoginTab onClose={done} /> : <RegisterTab onClose={done} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

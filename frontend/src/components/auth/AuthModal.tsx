import { useState, useRef, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { GoogleLogin } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff, ChevronRight, PartyPopper, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { mergePlanOnLogin } from "@/lib/plan-sync";
import { useTranslation } from "@/i18n";
import type { Lang } from "@/i18n";
import type { User } from "@/types";
import { CountrySelect } from "./CountrySelect";

// 4-tier heuristic (length + character-class variety) — not trying to be
// a real entropy calculator, just enough signal to nudge users away from
// "password1" without being preachy about it.
function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

// A timed-out/network-level failure (no response at all — most often a
// free-tier backend cold-booting) reads very differently to a user than a
// real validation error, so it gets its own message instead of the generic
// fallback text.
function extractAuthError(err: unknown, fallback: string, wakingUp: string): string {
  const e = err as { code?: string; response?: { data?: { message?: string } } };
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.code === "ECONNABORTED" || !e?.response) return wakingUp;
  return fallback;
}

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek"   },
  { code: "ru", label: "Русский"  },
  { code: "en", label: "English"  },
  { code: "zh", label: "中文"     },
  { code: "de", label: "Deutsch"  },
  { code: "fr", label: "Français" },
];

// ── Social auth ──────────────────────────────────────────────────────────────
// Google is now real (Google Identity Services issues an ID token
// client-side; we POST it to /api/auth/google, which verifies it and
// returns the same access/refresh token pair as email/password login).
// Apple still needs a paid Apple Developer enrollment this environment
// doesn't have and can't fabricate — wiring it to a fake success would
// be actively misleading, so it stays an honest "not connected yet"
// placeholder until real credentials exist.
function SocialAuthButtons({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { login, showToast } = useAppStore();
  const [googleLoading, setGoogleLoading] = useState(false);

  function appleNotYetConnected() {
    showToast(t("auth", "social_soon"), undefined, "info");
  }

  async function handleGoogleSuccess(idToken: string) {
    setGoogleLoading(true);
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/google", { idToken }, { timeout: 45_000 }
      );
      localStorage.setItem("trova-token", res.accessToken);
      login(res.user);
      mergePlanOnLogin().catch(() => {});
      onClose();
    } catch {
      showToast(t("auth", "err_google"), undefined, "error");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-2 mb-4">
      {/* Google's own widget can't be reskinned to our exact button
          markup (custom SVG + copy) — "outline"/"pill" is the closest
          built-in look to the rest of this form's bordered buttons. A
          thin loading overlay covers it while the backend round-trip
          for handleGoogleSuccess is in flight, since the widget itself
          has no built-in loading state once its own popup closes. */}
      <div className="relative flex justify-center [&>div]:w-full">
        <GoogleLogin
          onSuccess={(cred) => cred.credential && handleGoogleSuccess(cred.credential)}
          onError={() => showToast(t("auth", "err_google"), undefined, "error")}
          theme="outline"
          shape="pill"
          size="large"
          width="336"
        />
        {googleLoading && (
          <div className="absolute inset-0 rounded-full bg-[var(--card)]/80 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={appleNotYetConnected}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--muted)] transition-colors active:scale-[0.98]"
      >
        <svg width="15" height="15" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
        {t("auth", "continue_apple")}
      </button>
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide">{t("auth", "or_email")}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
    </div>
  );
}

// ── Shared input ──────────────────────────────────────────────────────────────
function Field({
  label, error, type = "text", value, onChange, placeholder, autoComplete, required,
}: {
  label: string; error?: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl border bg-[var(--input-bg)] text-[var(--foreground)] text-sm",
            "placeholder:text-[var(--muted-foreground)] outline-none transition-all",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            error ? "border-red-400" : "border-[var(--input-border)]"
          )}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Password strength meter ────────────────────────────────────────────────
function PasswordStrengthMeter({ password, t }: { password: string; t: ReturnType<typeof useTranslation>["t"] }) {
  if (!password) return null;
  const score = passwordStrength(password);
  const labels = [t("auth", "pw_weak"), t("auth", "pw_weak"), t("auth", "pw_medium"), t("auth", "pw_strong")];
  const colors = ["bg-red-400", "bg-red-400", "bg-gold-500", "bg-indigo-500"];
  return (
    <div className="flex items-center gap-2 -mt-1">
      <div className="flex-1 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? colors[score] : "bg-[var(--border)]")} />
        ))}
      </div>
      <span className={cn(
        "text-[10px] font-semibold shrink-0",
        score >= 3 ? "text-indigo-400" : score === 2 ? "text-gold-600" : "text-red-400"
      )}>
        {labels[score]}
      </span>
    </div>
  );
}

// ── Login tab ─────────────────────────────────────────────────────────────────
function LoginTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t } = useTranslation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (!password)                         e.password = t("auth", "err_password_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      // Longer timeout: a free-tier host that's spun down from inactivity
      // needs 30-60s to cold-boot the whole process, not just the DB.
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/login", { email: email.trim().toLowerCase(), password }, { timeout: 45_000 }
      );
      localStorage.setItem("trova-token", res.accessToken);
      login(res.user);
      mergePlanOnLogin().catch(() => {});
      onClose();
    } catch (err: unknown) {
      setApiError(extractAuthError(err, t("auth", "err_login"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <SocialAuthButtons onClose={onClose} />
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label={t("auth", "email")} type="email" value={email} onChange={setEmail}
        placeholder={t("auth", "email_placeholder")} autoComplete="email" error={errors.email} />
      <Field label={t("auth", "password")} type="password" value={password} onChange={setPassword}
        placeholder={t("auth", "password_placeholder")} autoComplete="current-password" error={errors.password} />

      {apiError && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}
      <button type="submit" disabled={loading}
        className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
          loading ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md")}>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? t("auth", "loading_login") : t("auth", "login_btn")}
      </button>
    </form>
    </>
  );
}

// ── Register tab ──────────────────────────────────────────────────────────────
function RegisterTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t } = useTranslation();
  const [step, setStep]         = useState(1);
  const [selectedLang, setSelectedLang] = useState<Lang>("uz");
  const [name, setName]         = useState("");
  const [surname, setSurname]   = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry]   = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [doneUser, setDoneUser] = useState("");

  const STEPS = [t("auth", "step_lang"), t("auth", "step_info"), t("auth", "step_done")];

  function computeErrors() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)            e.name     = t("auth", "err_name_short");
    if (surname.trim().length < 2)         e.surname  = t("auth", "err_surname_short");
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (password.length < 8)               e.password = t("auth", "err_password_short");
    return e;
  }

  // Live validity for the submit-button gate — recomputed on every
  // keystroke but only actually SHOWN (via `errors`) once the user has
  // tried to submit once, so it doesn't flag empty required fields
  // as "errors" before they've had a chance to type anything.
  const liveErrors = useMemo(computeErrors, [name, surname, email, password]);
  const isValid = Object.keys(liveErrors).length === 0;
  const [attempted, setAttempted] = useState(false);

  // Once the user has tried to submit at least once, keep error messages
  // live as they correct each field — re-validating silently before that
  // point would flag untouched required fields as "wrong" the instant
  // the form opens, which reads as the form yelling at you before you've
  // done anything.
  useEffect(() => {
    if (attempted) setErrors(liveErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, name, surname, email, password]);

  function validate() {
    setAttempted(true);
    setErrors(liveErrors);
    return Object.keys(liveErrors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/register",
        { name: name.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password, country, lang: selectedLang },
        { timeout: 45_000 }
      );
      localStorage.setItem("trova-token", res.accessToken);
      setDoneUser(res.user.name);
      login(res.user);
      mergePlanOnLogin().catch(() => {});
      setStep(3);
    } catch (err: unknown) {
      setApiError(extractAuthError(err, t("auth", "err_register"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1">
            <div className={cn("w-full h-1 rounded-full transition-all duration-500",
              i + 1 < step ? "bg-indigo-500" : i + 1 === step ? "bg-indigo-400" : "bg-[var(--border)]")} />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[var(--muted-foreground)] text-center mb-4">{STEPS[step - 1]}</p>

      <AnimatePresence mode="wait" initial={false}>
      {/* Step 1 — Language */}
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-sm text-center text-[var(--foreground)] font-medium">{t("auth", "lang_question")}</p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button key={l.code} type="button" onClick={() => setSelectedLang(l.code)}
                className={cn("flex items-center justify-center px-3 py-3 rounded-xl border text-sm font-medium transition-all min-h-[44px]",
                  selectedLang === l.code
                    ? "bg-indigo-500 border-indigo-500 text-white font-semibold shadow-sm"
                    : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/20")}>
                {l.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors active:scale-[0.98]">
            {t("auth", "continue")} <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 2 — Form */}
      {step === 2 && (
        <motion.form
          key="step2"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("auth", "name")} value={name} onChange={setName} required
              placeholder={t("auth", "name_placeholder")} autoComplete="given-name" error={errors.name} />
            <Field label={t("auth", "surname")} value={surname} onChange={setSurname} required
              placeholder={t("auth", "surname_placeholder")} autoComplete="family-name" error={errors.surname} />
          </div>
          <Field label={t("auth", "email")} type="email" value={email} onChange={setEmail} required
            placeholder={t("auth", "email_placeholder")} autoComplete="email" error={errors.email} />
          <div className="space-y-1.5">
            <Field label={t("auth", "password")} type="password" value={password} onChange={setPassword} required
              placeholder={t("auth", "new_password_placeholder")} autoComplete="new-password" error={errors.password} />
            <PasswordStrengthMeter password={password} t={t} />
          </div>
          <CountrySelect
            value={country}
            onChange={setCountry}
            label={t("auth", "country")}
            placeholder={t("auth", "country_placeholder")}
            searchPlaceholder={t("auth", "country_search")}
            skipLabel={t("auth", "country_clear")}
          />

          {attempted && !isValid && (
            <p className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {t("auth", "form_errors_summary")}
            </p>
          )}
          {apiError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--muted)] transition-colors">
              {t("auth", "back")}
            </button>
            <button type="submit" disabled={loading || (attempted && !isValid)}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                loading || (attempted && !isValid) ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white")}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t("auth", "loading_register") : t("auth", "register_btn")}
            </button>
          </div>
        </motion.form>
      )}

      {/* Step 3 — Success */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="text-center py-4 space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <PartyPopper className="w-7 h-7 text-indigo-500" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">{t("auth", "success_title")}, {doneUser}!</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{t("auth", "success_desc")}</p>
          </div>
          <div className="space-y-1.5 text-left">
            {[
              t("auth", "success_feature1"),
              t("auth", "success_feature2"),
              t("auth", "success_feature3"),
            ].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-[var(--foreground)]/80">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                {item}
              </p>
            ))}
          </div>
          <button onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors">
            {t("auth", "start")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal } = useAppStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const tabResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (tabResetTimer.current) clearTimeout(tabResetTimer.current); }, []);

  // Whichever tab the caller asked for (openAuthModal("register") from
  // the landing page's "Get Started" CTA, vs the plain "Sign In" link)
  // becomes the tab shown when the modal opens.
  useEffect(() => {
    if (authModalOpen) setActiveTab(authModalTab);
  }, [authModalOpen, authModalTab]);

  function handleClose() {
    closeAuthModal();
    if (tabResetTimer.current) clearTimeout(tabResetTimer.current);
    tabResetTimer.current = setTimeout(() => setActiveTab("login"), 300);
  }

  return (
    <Dialog.Root open={authModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <AnimatePresence>
        {authModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                // Darker scrim + a real blur radius (not backdrop-blur-sm's
                // 4px) — the page header behind was faintly legible through
                // the old weak blur, which read as "doubled/overlapping
                // text" once the modal's own header sat near the same spot.
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xl"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              {/* Mobile: full-width bottom sheet anchored to the screen
                  edge (rounded top corners only) instead of a small
                  centered card with large dark margins either side.
                  Desktop keeps the centered card. */}
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center outline-none">
                <motion.div
                  // Calm tween in/out (no elastic/spring overshoot) — faster
                  // out than in, per the "modal entrance" motion spec.
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 40, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
                  // Level 2: a neutral surface off the green ramp entirely,
                  // so the modal never reads as "the page, just blurred".
                  className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border border-[var(--modal-border)] bg-[var(--modal)] shadow-[var(--shadow-modal)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:p-5 sm:m-4 max-h-[90vh] overflow-y-auto"
                >
                  {/* Grab handle — sheet-only affordance, hidden on the
                      desktop centered-card layout. */}
                  <div className="sm:hidden w-9 h-1 rounded-full bg-[var(--border)] mx-auto mb-4" />

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <img src="/img/logo-l.svg" alt="trova" className="h-5 w-auto dark:hidden" />
                      <img src="/img/logo-d.svg" alt="trova" className="h-5 w-auto hidden dark:block" />
                    </div>
                    <Dialog.Close asChild>
                      <button className="w-11 h-11 rounded-full flex items-center justify-center transition-colors -mr-2" aria-label="Close">
                        <span className="w-7 h-7 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center transition-colors">
                          <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                        </span>
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex rounded-xl bg-[var(--muted)] p-1 mb-5 gap-1">
                    {(["login", "register"] as const).map((tab) => {
                      const active = activeTab === tab;
                      return (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                          className={cn("relative flex-1 py-2 rounded-lg text-sm font-semibold transition-colors",
                            active ? "text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}>
                          {active && (
                            <motion.span
                              layoutId="auth-tab-pill"
                              transition={{ type: "spring", stiffness: 500, damping: 40 }}
                              className="absolute inset-0 rounded-lg bg-indigo-500 shadow-sm"
                            />
                          )}
                          <span className="relative">{tab === "login" ? t("auth", "login") : t("auth", "register")}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeTab === "login" ? <LoginTab onClose={handleClose} /> : <RegisterTab onClose={handleClose} />}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * Auth form internals, shared by two hosts: the AuthModal (used for in-app
 * sign-in prompts, where a modal preserves whatever the visitor was doing)
 * and the standalone /login and /signup pages. Extracted so the two can
 * never drift apart — the verification-code and password-reset flows are
 * intricate enough that a second copy would be a liability.
 */
﻿import { useState, useRef, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff, ChevronRight, PartyPopper, CheckCircle2, AlertCircle, Loader2, MailCheck, KeyRound } from "lucide-react";
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

// ── Verification code entry ──────────────────────────────────────────────────
// Six separate boxes rather than one text field: it makes the expected
// length obvious without instructions, and lets paste-from-email fill all
// six at once (handled in onChange below).
function CodeInput({
  value,
  onChange,
  disabled,
  onComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onComplete?: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  function setDigit(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      // Deleting: blank this box only.
      const next = value.split("");
      next[i] = "";
      onChange(next.join("").slice(0, 6));
      return;
    }
    // Pasting a whole code into any box should fill from that box onward,
    // not drop everything but the first character.
    const next = (value.slice(0, i) + digits).slice(0, 6);
    onChange(next);
    const focusAt = Math.min(i + digits.length, 5);
    refs.current[focusAt]?.focus();
    if (next.length === 6) onComplete?.(next);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on an already-empty box steps back, which is what every
    // native OTP field does — without it the caret gets stuck.
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-2" dir="ltr">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ""}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "w-11 h-13 py-3 rounded-xl border text-center text-lg font-bold tabular-nums",
            "bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]",
            "outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
            "disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}

function VerifyStep({
  email,
  onVerified,
  initialDevCode,
}: {
  email: string;
  onVerified: (user: User) => void;
  /**
   * Only ever set when the backend is running in development WITHOUT SMTP
   * credentials — in that case no mail was actually sent, so it hands the
   * code back and we show it here. Production never returns this field.
   */
  initialDevCode?: string;
}) {
  const { t } = useTranslation();
  const { showToast } = useAppStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState(initialDevCode);

  // The backend enforces a 60s resend cooldown; mirroring it here means the
  // button visibly counts down instead of failing with a 429 when tapped.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function submit(submitted?: string) {
    const value = submitted ?? code;
    if (value.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/verify-email", { email, code: value }, { timeout: 45_000 }
      );
      localStorage.setItem("trova-token", res.accessToken);
      onVerified(res.user);
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_verify"), t("auth", "err_waking_up")));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    setCooldown(60);
    setError("");
    try {
      const res = await apiClient.post<{ devCode?: string } | null>(
        "/auth/resend-code", { email }, { timeout: 45_000 }
      );
      if (res?.devCode) setDevCode(res.devCode);
      showToast(t("auth", "resend_sent"), undefined, "success");
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_verify"), t("auth", "err_waking_up")));
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <MailCheck className="w-5 h-5 text-indigo-500" strokeWidth={2} />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)]">{t("auth", "verify_title")}</h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">{t("auth", "verify_desc")}</p>
        <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 break-all">{email}</p>
      </div>

      {/* Development affordance: the server had no SMTP credentials, so no
          mail was sent and it handed the code back instead. Styled as an
          obvious warning, never as normal UI, and unreachable in production
          because the backend only returns devCode when NODE_ENV is
          development AND SMTP is unconfigured. */}
      {devCode && (
        <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-2.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gold-600 dark:text-gold-300">
            Dev — SMTP not configured
          </p>
          <button
            type="button"
            onClick={() => setCode(devCode)}
            className="text-xl font-extrabold tracking-[6px] tabular-nums text-[var(--foreground)] hover:text-indigo-500 transition-colors"
          >
            {devCode}
          </button>
          <p className="text-[10px] text-[var(--muted-foreground)]">tap to fill</p>
        </div>
      )}

      <CodeInput value={code} onChange={setCode} disabled={loading} onComplete={submit} />

      {error && (
        <p className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => submit()}
        disabled={code.length !== 6 || loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
          code.length === 6 && !loading
            ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
            : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
        )}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? t("auth", "verify_loading") : t("auth", "verify_btn")}
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={cooldown > 0}
        className="w-full text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed transition-colors"
      >
        {cooldown > 0 ? `${t("auth", "resend_wait")} (${cooldown})` : t("auth", "resend_btn")}
      </button>
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

// ── Forgot / reset password ──────────────────────────────────────────────────
// Three stages in one component (ask for email → code + new password → done)
// rather than three screens, because the email is carried between them and
// splitting it up would mean threading that state back through the parent
// for no user-visible benefit.
function ForgotPassword({
  onDone,
  onCancel,
  initialEmail,
}: {
  onDone: (user: User) => void;
  onCancel: () => void;
  initialEmail?: string;
}) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canReset = code.length === 6 && password.length >= 8;

  async function requestCode() {
    if (!emailValid || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ devCode?: string } | null>(
        "/auth/forgot-password", { email: email.trim().toLowerCase() }, { timeout: 45_000 }
      );
      if (res?.devCode) setDevCode(res.devCode);
      setStage("reset");
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_reset"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  async function submitReset() {
    if (!canReset || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/reset-password",
        { email: email.trim().toLowerCase(), code, newPassword: password },
        { timeout: 45_000 }
      );
      localStorage.setItem("trova-token", res.accessToken);
      setStage("done");
      // Brief pause so the success state is actually seen rather than the
      // modal vanishing the instant the request resolves.
      setTimeout(() => onDone(res.user), 1100);
    } catch (err: unknown) {
      setError(extractAuthError(err, t("auth", "err_reset"), t("auth", "err_waking_up")));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  if (stage === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="text-center py-8 space-y-3"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
        </div>
        <p className="text-base font-bold text-[var(--foreground)]">{t("auth", "reset_done")}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-indigo-500" strokeWidth={2} />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)]">
          {stage === "email" ? t("auth", "forgot_title") : t("auth", "reset_title")}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          {stage === "email" ? t("auth", "forgot_desc") : t("auth", "reset_desc")}
        </p>
        {stage === "reset" && (
          <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 break-all">{email}</p>
        )}
      </div>

      {stage === "email" ? (
        <>
          <Field
            label={t("auth", "email")} type="email" value={email} onChange={setEmail}
            placeholder={t("auth", "email_placeholder")} autoComplete="email"
          />
          <button
            type="button"
            onClick={requestCode}
            disabled={!emailValid || loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
              emailValid && !loading
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("auth", "forgot_send")}
          </button>
        </>
      ) : (
        <>
          {devCode && (
            <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-600 dark:text-gold-300">
                Dev — SMTP not configured
              </p>
              <button
                type="button"
                onClick={() => setCode(devCode)}
                className="text-xl font-extrabold tracking-[6px] tabular-nums text-[var(--foreground)] hover:text-indigo-500 transition-colors"
              >
                {devCode}
              </button>
            </div>
          )}

          <CodeInput value={code} onChange={setCode} disabled={loading} />

          <div className="space-y-1.5">
            <Field
              label={t("auth", "new_password")} type="password" value={password} onChange={setPassword}
              placeholder={t("auth", "new_password_ph")} autoComplete="new-password" required
            />
            <PasswordStrengthMeter password={password} t={t} />
          </div>

          <button
            type="button"
            onClick={submitReset}
            disabled={!canReset || loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
              canReset && !loading
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t("auth", "reset_loading") : t("auth", "reset_btn")}
          </button>
        </>
      )}

      {error && (
        <p className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        {t("auth", "back_to_login")}
      </button>
    </div>
  );
}

// ── Login tab ─────────────────────────────────────────────────────────────────
export function LoginTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const { t } = useTranslation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  // Set when the backend reports EMAIL_NOT_VERIFIED, which switches this
  // tab over to the code screen rather than dead-ending on an error.
  const [needsVerify, setNeedsVerify] = useState(false);
  const [forgot, setForgot] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (!password)                         e.password = t("auth", "err_password_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finishLogin(user: User) {
    login(user);
    mergePlanOnLogin().catch(() => {});
    onClose();
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
      finishLogin(res.user);
    } catch (err: unknown) {
      // Correct password, unconfirmed address: send them to the code screen
      // and re-issue a code, instead of showing an error they can't act on.
      const code = (err as { response?: { data?: { code?: string } } })?.response?.data?.code;
      if (code === "EMAIL_NOT_VERIFIED") {
        apiClient.post("/auth/resend-code", { email: email.trim().toLowerCase() }).catch(() => {});
        setNeedsVerify(true);
        return;
      }
      setApiError(extractAuthError(err, t("auth", "err_login"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  if (needsVerify) {
    return <VerifyStep email={email.trim().toLowerCase()} onVerified={finishLogin} />;
  }

  if (forgot) {
    return (
      <ForgotPassword
        // Carry over whatever they already typed, so someone who tried to
        // sign in and failed doesn't retype their address.
        initialEmail={email}
        onDone={finishLogin}
        onCancel={() => setForgot(false)}
      />
    );
  }

  return (
    <>
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

      <button
        type="button"
        onClick={() => setForgot(true)}
        className="w-full text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        {t("auth", "forgot_link")}
      </button>
    </form>
    </>
  );
}

// ── Register tab ──────────────────────────────────────────────────────────────
export function RegisterTab({ onClose }: { onClose: () => void }) {
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
  const [devCode, setDevCode] = useState<string | undefined>();

  const STEPS = [
    t("auth", "step_lang"),
    t("auth", "step_info"),
    t("auth", "step_verify"),
    t("auth", "step_done"),
  ];

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
      // Register no longer returns a session — it creates the account
      // unverified and emails a code. Step 3 collects that code, and
      // /auth/verify-email is what actually issues the tokens.
      const res = await apiClient.post<{ devCode?: string }>(
        "/auth/register",
        { name: name.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password, country, lang: selectedLang },
        { timeout: 45_000 }
      );
      setDevCode(res?.devCode);
      setStep(3);
    } catch (err: unknown) {
      setApiError(extractAuthError(err, t("auth", "err_register"), t("auth", "err_waking_up")));
    } finally {
      setLoading(false);
    }
  }

  function onVerified(user: User) {
    setDoneUser(user.name);
    login(user);
    mergePlanOnLogin().catch(() => {});
    setStep(4);
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
          {/* Stacked on the narrowest phones. Side by side these two are
              ~130px each at 320px wide, which truncates both the placeholder
              and any validation message under them. */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
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

      {/* Step 3 — Email verification code */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <VerifyStep email={email.trim().toLowerCase()} onVerified={onVerified} initialDevCode={devCode} />
        </motion.div>
      )}

      {/* Step 4 — Success */}
      {step === 4 && (
        <motion.div
          key="step4"
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


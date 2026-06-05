import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Eye, EyeOff, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { useTranslation } from "@/i18n";
import type { Lang } from "@/i18n";
import type { User } from "@/types";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "uz", label: "O'zbek"   },
  { code: "ru", label: "Русский"  },
  { code: "en", label: "English"  },
  { code: "zh", label: "中文"     },
  { code: "de", label: "Deutsch"  },
  { code: "fr", label: "Français" },
];

// ── Shared input ──────────────────────────────────────────────────────────────
function Field({
  label, error, type = "text", value, onChange, placeholder, autoComplete,
}: {
  label: string; error?: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[var(--muted-foreground)]">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl border bg-[var(--muted)] text-[var(--foreground)] text-sm",
            "placeholder:text-[var(--muted-foreground)] outline-none transition-all",
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
            error ? "border-red-400" : "border-[var(--border)]"
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
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/login", { email: email.trim().toLowerCase(), password }
      );
      localStorage.setItem("mrtour-token", res.accessToken);
      login(res.user);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setApiError(msg ?? t("auth", "err_login"));
    } finally {
      setLoading(false);
    }
  }

  return (
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
        className={cn("w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
          loading ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md")}>
        {loading ? t("auth", "loading_login") : t("auth", "login_btn")}
      </button>
    </form>
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

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)            e.name     = t("auth", "err_name_short");
    if (surname.trim().length < 2)         e.surname  = t("auth", "err_surname_short");
    if (!email.trim())                     e.email    = t("auth", "err_email_required");
    else if (!/\S+@\S+\.\S+/.test(email))  e.email    = t("auth", "err_email_invalid");
    if (password.length < 8)               e.password = t("auth", "err_password_short");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/register",
        { name: name.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password, country, lang: selectedLang }
      );
      localStorage.setItem("mrtour-token", res.accessToken);
      setDoneUser(res.user.name);
      login(res.user);
      setStep(3);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setApiError(msg ?? t("auth", "err_register"));
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

      {/* Step 1 — Language */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-center text-[var(--foreground)] font-medium">{t("auth", "lang_question")}</p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button key={l.code} type="button" onClick={() => setSelectedLang(l.code)}
                className={cn("flex items-center justify-center px-3 py-3 rounded-xl border text-sm font-medium transition-all",
                  selectedLang === l.code
                    ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-400 font-semibold"
                    : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/20")}>
                {l.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors active:scale-[0.98]">
            {t("auth", "continue")} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2 — Form */}
      {step === 2 && (
        <form onSubmit={onSubmit} noValidate className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("auth", "name")} value={name} onChange={setName}
              placeholder={t("auth", "name_placeholder")} autoComplete="given-name" error={errors.name} />
            <Field label={t("auth", "surname")} value={surname} onChange={setSurname}
              placeholder={t("auth", "surname_placeholder")} autoComplete="family-name" error={errors.surname} />
          </div>
          <Field label={t("auth", "email")} type="email" value={email} onChange={setEmail}
            placeholder={t("auth", "email_placeholder")} autoComplete="email" error={errors.email} />
          <Field label={t("auth", "password")} type="password" value={password} onChange={setPassword}
            placeholder={t("auth", "new_password_placeholder")} autoComplete="new-password" error={errors.password} />
          <Field label={t("auth", "country")} value={country} onChange={setCountry}
            placeholder={t("auth", "country_placeholder")} autoComplete="country-name" />

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
            <button type="submit" disabled={loading}
              className={cn("flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                loading ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white")}>
              {loading ? t("auth", "loading_register") : t("auth", "register_btn")}
            </button>
          </div>
        </form>
      )}

      {/* Step 3 — Success */}
      {step === 3 && (
        <div className="text-center py-4 space-y-4">
          <div className="text-6xl">🎉</div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">{t("auth", "success_title")}, {doneUser}!</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{t("auth", "success_desc")}</p>
          </div>
          <div className="space-y-1.5 text-left">
            {[
              `✅ ${t("auth", "success_feature1")}`,
              `✅ ${t("auth", "success_feature2")}`,
              `✅ ${t("auth", "success_feature3")}`,
            ].map((item) => (
              <p key={item} className="text-sm text-[var(--foreground)]/80">{item}</p>
            ))}
          </div>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors">
            {t("auth", "start")} 🚀
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAppStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  function handleClose() {
    closeAuthModal();
    setTimeout(() => setActiveTab("login"), 300);
  }

  return (
    <Dialog.Root open={authModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className={cn(
          "fixed z-50 w-full max-w-sm left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-5 max-h-[90vh] overflow-y-auto"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-[var(--foreground)]">MR<span className="text-indigo-500">TOUR</span></span>
            </div>
            <Dialog.Close asChild>
              <button className="w-7 h-7 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center transition-colors" aria-label="Close">
                <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex rounded-xl bg-[var(--muted)] p-1 mb-5 gap-1">
            {(["login", "register"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}>
                {tab === "login" ? t("auth", "login") : t("auth", "register")}
              </button>
            ))}
          </div>

          {activeTab === "login" ? <LoginTab onClose={handleClose} /> : <RegisterTab onClose={handleClose} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

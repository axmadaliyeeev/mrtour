import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Eye, EyeOff, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

// ── Schemas ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Yaroqli email kiriting"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta harf").max(50),
  surname: z.string().min(2, "Familiya kamida 2 ta harf").max(50),
  email: z.string().email("Yaroqli email kiriting"),
  password: z.string().min(8, "Parol kamida 8 ta belgi").max(100),
  country: z.string().max(60).optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const REGISTER_STEPS = ["Til tanlash", "Ma'lumotlar", "Tayyor!"] as const;

// ── Shared input ──────────────────────────────────────────────────────────────
function FormInput({
  label,
  error,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl border bg-[var(--muted)] text-[var(--foreground)] text-sm",
            "placeholder:text-[var(--muted-foreground)] outline-none transition-all",
            "focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30",
            error ? "border-red-400" : "border-[var(--border)]"
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
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
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setApiError(null);
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/login",
        data
      );
      localStorage.setItem("mrtour-token", res.accessToken);
      login(res.user);
      onClose();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Email yoki parol noto'g'ri"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormInput
        label="Parol"
        type="password"
        placeholder="Parolingiz"
        error={errors.password?.message}
        {...register("password")}
      />

      {apiError && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
          isSubmitting
            ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            : "bg-teal-500 hover:bg-teal-600 text-white shadow-md"
        )}
      >
        {isSubmitting ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}

// ── Register tab ──────────────────────────────────────────────────────────────
function RegisterTab({ onClose }: { onClose: () => void }) {
  const { login } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState("uz");
  const [registeredName, setRegisteredName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    setApiError(null);
    try {
      const res = await apiClient.post<{ user: User; accessToken: string }>(
        "/auth/register",
        { ...data, lang: selectedLang }
      );
      localStorage.setItem("mrtour-token", res.accessToken);
      setRegisteredName(res.user.name);
      login(res.user);
      setStep(3);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Ro'yxatdan o'tishda xato"
      );
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-5">
        {REGISTER_STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={cn(
                "w-full h-1 rounded-full transition-all duration-500",
                i + 1 < step
                  ? "bg-teal-500"
                  : i + 1 === step
                  ? "bg-teal-400"
                  : "bg-[var(--border)]"
              )}
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[var(--muted-foreground)] text-center mb-4">
        {REGISTER_STEPS[step - 1]}
      </p>

      {/* ── Step 1: Language ── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-center text-[var(--foreground)] font-medium">
            Qaysi tilda davom etasiz?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setSelectedLang(l.code)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all",
                  selectedLang === l.code
                    ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                    : "bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] hover:border-teal-500/20"
                )}
              >
                <span className="text-xl">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors active:scale-[0.98]"
          >
            Davom etish <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 2: Form ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Ism"
              placeholder="Ali"
              error={errors.name?.message}
              {...register("name")}
            />
            <FormInput
              label="Familiya"
              placeholder="Valiyev"
              error={errors.surname?.message}
              {...register("surname")}
            />
          </div>
          <FormInput
            label="Email"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInput
            label="Parol"
            type="password"
            placeholder="Kamida 8 belgi"
            error={errors.password?.message}
            {...register("password")}
          />
          <FormInput
            label="Mamlakat (ixtiyoriy)"
            placeholder="O'zbekiston"
            {...register("country")}
          />

          {apiError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm hover:bg-[var(--muted)] transition-colors"
            >
              Orqaga
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                isSubmitting
                  ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              )}
            >
              {isSubmitting ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </div>
        </form>
      )}

      {/* ── Step 3: Success ── */}
      {step === 3 && (
        <div className="text-center py-4 space-y-4">
          <div className="text-6xl">🎉</div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Xush kelibsiz, {registeredName || ""}!
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Akkauntingiz muvaffaqiyatli yaratildi
            </p>
          </div>
          <div className="space-y-1.5 text-left">
            {[
              "✅ AI Bek bilan suhbat boshlash",
              "✅ Joylarni rejaga qo'shish",
              "✅ Shaxsiy tur yaratish",
            ].map((t) => (
              <p key={t} className="text-sm text-[var(--foreground)]/80">
                {t}
              </p>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors"
          >
            Boshlash 🚀
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  function handleClose() {
    closeAuthModal();
    setTimeout(() => setActiveTab("login"), 300);
  }

  return (
    <Dialog.Root
      open={authModalOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        <Dialog.Content
          className={cn(
            "fixed z-50 w-full max-w-sm",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl",
            "p-5",
            "max-h-[90vh] overflow-y-auto"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇺🇿</span>
              <span className="font-bold text-[var(--foreground)]">
                MR<span className="text-teal-500">TOUR</span>.UZ
              </span>
            </div>
            <Dialog.Close asChild>
              <button
                className="w-7 h-7 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center transition-colors"
                aria-label="Yopish"
              >
                <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-[var(--muted)] p-1 mb-5 gap-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === t
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {t === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "login" ? (
            <LoginTab onClose={handleClose} />
          ) : (
            <RegisterTab onClose={handleClose} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

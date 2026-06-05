import { useEffect, useRef } from "react";
import { X, CheckCircle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Toast } from "@/store";

export function Toaster() {
  const { toasts, dismissToast } = useAppStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { opacity: "0", transform: "translateY(-10px) scale(0.94)" },
        { opacity: "1", transform: "translateY(0) scale(1)" },
      ],
      { duration: 220, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" }
    );
  }, []);

  const styles = {
    success: "border-indigo-500/25 shadow-indigo-500/8",
    info:    "border-blue-500/25 shadow-blue-500/8",
    error:   "border-red-500/25 shadow-red-500/8",
  };

  const iconEl =
    toast.type === "error" ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> :
    toast.type === "info"  ? <Info className="w-4 h-4 text-blue-400 shrink-0" /> :
                             <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />;

  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl w-full",
        "glass bg-[var(--card)]",
        styles[toast.type ?? "success"]
      )}
    >
      {toast.icon ? (
        <span className="text-base shrink-0" aria-hidden="true">{toast.icon}</span>
      ) : (
        iconEl
      )}
      <p className="text-sm font-medium text-[var(--foreground)] flex-1 leading-tight">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 w-5 h-5 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors active:scale-90"
        aria-label="Yopish"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

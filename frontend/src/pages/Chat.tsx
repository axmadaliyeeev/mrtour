import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send, Bot, User as UserIcon, Loader2, RotateCcw, MapPin, Sparkles, X,
  MessageCircle, Copy, Check, RefreshCw, ChevronDown,
  Landmark, Hotel, Bus, Star as StarIcon, Lightbulb, AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { MessageContent } from "@/components/chat/MessageContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

// A timed-out/network failure (most often a free-tier backend cold-booting)
// reads very differently to a user than a genuine server error.
function extractChatError(err: unknown, fallback: string, wakingUp: string): string {
  const e = err as { code?: string; response?: { data?: { message?: string } } };
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.code === "ECONNABORTED" || !e?.response) return wakingUp;
  return fallback;
}

export default function Chat() {
  const { plan, user } = useAppStore();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const { isDesktop } = useBreakpoint();

  function makeWelcomeMessage(): Message {
    return { id: "welcome", role: "assistant", content: t("chat", "welcome"), timestamp: new Date() };
  }

  // lucide icons instead of emoji — some emoji (🗺️, flags, etc.) render as
  // broken/boxy glyphs on Windows without full color-emoji font support;
  // an SVG icon looks identical on every platform.
  const QUICK_ACTIONS = [
    { icon: Landmark,  color: "text-indigo-400",  bg: "bg-indigo-500/12", label: t("chat", "quick_samarqand"), text: t("chat", "quick_samarqand_prompt") },
    { icon: Hotel,     color: "text-gold-500",    bg: "bg-gold-500/12",   label: t("chat", "quick_hotel"),     text: t("chat", "quick_hotel_prompt") },
    { icon: Bus,       color: "text-indigo-400",  bg: "bg-indigo-500/12", label: t("chat", "quick_transport"), text: t("chat", "quick_transport_prompt") },
    { icon: StarIcon,  color: "text-amber-400",   bg: "bg-amber-500/12",  label: t("chat", "quick_top"),       text: t("chat", "quick_top_prompt") },
    { icon: Lightbulb, color: "text-gold-500",    bg: "bg-gold-500/12",   label: t("chat", "quick_tips"),      text: t("chat", "quick_tips_prompt") },
  ];

  const [messages, setMessages] = useState<Message[]>(() => [makeWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planBannerDismissed, setPlanBannerDismissed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastUserTextRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasNearBottomRef = useRef(true);

  // Only auto-scroll to new messages if the user was already near the
  // bottom — jumping the view while someone has scrolled up to reread
  // earlier replies is exactly the kind of thing that reads as unpolished.
  useEffect(() => {
    if (wasNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleScroll() {
    const el = scrollAreaRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    wasNearBottomRef.current = nearBottom;
    setShowScrollButton(!nearBottom);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function buildPlanContext(): string | undefined {
    if (!plan.length) return undefined;
    return plan.map((loc) => `${loc.name} (${loc.city})`).join(", ");
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    lastUserTextRef.current = text.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    wasNearBottomRef.current = true;

    try {
      const history = messages
        .filter((m) => m.id !== "welcome" && !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      // Backend caps chat history at 10 messages (ai.router.ts chatSchema) —
      // keep only the most recent turns so long conversations don't 422.
      const apiMessages = [...history, { role: "user" as const, content: text.trim() }].slice(-10);

      // Longer timeout here: a cold-started backend + actual model
      // generation time can together take well past the default timeout.
      const res = await apiClient.post<{ reply: string }>(
        "/ai/chat",
        { messages: apiMessages, userContext: { plan: buildPlanContext() } },
        { timeout: 45_000 }
      );

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply ?? t("chat", "error"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: extractChatError(err, t("chat", "error"), t("chat", "waking_up")),
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function retryLastMessage() {
    if (!lastUserTextRef.current) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendMessage(lastUserTextRef.current);
  }

  async function copyMessage(msg: Message) {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId((id) => (id === msg.id ? null : id)), 1800);
    } catch {
      // Clipboard permission denied — nothing to recover, just skip silently.
    }
  }

  function sendPlanTourRequest() {
    if (!plan.length) return;
    const locationNames = plan.map((loc) => `${loc.name} (${loc.city})`).join(", ");
    const msg = `${t("chat", "plan_tour_intro")} ${locationNames}. ${t("chat", "plan_tour_outro")}`;
    sendMessage(msg);
    setPlanBannerDismissed(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Skip while an IME composition is active (e.g. Chinese/Japanese input) —
    // otherwise Enter-to-confirm-candidate would send the message mid-composition.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([makeWelcomeMessage()]);
    setInput("");
    setPlanBannerDismissed(false);
  }

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [makeWelcomeMessage()];
      }
      return prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const LOCALE_MAP: Record<string, string> = {
    uz: "uz-UZ", ru: "ru-RU", en: "en-US", zh: "zh-CN", de: "de-DE", fr: "fr-FR",
  };

  function formatTime(date: Date) {
    return date.toLocaleTimeString(LOCALE_MAP[lang] ?? "uz-UZ", { hour: "2-digit", minute: "2-digit" });
  }

  const showPlanBanner = plan.length > 0 && !planBannerDismissed && messages.length <= 1;
  const showQuickActions = messages.length <= 1;

  return (
    <div
      className="flex flex-col overflow-hidden w-full max-w-3xl mx-auto"
      style={{
        height: isDesktop
          ? "calc(100dvh - 3.5rem)"
          : "calc(100dvh - 3.5rem - 72px - env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Header */}
      <div className="glass flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-[var(--border)] bg-[var(--header-bg)] shrink-0 z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="border-glow-spin relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
            <Bot className="w-4 h-4" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-indigo-400 rounded-full border-2 border-[var(--background)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--foreground)] truncate">{t("chat", "title")}</p>
            <p className="text-[11px] text-indigo-400 truncate">{t("chat", "subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {plan.length > 0 && (
            <div className="hidden xs:flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 shrink-0">
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span className="text-[11px] font-semibold text-indigo-400 whitespace-nowrap">
                {plan.length} {t("chat", "places")}
              </span>
            </div>
          )}
          <button
            onClick={resetChat}
            className="flex items-center justify-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)] hover:border-indigo-500/40 transition-all shrink-0"
            aria-label={t("chat", "reset")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("chat", "reset")}</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0, black 16px, black calc(100% - 8px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 16px, black calc(100% - 8px), transparent 100%)",
        }}
      >
        <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={cn(
              "group flex gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 font-bold",
                msg.role === "assistant"
                  ? msg.isError
                    ? "bg-red-500/15 border border-red-500/30 text-red-400"
                    : "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-gradient-to-br from-indigo-500/80 to-indigo-600/80 text-white"
              )}
            >
              {msg.role === "assistant" ? (
                msg.isError ? <AlertTriangle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />
              ) : user ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="w-3.5 h-3.5" />
              )}
            </div>

            <div
              className={cn(
                "max-w-[88%] xs:max-w-[85%] sm:max-w-[80%] space-y-1",
                msg.role === "user" ? "items-end" : "items-start",
                "flex flex-col"
              )}
            >
              <div
                className={cn(
                  "px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? msg.isError
                      ? "bg-red-500/8 border border-red-500/25 text-[var(--foreground)] rounded-tl-sm"
                      : "bg-gradient-to-br from-[var(--card)] to-[var(--card-hover)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm shadow-[var(--shadow-card)]"
                    : "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-500/25"
                )}
              >
                <MessageContent text={msg.content} />
                {msg.isError && (
                  <button
                    onClick={retryLastMessage}
                    className="ripple mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/12 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all active:scale-[0.96]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t("chat", "retry")}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] text-[var(--muted-foreground)]/60">
                  {formatTime(msg.timestamp)}
                </span>
                {msg.role === "assistant" && !msg.isError && msg.id !== "welcome" && (
                  <button
                    onClick={() => copyMessage(msg)}
                    className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] hover:text-indigo-400 transition-all active:scale-90"
                    aria-label="Copy"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Suggestion cards fill the empty space on a fresh chat */}
        {showQuickActions && !isLoading && (
          <div className="max-w-lg pt-2 animate-fade-up delay-200">
            <p className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/8 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">
              <MessageCircle className="w-3 h-3" />
              {t("chat", "quick_label")}
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.text)}
                  className="tilt-hover animate-fade-up group flex items-center gap-3 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-card)] hover:border-indigo-500/40 hover:shadow-[var(--shadow-card-hover)] transition-all active:scale-[0.97]"
                  style={{ animationDelay: `${250 + i * 60}ms` }}
                >
                  <span className={cn("flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform group-hover:scale-105", action.bg)}>
                    <action.icon className={cn("w-4 h-4", action.color)} />
                  </span>
                  <span className="flex-1 leading-snug">{action.label}</span>
                  <Send className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/30">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Jump-to-latest — appears once the user scrolls away from the bottom */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              onClick={scrollToBottom}
              className="sticky bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/40 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Plan banner */}
      {showPlanBanner && (
        <div className="px-3 sm:px-4 pb-3 shrink-0 space-y-3">
          {/* Plan-aware tour creation banner */}
          {showPlanBanner && (
            <div className="relative rounded-2xl border border-indigo-500/40 bg-indigo-500/8 p-3.5 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 -translate-y-6 translate-x-6 pointer-events-none" />
              <button
                onClick={() => setPlanBannerDismissed(true)}
                className="absolute top-0 right-0 w-11 h-11 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Close"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--muted)] flex items-center justify-center">
                  <X className="w-3 h-3" />
                </span>
              </button>
              <div className="flex items-start gap-2.5 pr-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-indigo-400 mb-0.5">
                    {plan.length} {t("chat", "plan_banner_title")}
                  </p>
                  <p className="text-[11px] text-[var(--foreground)]/70 leading-snug mb-2.5">
                    {plan.slice(0, 3).map(l => l.name).join(", ")}
                    {plan.length > 3 && ` ${t("chat", "plan_banner_desc")} ${plan.length - 3} ${t("chat", "plan_banner_more")}`}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={sendPlanTourRequest}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-all active:scale-[0.97]"
                    >
                      <Sparkles className="w-3 h-3" />
                      {t("chat", "plan_btn")}
                    </button>
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)] transition-all"
                    >
                      <MapPin className="w-3 h-3" />
                      {t("chat", "plan_view")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Input area */}
      <div className="glass px-3 sm:px-4 pb-3 sm:pb-4 pt-2.5 border-t border-[var(--border)] bg-[var(--header-bg)] shrink-0">
        <div
          className={cn(
            "flex items-end gap-2 p-1.5 rounded-2xl bg-[var(--card)] border transition-all",
            input.trim()
              ? "border-indigo-500/50 shadow-md shadow-indigo-500/10"
              : "border-[var(--border)] shadow-[var(--shadow-card)]"
          )}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat", "input_placeholder")}
            rows={1}
            className={cn(
              "flex-1 px-3 py-2.5 rounded-xl resize-none bg-transparent",
              "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
              "outline-none max-h-32 overflow-y-auto"
            )}
            style={{ height: "auto", minHeight: "40px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              "ripple flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-95 shrink-0",
              input.trim() && !isLoading
                ? "btn-aura bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/30"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
            )}
            aria-label={t("chat", "input_placeholder")}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="hidden sm:block text-[10px] text-[var(--muted-foreground)]/60 text-center mt-2">
          {t("chat", "hint")}
        </p>
      </div>
    </div>
  );
}

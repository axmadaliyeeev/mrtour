import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, RotateCcw, MapPin, Sparkles, X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const { plan } = useAppStore();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const { isDesktop } = useBreakpoint();

  function makeWelcomeMessage(): Message {
    return { id: "welcome", role: "assistant", content: t("chat", "welcome"), timestamp: new Date() };
  }

  const QUICK_ACTIONS = [
    { label: `🗺️ ${t("chat", "quick_samarqand")}`, text: t("chat", "quick_samarqand_prompt") },
    { label: `🏨 ${t("chat", "quick_hotel")}`,      text: t("chat", "quick_hotel_prompt") },
    { label: `🚌 ${t("chat", "quick_transport")}`,  text: t("chat", "quick_transport_prompt") },
    { label: `🌟 ${t("chat", "quick_top")}`,        text: t("chat", "quick_top_prompt") },
    { label: `💡 ${t("chat", "quick_tips")}`,       text: t("chat", "quick_tips_prompt") },
  ];

  const [messages, setMessages] = useState<Message[]>(() => [makeWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planBannerDismissed, setPlanBannerDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function buildPlanContext(): string | undefined {
    if (!plan.length) return undefined;
    return plan.map((loc) => `${loc.name} (${loc.city})`).join(", ");
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const apiMessages = [...history, { role: "user" as const, content: text.trim() }];

      const res = await apiClient.post<{ reply: string }>("/ai/chat", {
        messages: apiMessages,
        userContext: {
          plan: buildPlanContext(),
        },
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply ?? t("chat", "error"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("chat", "error"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
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
    if (e.key === "Enter" && !e.shiftKey) {
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

  function formatTime(date: Date) {
    return date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  }

  const showPlanBanner = plan.length > 0 && !planBannerDismissed && messages.length <= 1;
  const showQuickActions = messages.length <= 1;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: isDesktop
          ? "calc(100dvh - 3.5rem)"
          : "calc(100dvh - 3.5rem - 72px - env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--background)]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">{t("chat", "title")}</p>
            <p className="text-[11px] text-indigo-400">{t("chat", "subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {plan.length > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span className="text-[11px] font-semibold text-indigo-400">
                {plan.length} {t("chat", "places")}
              </span>
            </div>
          )}
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)] hover:border-indigo-500/40 transition-all"
            aria-label={t("chat", "reset")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t("chat", "reset")}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5",
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-[var(--muted)] border border-[var(--border)]"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              )}
            </div>

            <div
              className={cn(
                "max-w-[80%] space-y-1",
                msg.role === "user" ? "items-end" : "items-start",
                "flex flex-col"
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "assistant"
                    ? "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm"
                    : "bg-indigo-500 text-white rounded-tr-sm shadow-md shadow-indigo-500/20"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-[var(--muted-foreground)]/60 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/30">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span className="text-xs text-[var(--muted-foreground)]">{t("chat", "typing")}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Plan banner + Quick actions */}
      {showQuickActions && (
        <div className="px-4 pb-3 shrink-0 space-y-3">
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

          {/* Quick actions */}
          <div>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {t("chat", "quick_label")}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {plan.length > 0 && (
                <button
                  onClick={sendPlanTourRequest}
                  className="shrink-0 px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-xs text-indigo-400 font-semibold hover:bg-indigo-500/20 transition-all whitespace-nowrap flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3" />
                  {t("chat", "plan_quick")}: {plan.length} {t("chat", "places")}
                </button>
              )}
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.text)}
                  className="shrink-0 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] bg-[var(--background)] shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat", "input_placeholder")}
            rows={1}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl resize-none",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
              "outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all",
              "max-h-32 overflow-y-auto"
            )}
            style={{ height: "auto", minHeight: "44px" }}
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
              "flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 shrink-0",
              input.trim() && !isLoading
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
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
        <p className="text-[10px] text-[var(--muted-foreground)]/60 text-center mt-2">
          {t("chat", "hint")}
        </p>
      </div>
    </div>
  );
}

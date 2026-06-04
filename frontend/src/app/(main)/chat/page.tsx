"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { Send, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { MessageBubble, TypingBubble } from "@/components/chat/message-bubble";
import { QuickActions } from "@/components/chat/quick-actions";
import { TourFlow, type TourData } from "@/components/chat/tour-flow";
import type { ChatMessage } from "@/types";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Salom! Men **Bek** — MRTOUR.UZ sun'iy intellekt yordamchisiman. 🇺🇿\n\nO'zbekiston bo'ylab sayohatingizni rejalashtirishda yordam bera olaman: **joylar**, **marshrutlar**, **byudjet**, **gidlar** va boshqa savollar bo'yicha.\n\nNima haqida gaplashamiz?",
  timestamp: new Date(),
};

export default function ChatPage() {
  const { user, plan } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTourFlow, setShowTourFlow] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  function resizeTextarea() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = {
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setLoading(true);

      // Trigger tour flow if user asks for tur reja
      if (/tur reja|marshut|rej(a|alas)/i.test(text)) {
        setShowTourFlow(true);
      }

      try {
        const history = [...messages, userMsg]
          .slice(-10)
          .map(({ role, content }) => ({ role, content }));

        const data = await apiClient.post<{ reply: string }>("/ai/chat", {
          messages: history,
          context: {
            userName: user?.name ?? "Mehmon",
            plan: plan.map((l) => `${l.name} (${l.city})`).join(", ") || null,
          },
        });

        const aiMsg: ChatMessage = {
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const errMsg: ChatMessage = {
          role: "assistant",
          content:
            "Uzr, hozir serverga ulanishda muammo bor. Iltimos, biroz kutib qayta urinib ko'ring. 🙏",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, user, plan]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleTourComplete(data: TourData) {
    setShowTourFlow(false);
    const prompt =
      `${data.days} kunlik, ${data.people} uchun, ` +
      `${data.regions.join(", ")} viloyatlarini qamrab oluvchi ` +
      `${data.budget} byudjetli O'zbekiston tur rejasini tuzing. ` +
      `Har kun uchun batafsil dastur, transport va narxlar bilan.`;
    sendMessage(prompt);
  }

  return (
    <div className="flex flex-col h-[calc(100svh-3.5rem)] md:h-[calc(100svh-3.5rem)]">

      {/* ── Chat Header ────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-teal-600/20 to-teal-500/5 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                "bg-gradient-to-br from-teal-500 to-teal-600 shadow-md",
                loading && "animate-pulse"
              )}
            >
              🤖
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">
              Bek — AI Yordamchi
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-[11px] text-emerald-400">Online</span>
            </div>
          </div>

          {plan.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full",
                "bg-teal-500/10 border border-teal-500/30"
              )}
            >
              <MapPin className="w-3 h-3 text-teal-400" />
              <span className="text-[11px] text-teal-400 font-medium">
                {plan.length} joy
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isLast={i === messages.length - 1}
          />
        ))}

        {loading && <TypingBubble />}

        {showTourFlow && !loading && (
          <TourFlow
            plan={plan}
            onComplete={handleTourComplete}
            onCancel={() => setShowTourFlow(false)}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ─────────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm px-3 py-2.5 space-y-2">
        {/* Quick actions (only shown when no messages except welcome) */}
        {messages.length <= 1 && (
          <QuickActions onAction={(p) => sendMessage(p)} />
        )}

        <div className="flex items-end gap-2">
          <div
            className={cn(
              "flex-1 flex items-end rounded-2xl border px-3 py-2",
              "bg-card transition-all duration-200",
              input.length > 0
                ? "border-teal-500/50 ring-1 ring-teal-500/20"
                : "border-border"
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Savol yozing... (Enter = yuborish)"
              rows={1}
              disabled={loading}
              className={cn(
                "flex-1 resize-none bg-transparent text-sm text-foreground",
                "placeholder:text-muted-foreground outline-none",
                "max-h-[120px] leading-5",
                loading && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>

          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className={cn(
              "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              "transition-all duration-200 active:scale-90",
              loading || !input.trim()
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 text-white shadow-md"
            )}
            aria-label="Yuborish"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center">
          Shift+Enter — yangi qator · Enter — yuborish
        </p>
      </div>
    </div>
  );
}

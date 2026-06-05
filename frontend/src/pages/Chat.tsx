import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: "🗺️ Samarqand sayohati", text: "Samarqandga 3 kunlik sayohat rejasi tuzib ber" },
  { label: "💰 Valyuta kursi", text: "Hozirgi dollar va rubl kursi qancha?" },
  { label: "🏨 Mehmonxona", text: "Buxoroda eng yaxshi mehmonxonalarni tavsiya qil" },
  { label: "🚌 Transport", text: "Toshkentdan Samarqandga qanday borsa bo'ladi?" },
  { label: "🌟 Eng yaxshi joylar", text: "O'zbekistonda albatta borish kerak bo'lgan 5 joy" },
  { label: "💡 Maslahat", text: "O'zbekistonga sayohat qilishda nimalarni bilish kerak?" },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Salom! Men AI Bek — MRTOUR.UZ ning sun'iy intellekt yordamchisiman. 🇺🇿\n\nO'zbekistondagi sayohatingiz bo'yicha har qanday savolga javob bera olaman:\n• Joylar va diqqatga sazovor ob'ektlar\n• Mehmonxona va restoran tavsiyalari\n• Transport va yo'l yo'riqlari\n• Valyuta kurslari\n• Madaniyat va urf-odatlar\n\nNima haqida bilmoqchisiz?",
  timestamp: new Date(),
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply ?? "Kechirasiz, javob olishda xatolik yuz berdi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Kechirasiz, hozirda server bilan bog'lanishda muammo bor. Iltimos, bir ozdan so'ng qayta urinib ko'ring. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-md">
            🤖
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--background)]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">AI Bek</p>
            <p className="text-[11px] text-teal-400">Onlayn · Doimo tayyor</p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:text-[var(--foreground)] hover:border-teal-500/40 transition-all"
          aria-label="Suhbatni yangilash"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Yangilash
        </button>
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
            {/* Avatar */}
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5",
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
                  : "bg-[var(--muted)] border border-[var(--border)]"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              )}
            </div>

            {/* Bubble */}
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
                    : "bg-teal-500 text-white rounded-tr-sm"
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

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                <span className="text-xs text-[var(--muted-foreground)]">
                  Yozmoqda...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick action buttons */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 shrink-0">
          <p className="text-[11px] text-[var(--muted-foreground)] mb-2">
            Tezkor savollar:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.text)}
                className="shrink-0 px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-teal-500/40 hover:bg-teal-500/5 transition-all whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
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
            placeholder="Xabar yozing... (Enter — yuborish)"
            rows={1}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl resize-none",
              "bg-[var(--muted)] border border-[var(--border)]",
              "text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)]",
              "outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all",
              "max-h-32 overflow-y-auto"
            )}
            style={{
              height: "auto",
              minHeight: "44px",
            }}
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
                ? "bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/25"
                : "bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed"
            )}
            aria-label="Yuborish"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-[var(--muted-foreground)]/60 text-center mt-2">
          Shift+Enter — yangi qator
        </p>
      </div>
    </div>
  );
}

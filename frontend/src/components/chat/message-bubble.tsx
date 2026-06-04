"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

function formatTime(ts: Date): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

function renderContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    // Render newlines
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className={cn("flex justify-end mb-3", isLast && "mb-1")}>
        <div className="max-w-[78%] flex flex-col items-end gap-1 animate-slide-in-right">
          <div
            className="px-4 py-2.5 text-sm text-white bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm"
            style={{ borderRadius: "18px 18px 4px 18px" }}
          >
            {renderContent(message.content)}
          </div>
          <span className="text-[10px] text-muted-foreground px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-end gap-2 mb-3", isLast && "mb-1")}>
      {/* AI avatar */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm shadow-sm">
        🤖
      </div>

      <div className="max-w-[78%] flex flex-col items-start gap-1 animate-slide-in-left">
        <div
          className="px-4 py-2.5 text-sm bg-card border border-border text-foreground shadow-sm"
          style={{ borderRadius: "18px 18px 18px 4px" }}
        >
          {renderContent(message.content)}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex items-end gap-2 mb-3 animate-slide-in-left">
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-sm shadow-sm">
        🤖
      </div>
      <div
        className="px-4 py-3 bg-card border border-border"
        style={{ borderRadius: "18px 18px 18px 4px" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground mr-1">Bek yozmoqda</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-teal-400 dot-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

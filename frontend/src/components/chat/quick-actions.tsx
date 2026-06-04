"use client";

import { cn } from "@/lib/utils";

interface QuickAction {
  icon: string;
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: "🗺️",
    label: "Tur reja tuz",
    prompt:
      "O'zbekiston bo'ylab 7 kunlik tur rejasi tuzing. Samarqand, Buxoro va Xiva shaharlarini qamrab olsin. Har kuni ko'rish kerak bo'lgan joylar va transport vositalarini ham ko'rsating.",
  },
  {
    icon: "🍽️",
    label: "Eng yaxshi plov",
    prompt:
      "O'zbekistonda eng yaxshi plov yeyish mumkin bo'lgan restoranlar va manzillarni tavsiya qiling. Samarqand, Toshkent va Farg'ona uchun alohida tavsiyalar bering.",
  },
  {
    icon: "🚄",
    label: "Xiva ga borish",
    prompt:
      "Toshkentdan Xivaga borish uchun barcha transport imkoniyatlarini tushuntiring: parvoz, poezd, avtobus. Vaqt va narxlarni ham ko'rsating.",
  },
  {
    icon: "💰",
    label: "7 kun byudjet",
    prompt:
      "O'zbekistonda 7 kunlik sayohat uchun to'liq byudjet hisobini tuzib bering. Mehmonxona, ovqat, transport va kirish narxlarini alohida ko'rsating.",
  },
  {
    icon: "🌡️",
    label: "Qulay oy",
    prompt:
      "O'zbekistonga sayohat qilish uchun qaysi oy va fasl eng qulay? Ob-havo, turistik gavjumlik va narx jihatdan taqqoslab bering.",
  },
  {
    icon: "👤",
    label: "GID tavsiya",
    prompt:
      "O'zbekistonda professional va tajribali sayohat gidlarini topish uchun qanday resurslar mavjud? Gid yollash bo'yicha maslahatlar bering.",
  },
];

interface QuickActionsProps {
  onAction: (prompt: string) => void;
  className?: string;
}

export function QuickActions({ onAction, className }: QuickActionsProps) {
  return (
    <div className={cn("w-full", className)}>
      <p className="text-[11px] text-muted-foreground mb-2 px-1">Tezkor savollar</p>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5",
              "rounded-full border border-teal-500/40",
              "bg-teal-500/5 hover:bg-teal-500/15",
              "text-xs text-teal-400 hover:text-teal-300",
              "transition-all duration-200 active:scale-95",
              "whitespace-nowrap"
            )}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

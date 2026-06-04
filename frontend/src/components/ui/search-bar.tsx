"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Qidirish...",
  onFocus,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none shrink-0"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-9 pr-9",
          "rounded-xl border border-border",
          "bg-card text-foreground text-sm",
          "placeholder:text-muted-foreground",
          "outline-none transition-all duration-200",
          "focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
        )}
      />

      {value.length > 0 && (
        <button
          onClick={() => onChange("")}
          className={cn(
            "absolute right-2.5",
            "flex items-center justify-center",
            "w-5 h-5 rounded-full",
            "bg-muted hover:bg-accent",
            "text-muted-foreground hover:text-foreground",
            "transition-colors"
          )}
          aria-label="Tozalash"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleMapsBtnProps {
  url: string;
  label?: string;
  className?: string;
}

export function GoogleMapsBtn({
  url,
  label = "Google Maps'da ko'rish",
  className,
}: GoogleMapsBtnProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5",
        "rounded-lg border border-border",
        "bg-transparent hover:bg-muted",
        "text-sm text-muted-foreground hover:text-foreground",
        "transition-all duration-200 active:scale-95 group",
        className
      )}
    >
      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity" />
    </a>
  );
}

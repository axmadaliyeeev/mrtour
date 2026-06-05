"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImgWithFallbackProps {
  src:        string;
  alt:        string;
  className?: string;
  fallback?:  string;
}

export function ImgWithFallback({ src, alt, className, fallback }: ImgWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={cn("flex items-center justify-center bg-gradient-to-br from-teal-900/40 to-[var(--muted)]", className)}
        aria-label={alt}
      >
        <span className="text-3xl opacity-30">🏔️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

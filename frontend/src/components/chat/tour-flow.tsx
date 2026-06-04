"use client";

import { useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

export interface TourData {
  days: string;
  people: string;
  regions: string[];
  budget: string;
}

interface TourFlowProps {
  onComplete: (data: TourData) => void;
  onCancel: () => void;
  plan: Location[];
}

const TOTAL_STEPS = 4;

const PEOPLE_OPTIONS = [
  { value: "Yolg'iz",  emoji: "🚶" },
  { value: "Juft",     emoji: "👫" },
  { value: "Oila",     emoji: "👨‍👩‍👧" },
  { value: "Guruh",    emoji: "👥" },
];

const BUDGET_OPTIONS = [
  { value: "Tejamkor", emoji: "💚", desc: "$30–60/kun" },
  { value: "O'rta",    emoji: "💛", desc: "$60–150/kun" },
  { value: "Premium",  emoji: "💜", desc: "$150+/kun" },
];

const UZ_REGIONS = [
  "Toshkent", "Samarqand", "Buxoro", "Xorazm (Xiva)",
  "Farg'ona", "Namangan", "Andijon", "Qashqadaryo",
  "Surxondaryo", "Navoiy", "Jizzax", "Sirdaryo",
];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-all duration-400",
            i < step
              ? "bg-teal-500"
              : i === step - 1
              ? "bg-teal-400"
              : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

export function TourFlow({ onComplete, onCancel, plan }: TourFlowProps) {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [regions, setRegions] = useState<string[]>(() =>
    plan.map((l) => l.city).filter((c) => UZ_REGIONS.includes(c))
  );
  const [budget, setBudget] = useState("");

  function toggleRegion(r: string) {
    setRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleComplete();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleComplete() {
    onComplete({ days, people, regions, budget });
  }

  const canProceed =
    (step === 1 && days.trim().length > 0) ||
    (step === 2 && people !== "") ||
    (step === 3 && regions.length > 0) ||
    (step === 4 && budget !== "");

  return (
    <div
      className={cn(
        "rounded-2xl border border-teal-500/30 bg-card",
        "p-4 mx-1 animate-fade-up shadow-lg"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Qadam {step} / {TOTAL_STEPS}
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            Tur rejasi yaratish
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <ProgressBar step={step} />

      {/* Steps */}
      <div className="mt-4 min-h-[140px] animate-fade-in">

        {/* Step 1: Days */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              🗓️ Necha kun sayohat qilmoqchisiz?
            </p>
            <input
              autoFocus
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Masalan: 7"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border border-border bg-muted",
                "text-foreground text-sm placeholder:text-muted-foreground",
                "outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30",
                "transition-all"
              )}
            />
            <p className="text-xs text-muted-foreground">
              O'zbekiston uchun ideal: 7–14 kun
            </p>
          </div>
        )}

        {/* Step 2: People */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              👥 Necha kishi bilan borasiz?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PEOPLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeople(opt.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm",
                    "transition-all duration-200 active:scale-95",
                    people === opt.value
                      ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                      : "bg-muted border-border text-foreground hover:border-teal-500/30"
                  )}
                >
                  <span className="text-base">{opt.emoji}</span>
                  <span className="font-medium">{opt.value}</span>
                  {people === opt.value && (
                    <Check className="w-3.5 h-3.5 ml-auto text-teal-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Regions */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              📍 Qaysi viloyatlarni ziyorat qilasiz?
            </p>
            {plan.length > 0 && (
              <p className="text-xs text-teal-400/80">
                ✓ Rejangizdan {regions.length} ta joy oldindan belgilandi
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {UZ_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRegion(r)}
                  className={cn(
                    "px-2.5 py-1 rounded-full border text-xs",
                    "transition-all duration-150 active:scale-95",
                    regions.includes(r)
                      ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                      : "bg-muted border-border text-muted-foreground hover:border-teal-500/30"
                  )}
                >
                  {regions.includes(r) ? "✓ " : ""}
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              💰 Byudjet darajangiz?
            </p>
            <div className="space-y-2">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm",
                    "transition-all duration-200 active:scale-95",
                    budget === opt.value
                      ? "bg-teal-500/15 border-teal-500/50 text-teal-400"
                      : "bg-muted border-border text-foreground hover:border-teal-500/30"
                  )}
                >
                  <span className="text-base">{opt.emoji}</span>
                  <span className="font-medium">{opt.value}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {opt.desc}
                  </span>
                  {budget === opt.value && (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <button
          onClick={back}
          disabled={step === 1}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            step === 1
              ? "text-muted-foreground/40 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          Orqaga
        </button>

        <button
          onClick={next}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold",
            "transition-all duration-200 active:scale-95",
            canProceed
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {step === TOTAL_STEPS ? "Reja yaratish" : "Keyingi"}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

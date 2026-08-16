import { Ambulance, Flame, Shield, AlertTriangle, Info, type LucideIcon } from "lucide-react";

// Single source of truth — this list used to be defined separately in
// Services.tsx and Profile.tsx, which could silently drift (one updated,
// the other not). Translated labels live under the "services" i18n
// section; both call sites already read from there.
export interface EmergencyNumber {
  Icon: LucideIcon;
  key: "emergency_ambulance" | "emergency_fire" | "emergency_police" | "emergency_gas" | "emergency_tourism";
  number: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { Icon: Ambulance,     key: "emergency_ambulance", number: "103" },
  { Icon: Flame,         key: "emergency_fire",      number: "101" },
  { Icon: Shield,        key: "emergency_police",    number: "102" },
  { Icon: AlertTriangle, key: "emergency_gas",       number: "104" },
  { Icon: Info,          key: "emergency_tourism",   number: "1219" },
];

import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Bot, LayoutGrid, User, Phone, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";

const TABS = [
  { route: "/home",      Icon: Home,       label: "Asosiy" },
  { route: "/locations", Icon: MapPin,     label: "Joylar" },
  { route: "/chat",      Icon: Bot,        label: "AI Yordamchi", isAI: true },
  { route: "/services",  Icon: LayoutGrid, label: "Xizmatlar" },
  { route: "/profile",   Icon: User,       label: "Profil" },
];
const EMERGENCY = [
  { icon: "🚔", label: "Politsiya", number: "1003" },
  { icon: "🚑", label: "Tez yordam", number: "103" },
  { icon: "📞", label: "Turistik yordam", number: "1182" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, plan, theme, toggleTheme } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 z-40 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--sidebar-border)] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0 shadow-teal-sm">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-[var(--foreground)]">MR</span>
          <span className="text-teal-500">TOUR</span>
          <span className="text-[var(--muted-foreground)] font-normal text-sm">.UZ</span>
        </span>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-[var(--sidebar-border)] shrink-0">
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 w-full group"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-teal-500 to-teal-600 shrink-0 shadow-teal-sm">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0 text-left flex-1">
              <p className="font-semibold text-sm text-[var(--foreground)] truncate leading-tight">
                {user.name} {user.surname}
              </p>
              {plan.length > 0 ? (
                <p className="text-[11px] text-teal-400 mt-0.5">{plan.length} joy rejada</p>
              ) : (
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Profil</p>
              )}
            </div>
          </button>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--foreground)]">Mehmon</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">Kirish uchun bosing</p>
            </div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {TABS.map(({ route, Icon, label, isAI }) => {
          const active =
            pathname === route || (route !== "/home" && pathname.startsWith(route));

          if (isAI) {
            return (
              <button
                key={route}
                onClick={() => navigate(route)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-teal-500/25 bg-gradient-to-r from-teal-600/15 to-teal-500/8 hover:from-teal-600/25 hover:to-teal-500/15 transition-all my-1"
              >
                <span
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 2px 12px rgba(13,148,136,.4)" }}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="text-sm font-semibold text-teal-400">{label}</span>
              </button>
            );
          }

          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative",
                active
                  ? "bg-teal-500/10 text-teal-400"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-400 rounded-full" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-teal-400" : "text-[var(--muted-foreground)]"
                )}
              />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[var(--sidebar-border)] shrink-0 space-y-4">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Mavzu</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--muted)] border border-[var(--border)] hover:border-teal-500/30 transition-all text-xs font-medium"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[var(--foreground)]">Kunduz</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[var(--foreground)]">Tun</span>
              </>
            )}
          </button>
        </div>

        {/* Emergency */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold flex items-center gap-1 mb-2">
            <Phone className="w-3 h-3" /> Favqulodda
          </p>
          <div className="space-y-0.5">
            {EMERGENCY.map((e) => (
              <a
                key={e.number}
                href={"tel:" + e.number}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <span>{e.icon}</span>
                  {e.label}
                </span>
                <span className="font-mono font-bold text-teal-400">{e.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

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
    <aside className="fixed left-0 top-0 h-screen w-60 z-40 flex flex-col bg-[var(--card)] border-r border-[var(--border)]">
      <div className="flex items-center px-5 h-16 border-b border-[var(--border)] shrink-0">
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-[var(--foreground)]">MR</span>
          <span className="text-teal-500">TOUR</span>
          <span className="text-[var(--muted-foreground)] font-normal text-base">.UZ</span>
        </span>
      </div>
      <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-teal-500 to-teal-600 shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-[var(--foreground)] truncate">{user.name} {user.surname}</p>
              {plan.length > 0 && <p className="text-[10px] text-teal-400">● {plan.length} joy rejada</p>}
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/profile")} className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-xl shrink-0">👤</div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--foreground)]">Mehmon</p>
              <p className="text-xs text-[var(--muted-foreground)]">Kirish uchun bosing</p>
            </div>
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {TABS.map(({ route, Icon, label, isAI }) => {
          const active = pathname === route || (route !== "/home" && pathname.startsWith(route));
          if (isAI) return (
            <button key={route} onClick={() => navigate(route)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-600/20 to-teal-500/10 hover:from-teal-600/30 transition-all">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0" style={{boxShadow:"0 2px 12px rgba(13,148,136,.4)"}}>
                <Icon className="w-4 h-4 text-white" />
              </span>
              <span className="text-sm font-semibold text-teal-400">{label}</span>
            </button>
          );
          return (
            <button key={route} onClick={() => navigate(route)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
                active ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border-transparent")}>
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-teal-400" : "text-[var(--muted-foreground)]")} />
              <span className="text-sm font-medium">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-[var(--border)] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--muted-foreground)]">Tema</span>
          <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium flex items-center gap-1">
            <Phone className="w-3 h-3" /> Favqulodda
          </p>
          {EMERGENCY.map(e => (
            <a key={e.number} href={"tel:" + e.number} className="flex items-center justify-between px-2 py-1 rounded-lg text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
              <span>{e.icon} {e.label}</span>
              <span className="font-mono font-semibold text-teal-400/80">{e.number}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

import { useNavigate } from "react-router-dom";

// Shared shell for /privacy and /terms — same header/footer treatment as
// the public Landing page (these need to work for guests, logged-in
// users, and Google's own OAuth-verification crawler alike, so they
// deliberately don't use MainLayout's app shell/sidebar). Kept as a
// static, non-authenticated route on purpose.
export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="app-bg min-h-dvh">
      <header className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-[var(--border)]">
        <button onClick={() => navigate("/")} className="active:opacity-70 transition-opacity">
          <img src="/img/logo-l.svg" alt="trova" className="h-7 w-auto dark:hidden" />
          <img src="/img/logo-d.svg" alt="trova" className="h-7 w-auto hidden dark:block" />
        </button>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
        >
          Open the App
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mb-2">
          {title}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-10">Last updated: {lastUpdated}</p>

        {/* Prose styling: consistent H2 rhythm, comfortable line length
            (max-w-2xl on the whole page), and bullet lists that don't
            crowd — the same card-free, quiet-typography treatment as a
            manual/help article rather than a dense legal wall of text. */}
        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--foreground)]/90 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mb-2.5 [&_p]:mb-3 [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-[var(--foreground)]/85">
          {children}
        </div>
      </main>

      <footer className="px-5 sm:px-8 py-8 border-t border-[var(--border)] mt-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <button onClick={() => navigate("/privacy")} className="hover:text-indigo-400 transition-colors">Privacy Policy</button>
            <button onClick={() => navigate("/terms")} className="hover:text-indigo-400 transition-colors">Terms of Service</button>
          </div>
          {/* Not a real mailto — no support inbox actually exists behind
              one yet. Left as visible placeholder text (not a link) so
              it's obviously something to fill in before launch, rather
              than a dead/fake contact that looks functional. */}
          <span className="text-sm text-[var(--muted-foreground)]/70 italic">
            [PLACEHOLDER: support email]
          </span>
        </div>
        <p className="text-center text-[10px] text-[var(--muted-foreground)]/60 mt-6">
          © {new Date().getFullYear()} trova — mrforce.uz tomonidan ishlab chiqildi
        </p>
      </footer>
    </div>
  );
}

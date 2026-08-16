import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ISO 3166-1 alpha-2 code + English name. English names only, not per-
// interface-language translations — translating ~190 country names
// accurately across all 6 app languages is its own dedicated dataset/
// maintenance burden, not something to improvise inline here; English is
// what every major booking/travel app defaults to regardless of UI
// language for exactly that reason.
const COUNTRIES: { code: string; name: string }[] = [
  ["UZ","Uzbekistan"],["KZ","Kazakhstan"],["KG","Kyrgyzstan"],["TJ","Tajikistan"],["TM","Turkmenistan"],
  ["RU","Russia"],["US","United States"],["GB","United Kingdom"],["DE","Germany"],["FR","France"],
  ["IT","Italy"],["ES","Spain"],["PT","Portugal"],["NL","Netherlands"],["BE","Belgium"],
  ["CH","Switzerland"],["AT","Austria"],["SE","Sweden"],["NO","Norway"],["DK","Denmark"],
  ["FI","Finland"],["PL","Poland"],["CZ","Czechia"],["SK","Slovakia"],["HU","Hungary"],
  ["RO","Romania"],["BG","Bulgaria"],["GR","Greece"],["TR","Turkey"],["UA","Ukraine"],
  ["BY","Belarus"],["MD","Moldova"],["GE","Georgia"],["AM","Armenia"],["AZ","Azerbaijan"],
  ["IE","Ireland"],["IS","Iceland"],["HR","Croatia"],["RS","Serbia"],["SI","Slovenia"],
  ["EE","Estonia"],["LV","Latvia"],["LT","Lithuania"],["CN","China"],["JP","Japan"],
  ["KR","South Korea"],["IN","India"],["PK","Pakistan"],["BD","Bangladesh"],["ID","Indonesia"],
  ["MY","Malaysia"],["SG","Singapore"],["TH","Thailand"],["VN","Vietnam"],["PH","Philippines"],
  ["MN","Mongolia"],["AF","Afghanistan"],["IR","Iran"],["IQ","Iraq"],["SA","Saudi Arabia"],
  ["AE","United Arab Emirates"],["QA","Qatar"],["KW","Kuwait"],["IL","Israel"],["JO","Jordan"],
  ["LB","Lebanon"],["EG","Egypt"],["MA","Morocco"],["DZ","Algeria"],["TN","Tunisia"],
  ["ZA","South Africa"],["NG","Nigeria"],["KE","Kenya"],["ET","Ethiopia"],["GH","Ghana"],
  ["CA","Canada"],["MX","Mexico"],["BR","Brazil"],["AR","Argentina"],["CL","Chile"],
  ["CO","Colombia"],["PE","Peru"],["VE","Venezuela"],["AU","Australia"],["NZ","New Zealand"],
  ["LU","Luxembourg"],["MT","Malta"],["CY","Cyprus"],["AL","Albania"],["MK","North Macedonia"],
  ["BA","Bosnia and Herzegovina"],["ME","Montenegro"],["XK","Kosovo"],
].map(([code, name]) => ({ code, name }));

// Regional-indicator flag emoji were tried here initially, but Windows
// without color-emoji font support renders them as literal two-letter
// text ("US", "ES"...) instead of a flag — the exact same failure mode
// already documented and avoided in Profile.tsx's language list. A
// deliberate monoline code chip instead: it never has a "did this render
// or not" ambiguity, and matches the rest of the app's icon language.
function CountryCode({ code }: { code: string }) {
  return (
    <span className="shrink-0 text-[10px] font-bold tracking-wide text-[var(--muted-foreground)] bg-[var(--muted)] rounded px-1.5 py-0.5">
      {code}
    </span>
  );
}

export function CountrySelect({
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  skipLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  skipLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  // Radix's Dialog traps focus inside its own content container — a node
  // portaled straight to document.body would sit outside that boundary,
  // and Radix yanks focus back in the instant anything outside it is
  // focused (this is how RegisterTab uses this component, via AuthModal).
  // The modal is small and never has competing transformed siblings
  // though, so it never needed the portal fix in the first place — only
  // escape to a body portal when this ISN'T inside a Radix dialog.
  const [inDialog, setInDialog] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.name === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  // The panel used to be a plain `absolute` child of this field — fine on
  // its own, but this component sits inside pages full of framer-motion
  // elements (tab pills, animated panels) that create their own stacking
  // contexts. Depending on DOM order those could paint on top of a merely
  // `z-30` sibling, so the panel would render *behind* page chrome further
  // down the screen (reported: the tab bar cutting across the country
  // list). Rendering it into a portal at `document.body` with a fixed
  // position computed from the trigger's own rect sidesteps the whole
  // stacking-context question — same pattern this app already uses for
  // every other overlay (modals, the command palette).
  function updateCoords() {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setCoords({ top: r.bottom + 6, left: r.left, width: r.width });
  }

  useEffect(() => {
    if (!open) return;
    setInDialog(!!rootRef.current?.closest('[role="dialog"]'));
    updateCoords();
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("resize", updateCoords);
    // `true` — captures scrolling inside nested containers too, not just
    // the window (the panel/settings card this lives in is its own
    // scroll area on most screens).
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  return (
    <div className="space-y-1" ref={rootRef}>
      <label className="text-xs font-medium text-[var(--muted-foreground)]">{label}</label>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-[var(--input-bg)] text-sm text-left",
            "border-[var(--input-border)] outline-none transition-colors",
            // The search input right below already carries its own focus
            // ring once open — highlighting this trigger too stacked two
            // green boxes on top of each other. The chevron flip already
            // communicates "open" on its own.
            open && "border-indigo-500/40"
          )}
        >
          {selected ? (
            <>
              <CountryCode code={selected.code} />
              <span className="flex-1 text-[var(--foreground)]">{selected.name}</span>
            </>
          ) : (
            <span className="flex-1 text-[var(--muted-foreground)]">{placeholder}</span>
          )}
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label={skipLabel}
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={cn("w-4 h-4 text-[var(--muted-foreground)] transition-transform shrink-0", open && "rotate-180")} />
        </button>

        {open && (() => {
          const panel = (
            <div
              ref={dropdownRef}
              style={inDialog ? undefined : { position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
              className={cn(
                "z-[100] rounded-xl border border-[var(--input-border)] bg-[var(--modal)] shadow-[var(--shadow-modal)] overflow-hidden",
                inDialog && "absolute mt-1.5 w-full"
              )}
            >
              <div className="p-2 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-2 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-[var(--muted-foreground)] text-center">—</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { onChange(c.name); setOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--muted)] transition-colors",
                        value === c.name ? "text-indigo-400 font-semibold" : "text-[var(--foreground)]"
                      )}
                    >
                      <CountryCode code={c.code} />
                      {c.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
          // Inside a Radix dialog, rendering in place (no portal) keeps the
          // panel within the dialog's focus-trap boundary — the modal is
          // small with nothing that would compete for stacking, so the
          // original inline behaviour was never actually broken there.
          return inDialog ? panel : createPortal(panel, document.body);
        })()}
      </div>
    </div>
  );
}

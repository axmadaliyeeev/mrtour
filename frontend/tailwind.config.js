/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs:  "400px",
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Brand palette v4 — imported from a 21st.dev / shadcn theme.
        //
        // These three keys shadow Tailwind's own indigo/gold/purple so that
        // every pre-existing bg-indigo-500 / text-gold-400 class in the app
        // re-skins at once, without touching hundreds of call sites. They
        // are NOT actually indigo or gold — the names are legacy.
        //
        // indigo = the theme's emerald primary.
        //
        // The ramp is shifted one step darker than Tailwind's stock emerald,
        // for a measured accessibility reason. The app paints primary buttons
        // with `bg-indigo-500 text-white`, and Tailwind classes are static —
        // they can't flip the text colour per theme the way the source theme
        // does (it pairs light-mode #059669 with white text, but dark-mode
        // #10b981 with near-black text). With 500 = #10b981, white-on-button
        // measures 2.54:1, a clear WCAG failure.
        //
        // Anchoring 500 to the theme's LIGHT primary (#059669) instead lifts
        // that to 3.77:1, and the `hover:bg-indigo-600` step (#047857) to
        // 5.48:1, which clears AA outright. #10b981 stays in the ramp at 400,
        // which is where it is actually wanted: `text-indigo-400` on a dark
        // card measures 6.78:1.
        indigo: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#10b981", // emerald-500 — bright, for text/icons on dark
          500: "#059669", // theme light primary — button fills
          600: "#047857", // hover step, AA-compliant with white text
          700: "#065f46",
          800: "#064e3b",
          900: "#053a2c",
          950: "#022c22",
        },
        // gold/purple = teal, the secondary contrast accent (ratings,
        // premium marks, the route-curve motif). Distinct from the emerald
        // primary but in the same cool family, so the two never clash.
        gold: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        purple: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
      },
      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      scale: {
        102: "1.02",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      animation: {
        "fade-up":      "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":      "fadeIn 0.2s ease forwards",
        "slide-in":     "slideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":     "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity:"0", transform:"translateY(12px)" }, to: { opacity:"1", transform:"translateY(0)" } },
        fadeIn:  { from: { opacity:"0" }, to: { opacity:"1" } },
        slideIn: { from: { opacity:"0", transform:"translateX(-8px)" }, to: { opacity:"1", transform:"translateX(0)" } },
        scaleIn: { from: { opacity:"0", transform:"scale(0.95)" }, to: { opacity:"1", transform:"scale(1)" } },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
        400: "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "card":       "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover": "0 8px 30px -4px rgb(0 0 0 / 0.12), 0 4px 8px -2px rgb(0 0 0 / 0.06)",
        "card-dark":  "0 1px 3px 0 rgb(0 0 0 / 0.4)",
        "indigo-glow":  "0 0 20px -4px rgb(16 185 129 / 0.5)",
        "indigo-sm":    "0 2px 8px -2px rgb(16 185 129 / 0.4)",
      },
    },
  },
  plugins: [],
};

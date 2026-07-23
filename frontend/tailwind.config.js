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
        // Brand palette v3 — "trova": mono-green system, no gold anywhere in
        // the UI (gold is reserved for the logo only, per spec). Emerald
        // Green (#50C878) is the sole interactive/accent color on both
        // themes; the second scale ("gold"/"purple" keys kept for minimal
        // diff — every existing bg-gold-*/text-gold-* class re-skins to
        // this mint tone) is a Mint-Whisper-derived contrast tone used for
        // ratings/favorites/premium points, distinct from but harmonious
        // with the emerald accent. Overrides Tailwind's indigo/purple so
        // every existing class re-skins app-wide.
        indigo: {
          50:  "#effcf6",
          100: "#d7f7e7",
          200: "#aeeece",
          300: "#7fe0ae",
          400: "#5ed393",
          500: "#50c878", // Emerald Green — exact brand accent
          600: "#38a860",
          700: "#2a8049",
          800: "#1f5f38",
          900: "#17452a",
          950: "#0b2718",
        },
        gold: {
          50:  "#e9f7f3",
          100: "#c9ebe2",
          200: "#93d7c5",
          300: "#5fbfa8",
          400: "#38a68c",
          500: "#218f76", // mint-teal contrast tone (was gold pre-v3), deepened for pop
          600: "#19735e",
          700: "#155c4b",
          800: "#11473b",
          900: "#0d362e",
          950: "#071e19",
        },
        purple: {
          50:  "#e9f7f3",
          100: "#c9ebe2",
          200: "#93d7c5",
          300: "#5fbfa8",
          400: "#38a68c",
          500: "#218f76",
          600: "#19735e",
          700: "#155c4b",
          800: "#145446",
          900: "#103f35",
          950: "#08211c",
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
        "indigo-glow":  "0 0 20px -4px rgb(80 200 120 / 0.5)",
        "indigo-sm":    "0 2px 8px -2px rgb(80 200 120 / 0.4)",
      },
    },
  },
  plugins: [],
};

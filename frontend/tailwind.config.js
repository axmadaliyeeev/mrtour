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
        // Brand palette — "Karvon Premium": deep emerald jewel-tone teal
        // paired with a warm antique-gold accent. Overrides Tailwind's
        // indigo/purple so every existing class re-skins app-wide.
        indigo: {
          50:  "#eefdf9",
          100: "#d3faf0",
          200: "#a3f2e0",
          300: "#5fe3cc",
          400: "#25c8b3",
          500: "#0aab98",
          600: "#07897b",
          700: "#096d64",
          800: "#0c5750",
          900: "#0e4843",
          950: "#04292a",
        },
        gold: {
          50:  "#fdf9ec",
          100: "#f9edc7",
          200: "#f3da8f",
          300: "#edc158",
          400: "#e6ab35",
          500: "#d4901f",
          600: "#b57117",
          700: "#8f5417",
          800: "#754419",
          900: "#63391a",
          950: "#391d0b",
        },
        purple: {
          50:  "#fdf9ec",
          100: "#f9edc7",
          200: "#f3da8f",
          300: "#edc158",
          400: "#e6ab35",
          500: "#d4901f",
          600: "#b57117",
          700: "#8f5417",
          800: "#754419",
          900: "#63391a",
          950: "#391d0b",
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
        "indigo-glow":  "0 0 20px -4px rgb(15 181 163 / 0.5)",
        "indigo-sm":    "0 2px 8px -2px rgb(15 181 163 / 0.4)",
      },
    },
  },
  plugins: [],
};

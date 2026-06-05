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
      colors: {},
      fontFamily: {
        sans: ["Sora", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
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
        "indigo-glow":  "0 0 20px -4px rgb(99 102 241 / 0.5)",
        "indigo-sm":    "0 2px 8px -2px rgb(99 102 241 / 0.4)",
      },
    },
  },
  plugins: [],
};

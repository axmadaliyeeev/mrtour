/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: { 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488" },
      },
      fontFamily: { sans: ["Sora", "sans-serif"] },
      animation: {
        "fade-up": "fadeUp 0.3s ease forwards",
        "fade-in": "fadeIn 0.2s ease forwards",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

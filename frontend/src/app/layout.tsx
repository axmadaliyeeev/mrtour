import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MRTOUR.UZ — O'zbekiston AI Sayohat Yordamchisi",
  description:
    "Claude AI bilan shaxsiy tur rejalash, 8 UNESCO joylar, restoranlar va gidlar.",
  keywords: ["uzbekistan", "travel", "tourism", "AI", "samarqand", "bukhara", "khiva"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#080e1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MRTOUR.UZ — O'zbekiston AI Sayohat Yordamchisi",
  description: "Claude AI bilan shaxsiy tur rejalash, 8 UNESCO joy, restoranlar va gidlar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning needed because next-themes changes class after SSR
    <html lang="uz" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="mrtour-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

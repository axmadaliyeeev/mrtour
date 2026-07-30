import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import Landing from "@/pages/Landing";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Home from "@/pages/Home";
import Locations from "@/pages/Locations";
import LocationDetail from "@/pages/LocationDetail";
import Chat from "@/pages/Chat";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import Uzbekistan from "@/pages/Uzbekistan";
import SavedPlaces from "@/pages/SavedPlaces";
import { useAppStore } from "@/store";

function ThemeApplier() {
  const { theme, lang } = useAppStore();
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("trova-theme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}

// Empty string is a safe default when VITE_GOOGLE_CLIENT_ID isn't set
// (e.g. a fresh local checkout before Google credentials exist) — the
// provider just won't be able to issue a real sign-in, which surfaces
// as the Google button failing gracefully rather than the whole app
// crashing at boot over a missing env var for an optional feature.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeApplier />
      <AuthModal />
      <CommandPalette />
      <Routes>
        {/* Always renders — a marketing/landing homepage that stays reachable
            regardless of session state (the same pattern most SaaS sites
            use: "/" is the public page, the dashboard lives at its own
            path). Landing itself adapts its header/CTAs for an already-
            signed-in visitor instead of the route silently redirecting
            them away — the previous redirect-based gate was exactly why
            the landing page appeared to "disappear" once a session (or
            the old, over-eagerly-persisted guest flag) existed: any
            visit to "/" from a browser that had ever logged in bounced
            straight to /home with no way to see it again. */}
        <Route path="/" element={<Landing />} />
        {/* Static, public, unauthenticated — deliberately outside
            MainLayout (no sidebar/app-shell) since Google's OAuth
            verification crawler and logged-out visitors both need to
            reach these without hitting any auth gate. */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />
        <Route element={<MainLayout />}>
          <Route path="/home"          element={<Home />} />
          <Route path="/locations"     element={<Locations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/uzbekistan"    element={<Uzbekistan />} />
          <Route path="/saved"         element={<SavedPlaces />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

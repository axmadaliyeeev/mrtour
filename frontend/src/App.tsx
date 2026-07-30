import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Locations from "@/pages/Locations";
import LocationDetail from "@/pages/LocationDetail";
import Chat from "@/pages/Chat";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import Uzbekistan from "@/pages/Uzbekistan";
import SavedPlaces from "@/pages/SavedPlaces";
import { useAppStore } from "@/store";

// "/" is the pre-login marketing page for guests — but returning users
// (already logged in, or who already picked "Continue as Guest" before)
// shouldn't see it again on every visit, so it redirects straight into
// the app for them instead. Reads the store reactively, so a successful
// login/register *while already on this route* (modal stays open over
// the landing page) flips this and redirects immediately without the
// user needing to navigate manually.
function LandingGate() {
  const { isLoggedIn, hasEnteredApp } = useAppStore();
  if (isLoggedIn || hasEnteredApp) return <Navigate to="/home" replace />;
  return <Landing />;
}

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

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeApplier />
      <AuthModal />
      <CommandPalette />
      <Routes>
        <Route path="/" element={<LandingGate />} />
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
  );
}

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
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

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeApplier />
      <AuthModal />
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
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

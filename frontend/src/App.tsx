import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthModal } from "@/components/auth/AuthModal";
import Home from "@/pages/Home";
import Locations from "@/pages/Locations";
import LocationDetail from "@/pages/LocationDetail";
import Chat from "@/pages/Chat";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import { useAppStore } from "@/store";

function ThemeApplier() {
  const { theme } = useAppStore();
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("mrtour-theme", theme);
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeApplier />
      <AuthModal />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/home"          element={<Home />} />
          <Route path="/locations"     element={<Locations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/profile"       element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

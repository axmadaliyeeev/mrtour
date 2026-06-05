"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AuthModal } from "@/components/auth/auth-modal";

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainLayout>{children}</MainLayout>
      <AuthModal />
    </>
  );
}

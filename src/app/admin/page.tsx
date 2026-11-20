import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanelGate } from "@/features/admin/components/AdminPanelGate";

export const metadata: Metadata = {
  title: "Panel de Administración",
  description: "Gestión privada de turnos de El Patio Barbería.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0E0D0C] font-mono text-xs uppercase tracking-[0.22em] text-[#8A7F72]">
          Cargando panel...
        </div>
      }
    >
      <AdminPanelGate />
    </Suspense>
  );
}

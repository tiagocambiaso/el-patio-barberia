import { desc } from "drizzle-orm";
import { db } from "@/db";
import { turnos } from "@/db/schema";
import { isAdminAuthenticated } from "@/features/admin/lib/session";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import {
  AdminDashboard,
  type AdminTurnoRow,
} from "@/features/admin/components/AdminDashboard";

export async function AdminPanelGate() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  const rows = await db
    .select({
      id: turnos.id,
      serviceId: turnos.serviceId,
      serviceName: turnos.serviceName,
      priceArs: turnos.priceArs,
      durationMinutes: turnos.durationMinutes,
      barberId: turnos.barberId,
      barberName: turnos.barberName,
      dayId: turnos.dayId,
      dayLabel: turnos.dayLabel,
      shiftLabel: turnos.shiftLabel,
      timeSlot: turnos.timeSlot,
      clientName: turnos.clientName,
      clientPhone: turnos.clientPhone,
      status: turnos.status,
      createdAt: turnos.createdAt,
    })
    .from(turnos)
    .orderBy(desc(turnos.createdAt))
    .limit(200);

  const serializedRows: AdminTurnoRow[] = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));

  return <AdminDashboard turnos={serializedRows} />;
}

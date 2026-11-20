"use server";

import { and, desc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { turnos } from "@/db/schema";
import { BARBERS, DAY_OPTIONS, SERVICES, TIME_SHIFTS } from "@/lib/constants";
import { buildBookingWhatsAppUrl } from "@/lib/booking";
import { generateBookingCode } from "@/features/turnos/code";
import {
  createTurnoSchema,
  type CreateTurnoInput,
} from "@/features/turnos/schema";

export interface TurnoSummary {
  id: number;
  code: string;
  serviceName: string;
  priceArs: number;
  durationMinutes: number;
  barberId: string;
  barberName: string;
  dayId: string;
  dayLabel: string;
  shiftLabel: string;
  timeSlot: string;
  clientName: string;
  status: string;
  createdAt: Date;
}

export type CreateTurnoResult =
  | {
      ok: true;
      code: string;
      turno: TurnoSummary;
      whatsappUrl: string;
    }
  | {
      ok: false;
      error: string;
      slotConflict?: boolean;
      fieldErrors?: Partial<Record<keyof CreateTurnoInput, string[]>>;
    };

const validBarberIds = new Set<string>(BARBERS.map((b) => b.id));
const validDayIds = new Set<string>(DAY_OPTIONS.map((d) => d.id));

function getPgErrorDetails(error: unknown): {
  code?: string;
  constraint?: string;
} {
  if (!error || typeof error !== "object") return {};
  const err = error as {
    code?: string;
    constraint?: string;
    cause?: { code?: string; constraint?: string };
  };
  return {
    code: err.code ?? err.cause?.code,
    constraint: err.constraint ?? err.cause?.constraint,
  };
}

export async function getOccupiedSlotsAction(
  barberId: string,
  dayId: string,
): Promise<string[]> {
  if (!validBarberIds.has(barberId) || !validDayIds.has(dayId)) {
    return [];
  }

  try {
    const rows = await db
      .select({ timeSlot: turnos.timeSlot })
      .from(turnos)
      .where(
        and(
          eq(turnos.barberId, barberId),
          eq(turnos.dayId, dayId),
          ne(turnos.status, "cancelado"),
        ),
      );

    return rows.map((row) => row.timeSlot);
  } catch (err) {
    console.error("[getOccupiedSlotsAction] Error consultando horarios:", err);
    return [];
  }
}

export async function createTurnoAction(
  input: CreateTurnoInput,
): Promise<CreateTurnoResult> {
  const parsed = createTurnoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá los datos del turno antes de confirmar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const service = SERVICES.find((s) => s.id === data.serviceId);
  const barber = BARBERS.find((b) => b.id === data.barberId);
  const day = DAY_OPTIONS.find((d) => d.id === data.dayId);
  const shift = TIME_SHIFTS.find((sh) => sh.id === data.shiftId);

  if (!service || !barber || !day || !shift) {
    return {
      ok: false,
      error: "No pudimos validar las opciones elegidas. Intentá nuevamente.",
    };
  }

  try {
    const existing = await db
      .select({ id: turnos.id })
      .from(turnos)
      .where(
        and(
          eq(turnos.barberId, barber.id),
          eq(turnos.dayId, day.id),
          eq(turnos.timeSlot, data.timeSlot),
          ne(turnos.status, "cancelado"),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        ok: false,
        slotConflict: true,
        error: "Ese horario ya está ocupado. Elegí otro horario disponible.",
      };
    }

    const maxAttempts = 5;
    let inserted: TurnoSummary | undefined;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const bookingCode = generateBookingCode();
      try {
        const [row] = await db
          .insert(turnos)
          .values({
            code: bookingCode,
            serviceId: service.id,
            serviceName: service.name,
            priceArs: service.priceArs,
            durationMinutes: service.durationMinutes,
            barberId: barber.id,
            barberName: barber.name,
            dayId: day.id,
            dayLabel: day.label,
            shiftLabel: shift.label,
            timeSlot: data.timeSlot,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            status: "confirmado",
          })
          .returning({
            id: turnos.id,
            code: turnos.code,
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
            status: turnos.status,
            createdAt: turnos.createdAt,
          });

        if (row && row.code) {
          inserted = { ...row, code: row.code };
          break;
        }
      } catch (insertErr) {
        const pgErr = getPgErrorDetails(insertErr);
        if (pgErr.code === "23505") {
          if (pgErr.constraint === "turnos_code_unique") {
            continue;
          }
          return {
            ok: false,
            slotConflict: true,
            error:
              "Ese horario acaba de ser reservado por otro cliente. Elegí otro disponible.",
          };
        }
        throw insertErr;
      }
    }

    if (!inserted) {
      return {
        ok: false,
        error: "No se pudo generar un código único para tu turno. Intentá nuevamente.",
      };
    }

    const whatsappUrl = buildBookingWhatsAppUrl({
      bookingCode: inserted.code,
      serviceName: inserted.serviceName,
      priceArs: inserted.priceArs,
      durationMinutes: inserted.durationMinutes,
      barberName: inserted.barberName,
      dayLabel: inserted.dayLabel,
      shiftLabel: inserted.shiftLabel,
      timeSlot: inserted.timeSlot,
      clientName: inserted.clientName,
    });

    revalidatePath("/admin");

    return {
      ok: true,
      code: inserted.code,
      turno: inserted,
      whatsappUrl,
    };
  } catch (err) {
    console.error("[createTurnoAction] Error al guardar turno en Neon:", err);
    return {
      ok: false,
      error: "Hubo un problema al registrar el turno. Intentá de nuevo en unos segundos.",
    };
  }
}

export async function listRecentTurnos(limit = 10): Promise<TurnoSummary[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  const rows = await db
    .select({
      id: turnos.id,
      code: turnos.code,
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
      status: turnos.status,
      createdAt: turnos.createdAt,
    })
    .from(turnos)
    .orderBy(desc(turnos.createdAt))
    .limit(safeLimit);

  return rows.map((row) => ({
    ...row,
    code: row.code ?? `PT-${String(row.id).padStart(4, "0")}`,
  }));
}

"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { turnos } from "@/db/schema";
import {
  cancelarTurnoClienteSchema,
  type CancelarTurnoClienteInput,
} from "@/features/turnos/schemas/cancelarTurnoSchema";

export interface CancelledTurnoInfo {
  id: number;
  code: string;
  barberId: string;
  dayId: string;
  dayLabel: string;
  timeSlot: string;
  serviceName: string;
}

export type CancelarTurnoClienteResult =
  | {
      ok: true;
      cancelled: CancelledTurnoInfo;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof CancelarTurnoClienteInput, string[]>>;
    };

export async function cancelarTurnoClienteAction(
  input: CancelarTurnoClienteInput,
): Promise<CancelarTurnoClienteResult> {
  const parsed = cancelarTurnoClienteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá el código de reserva y el teléfono ingresados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { code, clientPhone } = parsed.data;

  try {
    const [updated] = await db
      .update(turnos)
      .set({ status: "cancelado" })
      .where(
        and(
          eq(turnos.code, code),
          eq(turnos.clientPhone, clientPhone),
          inArray(turnos.status, ["confirmado", "pendiente"]),
        ),
      )
      .returning({
        id: turnos.id,
        code: turnos.code,
        barberId: turnos.barberId,
        dayId: turnos.dayId,
        dayLabel: turnos.dayLabel,
        timeSlot: turnos.timeSlot,
        serviceName: turnos.serviceName,
      });

    if (!updated || !updated.code) {
      return {
        ok: false,
        error:
          "No encontramos un turno activo que coincida con ese código y teléfono.",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      ok: true,
      cancelled: {
        ...updated,
        code: updated.code,
      },
    };
  } catch (err) {
    console.error("[cancelarTurnoClienteAction] Error al cancelar:", err);
    return {
      ok: false,
      error: "No pudimos cancelar el turno en este momento. Intentá nuevamente.",
    };
  }
}

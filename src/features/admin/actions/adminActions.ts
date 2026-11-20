"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { turnos } from "@/db/schema";
import {
  ADMIN_SESSION_COOKIE,
  isAdminAuthenticated,
  verifyAdminPinValue,
} from "@/features/admin/lib/session";

const pinSchema = z
  .string()
  .trim()
  .min(4, "El PIN debe tener al menos 4 dígitos.")
  .max(16, "El PIN no puede superar los 16 dígitos.")
  .regex(/^\d+$/, "El PIN debe contener únicamente números.");

const updateEstadoSchema = z.object({
  turnoId: z.number().int().positive("ID de turno inválido."),
  nuevoEstado: z.enum(["confirmado", "completado", "cancelado"]),
});

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function verificarPinAction(pin: string): Promise<AdminActionResult> {
  const parsed = pinSchema.safeParse(pin);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "PIN inválido.",
    };
  }

  const verification = verifyAdminPinValue(parsed.data);
  if (!verification.configured) {
    return {
      ok: false,
      error: "Falta configurar ADMIN_PIN en las variables de entorno del servidor.",
    };
  }

  if (!verification.ok || !verification.token) {
    return {
      ok: false,
      error: "PIN incorrecto. Intentá nuevamente.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, verification.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function cerrarSesionAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  revalidatePath("/admin");
}

export async function actualizarEstadoTurnoAction(
  turnoId: number,
  nuevoEstado: "confirmado" | "completado" | "cancelado",
): Promise<AdminActionResult> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return {
      ok: false,
      error: "Sesión expirada. Volvé a ingresar el PIN.",
    };
  }

  const parsed = updateEstadoSchema.safeParse({ turnoId, nuevoEstado });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const updated = await db
      .update(turnos)
      .set({ status: parsed.data.nuevoEstado })
      .where(eq(turnos.id, parsed.data.turnoId))
      .returning({ id: turnos.id });

    if (updated.length === 0) {
      return {
        ok: false,
        error: "No se encontró el turno indicado.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[actualizarEstadoTurnoAction] Error:", err);
    return {
      ok: false,
      error: "No se pudo actualizar el estado del turno.",
    };
  }
}

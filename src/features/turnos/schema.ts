import { z } from "zod";
import { BARBERS, DAY_OPTIONS, SERVICES, TIME_SHIFTS } from "@/lib/constants";
import { normalizePhone } from "@/features/turnos/code";

const serviceIds = new Set<string>(SERVICES.map((s) => s.id));
const barberIds = new Set<string>(BARBERS.map((b) => b.id));
const dayIds = new Set<string>(DAY_OPTIONS.map((d) => d.id));
const shiftIds = new Set<string>(TIME_SHIFTS.map((sh) => sh.id));
const validSlotsByShift = new Map<string, Set<string>>(
  TIME_SHIFTS.map((sh) => [sh.id, new Set<string>(sh.slots)]),
);

export const createTurnoSchema = z
  .object({
    serviceId: z
      .string()
      .refine((val) => serviceIds.has(val), { message: "Servicio inválido." }),
    barberId: z
      .string()
      .refine((val) => barberIds.has(val), { message: "Barbero inválido." }),
    dayId: z
      .string()
      .refine((val) => dayIds.has(val), { message: "Día inválido." }),
    shiftId: z
      .string()
      .refine((val) => shiftIds.has(val), { message: "Franja horaria inválida." }),
    timeSlot: z.string().min(4, "Horario inválido."),
    clientName: z
      .string()
      .trim()
      .min(2, "Ingresá tu nombre (al menos 2 caracteres).")
      .max(60, "El nombre no puede superar los 60 caracteres."),
    clientPhone: z
      .string()
      .trim()
      .transform((val) => normalizePhone(val))
      .refine((val) => val.length >= 6 && val.length <= 16, {
        message: "Ingresá un teléfono válido (ej. 291 555-1234).",
      }),
  })
  .superRefine((data, ctx) => {
    const allowedSlots = validSlotsByShift.get(data.shiftId);
    if (!allowedSlots || !allowedSlots.has(data.timeSlot)) {
      ctx.addIssue({
        code: "custom",
        path: ["timeSlot"],
        message: "El horario seleccionado no corresponde a la franja elegida.",
      });
    }
  });

export type CreateTurnoInput = z.input<typeof createTurnoSchema>;

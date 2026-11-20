import { z } from "zod";
import { normalizePhone } from "@/features/turnos/code";

export const cancelarTurnoClienteSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^PT-[A-Z0-9]{4}$/, "Ingresá un código válido con formato PT-XXXX."),
  clientPhone: z
    .string()
    .trim()
    .transform((val) => normalizePhone(val))
    .refine((val) => val.length >= 6 && val.length <= 16, {
      message: "Ingresá el mismo teléfono que usaste al reservar.",
    }),
});

export type CancelarTurnoClienteInput = z.input<
  typeof cancelarTurnoClienteSchema
>;

import { BARBERSHOP, formatArs } from "@/lib/constants";

export const SELECT_SERVICE_EVENT = "elpatio:select-service";

export interface WhatsAppBookingPayload {
  bookingCode?: string | null;
  serviceName: string;
  priceArs: number;
  durationMinutes: number;
  barberName: string;
  dayLabel: string;
  shiftLabel: string;
  timeSlot: string;
  clientName?: string;
}

export function buildBookingWhatsAppUrl(payload: WhatsAppBookingPayload): string {
  const greeting = payload.clientName?.trim()
    ? `Hola El Patio! Soy ${payload.clientName.trim()}.`
    : "Hola El Patio!";

  const lines = [
    greeting,
    "Quisiera confirmar mi turno con estos datos:",
    "",
    ...(payload.bookingCode
      ? [`• Código de reserva: ${payload.bookingCode}`]
      : []),
    `• Servicio: ${payload.serviceName} (${formatArs(payload.priceArs)} · ${payload.durationMinutes} min)`,
    `• Barbero: ${payload.barberName}`,
    `• Día preferido: ${payload.dayLabel}`,
    `• Franja horaria: ${payload.shiftLabel} — ${payload.timeSlot} hs`,
    "",
    "¿Tienen disponibilidad?",
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${BARBERSHOP.whatsappNumber}?text=${text}`;
}

export function buildDirectWhatsAppUrl(customMessage?: string): string {
  const message =
    customMessage ??
    "Hola El Patio! Quería hacer una consulta sobre turnos y servicios.";
  return `https://wa.me/${BARBERSHOP.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function dispatchSelectService(serviceId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string>(SELECT_SERVICE_EVENT, { detail: serviceId }),
  );
  const target = document.getElementById("turnos");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

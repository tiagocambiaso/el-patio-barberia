export interface ServiceItem {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly subtitle: string;
  readonly description: string;
  readonly priceArs: number;
  readonly durationMinutes: number;
  readonly includes: readonly string[];
  readonly featured?: boolean;
}

export interface BarberItem {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly specialty: string;
}

export interface ScheduleItem {
  readonly days: string;
  readonly hours: string;
  readonly closed?: boolean;
}

export interface TimeShift {
  readonly id: string;
  readonly label: string;
  readonly slots: readonly string[];
}

export interface OpeningHoursSpec {
  readonly dayOfWeek: readonly string[];
  readonly opens: string;
  readonly closes: string;
}

export const BARBERSHOP = {
  name: "El Patio Barbería",
  shortName: "El Patio",
  monogram: "EP",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elpatiobarberia.com.ar",
  tagline: "Cortes prolijos, buena charla y tiempo para vos.",
  founded: "2019",
  city: "Bahía Blanca",
  province: "Buenos Aires",
  country: "AR",
  address: "Zelarrayán 428",
  neighborhood: "Centro · Bahía Blanca",
  zoneReference: "A dos cuadras de Plaza Rivadavia, casi esquina Rodríguez.",
  postalCodeNumber: "B8000",
  postalCode: "B8000 Bahía Blanca, Buenos Aires",
  coordinates: "38°42'54\"S · 62°15'58\"W",
  geo: {
    latitude: -38.715,
    longitude: -62.2661,
  },
  priceRange: "$$",
  whatsappNumber: "5492914823190",
  whatsappDisplay: "+54 9 291 482-3190",
  instagramHandle: "@elpatiobarberia.bb",
  instagramUrl: "https://instagram.com/elpatiobarberia.bb",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Zelarrayan+428,+Bahia+Blanca,+Buenos+Aires",
  courtesyNote: "Café de especialidad o vermut de cortesía en cada turno.",
  openingHoursSpecification: [
    {
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "20:30",
    },
    {
      dayOfWeek: ["Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
  ] as readonly OpeningHoursSpec[],
} as const;

export const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Turnos", href: "#turnos" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const SCHEDULE: readonly ScheduleItem[] = [
  { days: "Martes a Viernes", hours: "10:00 — 20:30" },
  { days: "Sábados", hours: "09:30 — 19:00" },
  { days: "Domingos y Lunes", hours: "Cerrado", closed: true },
] as const;

export const SERVICES: readonly ServiceItem[] = [
  {
    id: "corte-clasico",
    index: "01",
    name: "Corte Clásico",
    subtitle: "Tijera, estructura y terminación a navaja",
    description:
      "Diagnóstico capilar, corte a tijera o máquina según tu fisonomía, lavado relajante y peinado final con productos de acabado mate o brillo natural.",
    priceArs: 16000,
    durationMinutes: 40,
    includes: ["Asesoramiento de estilo", "Lavado y masaje capilar", "Terminación a navaja"],
  },
  {
    id: "fade-perfilado",
    index: "02",
    name: "Fade & Perfilado",
    subtitle: "Degradado de precisión y líneas limpias",
    description:
      "Skin fade, taper o degradado progresivo trabajado con transición milimétrica, contornos definidos a navaja y perfilado prolijo de nuca y patillas.",
    priceArs: 18500,
    durationMinutes: 45,
    includes: ["Degradado personalizado", "Contornos a navaja", "Styling profesional"],
  },
  {
    id: "barba-ritual",
    index: "03",
    name: "Barba Ritual",
    subtitle: "Toalla caliente, navaja y aceites botánicos",
    description:
      "Diseño y rebaje de barba con compresas calientes aromatizadas, espuma tradicional, afeitado al ras en contornos, toalla fría y bálsamo hidratante.",
    priceArs: 13000,
    durationMinutes: 30,
    includes: ["Toalla caliente con eucalipto", "Perfilado a navaja", "Aceite y bálsamo natural"],
  },
  {
    id: "combo-completo",
    index: "04",
    name: "Combo Completo",
    subtitle: "La experiencia integral de El Patio",
    description:
      "Corte clásico o fade a elección combinado con el Ritual de Barba completo, lavado energizante, toalla caliente y terminación de sastrería capilar.",
    priceArs: 26000,
    durationMinutes: 75,
    includes: ["Corte o Fade a elección", "Barba Ritual completa", "Lavado + bebida de cortesía"],
    featured: true,
  },
] as const;

export const BARBERS: readonly BarberItem[] = [
  {
    id: "indistinto",
    name: "Cualquier barbero",
    role: "Primer turno disponible",
    specialty: "Todo el equipo",
  },
  {
    id: "martin",
    name: "Martín Echeverría",
    role: "Fundador · Master Barber",
    specialty: "Tijera y cortes clásicos",
  },
  {
    id: "lucas",
    name: "Lucas Salgado",
    role: "Senior Barber",
    specialty: "Fade y perfilado",
  },
  {
    id: "tomas",
    name: "Tomás Ferreyra",
    role: "Barber & Grooming",
    specialty: "Barba ritual y navaja",
  },
] as const;

export const DAY_OPTIONS = [
  { id: "hoy", label: "Hoy" },
  { id: "manana", label: "Mañana" },
  { id: "esta-semana", label: "Esta semana" },
  { id: "sabado", label: "Este sábado" },
] as const;

export const TIME_SHIFTS: readonly TimeShift[] = [
  {
    id: "manana",
    label: "Mañana",
    slots: ["10:00", "11:00", "12:00"],
  },
  {
    id: "tarde",
    label: "Tarde",
    slots: ["14:30", "15:30", "16:30", "17:30"],
  },
  {
    id: "ultima-hora",
    label: "Última hora",
    slots: ["18:30", "19:30"],
  },
] as const;

/**
 * Deterministic ARS currency formatter (avoids SSR/CSR Intl hydration mismatches).
 */
export function formatArs(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${formatted}`;
}

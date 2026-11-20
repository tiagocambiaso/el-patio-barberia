import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const turnos = pgTable(
  "turnos",
  {
    id: serial("id").primaryKey(),
    code: text("code").unique(),
    serviceId: text("service_id").notNull(),
    serviceName: text("service_name").notNull(),
    priceArs: integer("price_ars").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    barberId: text("barber_id").notNull(),
    barberName: text("barber_name").notNull(),
    dayId: text("day_id").notNull().default("hoy"),
    dayLabel: text("day_label").notNull(),
    shiftLabel: text("shift_label").notNull(),
    timeSlot: text("time_slot").notNull(),
    clientName: text("client_name").notNull(),
    clientPhone: text("client_phone"),
    status: text("status").notNull().default("confirmado"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("turnos_barber_day_slot_active_idx")
      .on(table.barberId, table.dayId, table.timeSlot)
      .where(sql`${table.status} <> 'cancelado'`),
  ],
);

export type Turno = typeof turnos.$inferSelect;
export type NewTurno = typeof turnos.$inferInsert;

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  BARBERS,
  BARBERSHOP,
  DAY_OPTIONS,
  SERVICES,
  formatArs,
} from "@/lib/constants";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/Icons";
import {
  actualizarEstadoTurnoAction,
  cerrarSesionAdminAction,
} from "@/features/admin/actions/adminActions";

export interface AdminTurnoRow {
  id: number;
  serviceId: string;
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
  clientPhone: string | null;
  status: string;
  createdAt: string;
}

interface AdminDashboardProps {
  turnos: AdminTurnoRow[];
}

const servicePriceById = new Map<string, number>(
  SERVICES.map((service) => [service.id, service.priceArs]),
);

function buildClientWhatsAppHref(phone: string, turno: AdminTurnoRow): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("54") ? digits : `549${digits}`;
  const msg = encodeURIComponent(
    `Hola ${turno.clientName}, te escribimos de ${BARBERSHOP.name} por tu turno de ${turno.serviceName} (${turno.dayLabel} ${turno.timeSlot} hs).`,
  );
  return `https://wa.me/${normalized}?text=${msg}`;
}

function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case "completado":
      return "border-[#6B8E6E]/45 bg-[#6B8E6E]/15 text-[#A7C9AA]";
    case "confirmado":
      return "border-[#C28852]/50 bg-[#C28852]/15 text-[#E3B483]";
    case "cancelado":
      return "border-[#F2EBE1]/15 bg-[#1B1917] text-[#7D7368] line-through";
    default:
      return "border-[#D8A472]/40 bg-[#D8A472]/10 text-[#F2EBE1]";
  }
}

export function AdminDashboard({ turnos }: AdminDashboardProps) {
  const router = useRouter();
  const [barberFilter, setBarberFilter] = useState<string>("todos");
  const [dayFilter, setDayFilter] = useState<string>("todos");
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();

  const filteredTurnos = turnos.filter((turno) => {
    const matchesBarber =
      barberFilter === "todos" || turno.barberId === barberFilter;
    const matchesDay = dayFilter === "todos" || turno.dayId === dayFilter;
    return matchesBarber && matchesDay;
  });

  const pendientesCount = filteredTurnos.filter(
    (t) => t.status === "pendiente" || t.status === "confirmado",
  ).length;

  const completadosCount = filteredTurnos.filter(
    (t) => t.status === "completado",
  ).length;

  const facturacionEstimada = filteredTurnos.reduce((acc, turno) => {
    if (turno.status === "cancelado") return acc;
    const price = servicePriceById.get(turno.serviceId) ?? turno.priceArs;
    return acc + price;
  }, 0);

  const handleStatusChange = (
    turnoId: number,
    nuevoEstado: "confirmado" | "completado" | "cancelado",
  ) => {
    setActionError(null);
    setUpdatingId(turnoId);

    startUpdateTransition(async () => {
      const result = await actualizarEstadoTurnoAction(turnoId, nuevoEstado);
      setUpdatingId(null);
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await cerrarSesionAdminAction();
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F2EBE1]">
      {/* Top Bar */}
      <header className="border-b border-[#F2EBE1]/10 bg-[#12100E]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center border border-[#C28852]/45 bg-[#161412] font-serif text-base font-semibold tracking-wider text-[#C28852]">
              {BARBERSHOP.monogram}
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C28852]">
                Panel de Administración
              </p>
              <h1 className="font-serif text-2xl font-medium text-[#F2EBE1]">
                {BARBERSHOP.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 border border-[#F2EBE1]/15 bg-[#161412] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#C4B9A9] transition-colors hover:border-[#C28852]/60 hover:text-[#F2EBE1]"
            >
              <span>Sitio público</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border border-[#C28852]/50 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#D8A472] transition-colors hover:bg-[#C28852] hover:text-[#0E0D0C] disabled:opacity-60 cursor-pointer"
            >
              {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:px-8">
        {/* Metrics Cards */}
        <section aria-label="Métricas rápidas" className="grid gap-4 sm:grid-cols-3">
          <div className="border border-[#F2EBE1]/10 bg-[#141210] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
              Turnos pendientes / activos
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#F2EBE1]">
              {pendientesCount}
            </p>
          </div>

          <div className="border border-[#F2EBE1]/10 bg-[#141210] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
              Turnos completados
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#A7C9AA]">
              {completadosCount}
            </p>
          </div>

          <div className="border border-[#C28852]/35 bg-[#171411] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C28852]">
              Facturación estimada (ARS)
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#C28852]">
              {formatArs(facturacionEstimada)}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A7F72]">
              Excluye turnos cancelados
            </p>
          </div>
        </section>

        {/* Filters */}
        <section
          aria-label="Filtros de agenda"
          className="space-y-4 border border-[#F2EBE1]/10 bg-[#141210] p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Barber filter */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                Filtrar por barbero
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBarberFilter("todos")}
                  aria-pressed={barberFilter === "todos"}
                  className={
                    barberFilter === "todos"
                      ? "border border-[#C28852] bg-[#C28852] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0E0D0C] cursor-pointer"
                      : "border border-[#F2EBE1]/15 bg-[#0E0D0C] px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/35 cursor-pointer"
                  }
                >
                  Todos
                </button>
                {BARBERS.map((barber) => {
                  const active = barberFilter === barber.id;
                  return (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => setBarberFilter(barber.id)}
                      aria-pressed={active}
                      className={
                        active
                          ? "border border-[#C28852] bg-[#C28852] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0E0D0C] cursor-pointer"
                          : "border border-[#F2EBE1]/15 bg-[#0E0D0C] px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/35 cursor-pointer"
                      }
                    >
                      {barber.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day filter */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                Filtrar por día
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDayFilter("todos")}
                  aria-pressed={dayFilter === "todos"}
                  className={
                    dayFilter === "todos"
                      ? "border border-[#C28852] bg-[#C28852] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0E0D0C] cursor-pointer"
                      : "border border-[#F2EBE1]/15 bg-[#0E0D0C] px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/35 cursor-pointer"
                  }
                >
                  Todos
                </button>
                {DAY_OPTIONS.map((day) => {
                  const active = dayFilter === day.id;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setDayFilter(day.id)}
                      aria-pressed={active}
                      className={
                        active
                          ? "border border-[#C28852] bg-[#C28852] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0E0D0C] cursor-pointer"
                          : "border border-[#F2EBE1]/15 bg-[#0E0D0C] px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/35 cursor-pointer"
                      }
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {actionError ? (
          <p
            role="alert"
            className="border border-[#E59866]/40 bg-[#E59866]/10 px-4 py-3 text-xs text-[#F2EBE1]"
          >
            {actionError}
          </p>
        ) : null}

        {/* Turnos Table */}
        <section aria-label="Listado de turnos">
          <div className="flex items-center justify-between pb-4">
            <h2 className="font-serif text-2xl font-medium text-[#F2EBE1]">
              Agenda de turnos
            </h2>
            <span className="font-mono text-xs text-[#8A7F72]">
              {filteredTurnos.length} registros
            </span>
          </div>

          {filteredTurnos.length === 0 ? (
            <div className="border border-[#F2EBE1]/10 bg-[#141210] px-6 py-14 text-center">
              <p className="text-sm text-[#8A7F72]">
                No hay turnos registrados para los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#F2EBE1]/10 bg-[#141210]">
              <table className="w-full min-w-195 border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#F2EBE1]/10 bg-[#11100E] font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A7F72]">
                    <th className="px-4 py-3.5">Cliente</th>
                    <th className="px-4 py-3.5">Servicio</th>
                    <th className="px-4 py-3.5">Barbero</th>
                    <th className="px-4 py-3.5">Día / Hora</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EBE1]/8">
                  {filteredTurnos.map((turno) => {
                    const rowBusy = isUpdating && updatingId === turno.id;
                    const price =
                      servicePriceById.get(turno.serviceId) ?? turno.priceArs;

                    return (
                      <tr
                        key={turno.id}
                        className="transition-colors hover:bg-[#191613]"
                      >
                        <td className="px-4 py-4 align-top">
                          <p className="font-medium text-[#F2EBE1]">
                            {turno.clientName}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-[#8A7F72]">
                            #{turno.id}
                          </p>
                          {turno.clientPhone ? (
                            <a
                              href={buildClientWhatsAppHref(
                                turno.clientPhone,
                                turno,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Escribir por WhatsApp a ${turno.clientName}`}
                              className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs text-[#C28852] transition-colors hover:text-[#D8A472]"
                            >
                              <WhatsAppIcon className="h-3.5 w-3.5" />
                              <span>{turno.clientPhone}</span>
                            </a>
                          ) : (
                            <span className="mt-1 block text-xs text-[#6E6459]">
                              Sin teléfono
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="font-medium text-[#F2EBE1]">
                            {turno.serviceName}
                          </p>
                          <p className="mt-0.5 font-mono text-xs tabular-nums text-[#C28852]">
                            {formatArs(price)} · {turno.durationMinutes} min
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top text-[#C4B9A9]">
                          {turno.barberName}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="text-[#F2EBE1]">{turno.dayLabel}</p>
                          <p className="mt-0.5 font-mono text-xs tabular-nums text-[#8A7F72]">
                            {turno.shiftLabel} · {turno.timeSlot} hs
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span
                            className={`inline-block border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${getStatusBadgeStyle(turno.status)}`}
                          >
                            {turno.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-right">
                          <div className="inline-flex flex-wrap justify-end gap-2">
                            {turno.status !== "completado" &&
                            turno.status !== "cancelado" ? (
                              <button
                                type="button"
                                disabled={rowBusy}
                                onClick={() =>
                                  handleStatusChange(turno.id, "completado")
                                }
                                className="border border-[#6B8E6E]/60 bg-[#6B8E6E]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A7C9AA] transition-colors hover:bg-[#6B8E6E] hover:text-[#0E0D0C] disabled:opacity-50 cursor-pointer"
                              >
                                Completar
                              </button>
                            ) : null}

                            {turno.status !== "cancelado" ? (
                              <button
                                type="button"
                                disabled={rowBusy}
                                onClick={() =>
                                  handleStatusChange(turno.id, "cancelado")
                                }
                                className="border border-[#E59866]/45 bg-transparent px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#E59866] transition-colors hover:bg-[#E59866] hover:text-[#0E0D0C] disabled:opacity-50 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

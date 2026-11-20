"use client";

import { useEffect, useState, useTransition } from "react";
import {
  BARBERS,
  BARBERSHOP,
  DAY_OPTIONS,
  SERVICES,
  TIME_SHIFTS,
  formatArs,
} from "@/lib/constants";
import {
  SELECT_SERVICE_EVENT,
  buildBookingWhatsAppUrl,
} from "@/lib/booking";
import {
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import {
  createTurnoAction,
  getOccupiedSlotsAction,
  type TurnoSummary,
} from "@/features/turnos/actions";
import { normalizePhone } from "@/features/turnos/code";
import type { CancelledTurnoInfo } from "@/features/turnos/actions/cancelarTurnoAction";
import { CancelBookingPanel } from "@/features/turnos/components/CancelBookingPanel";

export function BookingSelector() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBERS[0].id);
  const [selectedDayId, setSelectedDayId] = useState<string>(DAY_OPTIONS[0].id);
  const [selectedShiftId, setSelectedShiftId] = useState<string>(TIME_SHIFTS[1].id);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SHIFTS[1].slots[1]);
  const [slotsState, setSlotsState] = useState<{
    key: string | null;
    slots: string[];
  }>({ key: null, slots: [] });
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    turno: TurnoSummary;
    whatsappUrl: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentSlotKey = `${selectedBarberId}:${selectedDayId}`;
  const isLoadingSlots = slotsState.key !== currentSlotKey;
  const occupiedSlots = isLoadingSlots ? [] : slotsState.slots;

  // Listen for service selection dispatched from the Servicios section (isolated via @/lib/booking)
  useEffect(() => {
    function handleSelectService(event: Event) {
      const customEvent = event as CustomEvent<string>;
      const match = SERVICES.find((s) => s.id === customEvent.detail);
      if (match) {
        setSelectedServiceId(match.id);
        setConfirmedBooking(null);
      }
    }

    window.addEventListener(SELECT_SERVICE_EVENT, handleSelectService);
    return () => {
      window.removeEventListener(SELECT_SERVICE_EVENT, handleSelectService);
    };
  }, []);

  // Fetch occupied time slots whenever barber or day changes
  useEffect(() => {
    let cancelled = false;
    const key = `${selectedBarberId}:${selectedDayId}`;

    getOccupiedSlotsAction(selectedBarberId, selectedDayId).then((slots) => {
      if (cancelled) return;
      setSlotsState({ key, slots });
      setSelectedSlot((current) => (slots.includes(current) ? "" : current));
    });

    return () => {
      cancelled = true;
    };
  }, [selectedBarberId, selectedDayId]);

  const selectedService =
    SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0];
  const selectedBarber =
    BARBERS.find((b) => b.id === selectedBarberId) ?? BARBERS[0];
  const selectedDay =
    DAY_OPTIONS.find((d) => d.id === selectedDayId) ?? DAY_OPTIONS[0];
  const selectedShift =
    TIME_SHIFTS.find((sh) => sh.id === selectedShiftId) ?? TIME_SHIFTS[0];

  const occupiedSet = new Set(occupiedSlots);
  const hasAvailableInShift = selectedShift.slots.some(
    (slot) => !occupiedSet.has(slot),
  );

  const handleShiftChange = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setConfirmedBooking(null);
    setErrorMessage(null);
    const shift = TIME_SHIFTS.find((sh) => sh.id === shiftId);
    if (shift) {
      const firstFree = shift.slots.find((slot) => !occupiedSet.has(slot)) ?? "";
      setSelectedSlot(firstFree);
    }
  };

  const previewWhatsappUrl = buildBookingWhatsAppUrl({
    serviceName: selectedService.name,
    priceArs: selectedService.priceArs,
    durationMinutes: selectedService.durationMinutes,
    barberName: selectedBarber.name,
    dayLabel: selectedDay.label,
    shiftLabel: selectedShift.label,
    timeSlot: selectedSlot || "A confirmar",
    clientName,
  });

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleClientCancelled = (cancelled: CancelledTurnoInfo) => {
    if (
      cancelled.barberId === selectedBarberId &&
      cancelled.dayId === selectedDayId
    ) {
      setSlotsState((prev) => ({
        key: currentSlotKey,
        slots: prev.slots.filter((slot) => slot !== cancelled.timeSlot),
      }));
    }
    if (confirmedBooking?.code === cancelled.code) {
      setConfirmedBooking(null);
    }
  };

  const handleConfirmBooking = () => {
    setErrorMessage(null);
    setNameError(null);
    setPhoneError(null);

    if (!selectedSlot) {
      setErrorMessage("Elegí un horario disponible para registrar tu turno.");
      return;
    }

    if (occupiedSet.has(selectedSlot)) {
      setErrorMessage("Ese horario ya está ocupado. Elegí otro disponible.");
      setSelectedSlot("");
      return;
    }

    if (clientName.trim().length < 2) {
      setNameError("Ingresá tu nombre para registrar el turno.");
      return;
    }

    if (normalizePhone(clientPhone).length < 6) {
      setPhoneError("Ingresá tu teléfono para poder gestionar o cancelar tu turno.");
      return;
    }

    const slotToBook = selectedSlot;

    startTransition(async () => {
      const result = await createTurnoAction({
        serviceId: selectedService.id,
        barberId: selectedBarber.id,
        dayId: selectedDay.id,
        shiftId: selectedShift.id,
        timeSlot: slotToBook,
        clientName,
        clientPhone,
      });

      if (!result.ok) {
        setErrorMessage(result.error);
        if (result.slotConflict) {
          setSlotsState((prev) => ({
            key: currentSlotKey,
            slots: prev.slots.includes(slotToBook)
              ? prev.slots
              : [...prev.slots, slotToBook],
          }));
          setSelectedSlot("");
        }
        if (result.fieldErrors?.clientName?.[0]) {
          setNameError(result.fieldErrors.clientName[0]);
        }
        if (result.fieldErrors?.clientPhone?.[0]) {
          setPhoneError(result.fieldErrors.clientPhone[0]);
        }
        return;
      }

      // Immediately reflect the booked slot in local state without needing F5
      setSlotsState((prev) => ({
        key: currentSlotKey,
        slots: prev.slots.includes(slotToBook)
          ? prev.slots
          : [...prev.slots, slotToBook],
      }));
      setSelectedSlot("");
      setCopiedCode(false);
      setConfirmedBooking({
        code: result.code,
        turno: result.turno,
        whatsappUrl: result.whatsappUrl,
      });

      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left Interactive Configurator */}
        <div className="space-y-10 lg:col-span-7">
          {/* Step 1: Service */}
          <fieldset>
            <legend className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#C28852]">
              <span>Paso 01</span>
              <span className="h-px w-8 bg-[#C28852]/40" />
              <span className="text-[#F2EBE1]">Elegí tu servicio</span>
            </legend>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((service) => {
                const active = service.id === selectedService.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setConfirmedBooking(null);
                    }}
                    aria-pressed={active}
                    className={
                      active
                        ? "flex flex-col justify-between border border-[#C28852] bg-[#1C1814] p-4 text-left transition-all cursor-pointer"
                        : "flex flex-col justify-between border border-[#F2EBE1]/12 bg-[#141210] p-4 text-left transition-all hover:border-[#F2EBE1]/30 cursor-pointer"
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif text-xl font-medium text-[#F2EBE1]">
                        {service.name}
                      </span>
                      <span
                        className={
                          active
                            ? "flex h-5 w-5 shrink-0 items-center justify-center border border-[#C28852] bg-[#C28852] text-[#0E0D0C]"
                            : "flex h-5 w-5 shrink-0 items-center justify-center border border-[#F2EBE1]/20"
                        }
                      >
                        {active ? <CheckIcon className="h-3.5 w-3.5" /> : null}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono text-xs tabular-nums">
                      <span className="text-[#C28852]">
                        {formatArs(service.priceArs)}
                      </span>
                      <span className="text-[#8A7F72]">
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2: Barber */}
          <fieldset>
            <legend className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#C28852]">
              <span>Paso 02</span>
              <span className="h-px w-8 bg-[#C28852]/40" />
              <span className="text-[#F2EBE1]">Elegí tu barbero</span>
            </legend>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BARBERS.map((barber) => {
                const active = barber.id === selectedBarber.id;
                return (
                  <button
                    key={barber.id}
                    type="button"
                    onClick={() => {
                      setSelectedBarberId(barber.id);
                      setConfirmedBooking(null);
                      setErrorMessage(null);
                    }}
                    aria-pressed={active}
                    className={
                      active
                        ? "flex items-start justify-between gap-3 border border-[#C28852] bg-[#1C1814] p-4 text-left transition-all cursor-pointer"
                        : "flex items-start justify-between gap-3 border border-[#F2EBE1]/12 bg-[#141210] p-4 text-left transition-all hover:border-[#F2EBE1]/30 cursor-pointer"
                    }
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F2EBE1]">
                        {barber.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8A7F72]">
                        {barber.specialty}
                      </p>
                    </div>
                    <span
                      className={
                        active
                          ? "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#C28852]"
                          : "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#F2EBE1]/25"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 3: Day & Time Slot */}
          <fieldset>
            <legend className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#C28852]">
              <span>Paso 03</span>
              <span className="h-px w-8 bg-[#C28852]/40" />
              <span className="text-[#F2EBE1]">Día y franja horaria</span>
            </legend>

            {/* Day pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {DAY_OPTIONS.map((day) => {
                const active = day.id === selectedDay.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      setSelectedDayId(day.id);
                      setConfirmedBooking(null);
                      setErrorMessage(null);
                    }}
                    aria-pressed={active}
                    className={
                      active
                        ? "border border-[#C28852] bg-[#C28852] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0E0D0C] transition-colors cursor-pointer"
                        : "border border-[#F2EBE1]/15 bg-[#141210] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/35 hover:text-[#F2EBE1] cursor-pointer"
                    }
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            {/* Shift tabs */}
            <div className="mt-5 grid grid-cols-3 border border-[#F2EBE1]/12 bg-[#141210]">
              {TIME_SHIFTS.map((shift) => {
                const active = shift.id === selectedShift.id;
                return (
                  <button
                    key={shift.id}
                    type="button"
                    onClick={() => handleShiftChange(shift.id)}
                    aria-pressed={active}
                    className={
                      active
                        ? "border-b-2 border-[#C28852] bg-[#1C1814] px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2EBE1] cursor-pointer"
                        : "border-b-2 border-transparent px-3 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#8A7F72] transition-colors hover:text-[#F2EBE1] cursor-pointer"
                    }
                  >
                    {shift.label}
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {selectedShift.slots.map((slot) => {
                const isOccupied = occupiedSet.has(slot);
                const active = !isOccupied && slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isOccupied || isLoadingSlots}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setConfirmedBooking(null);
                      setErrorMessage(null);
                    }}
                    aria-pressed={active}
                    aria-disabled={isOccupied || isLoadingSlots}
                    title={isOccupied ? "Horario ocupado" : `Elegir ${slot} hs`}
                    className={
                      isOccupied
                        ? "border border-[#F2EBE1]/8 bg-[#0E0D0C] px-4 py-2.5 font-mono text-xs tabular-nums text-[#5A5249] line-through cursor-not-allowed"
                        : active
                          ? "border border-[#C28852] bg-[#1C1814] px-4 py-2.5 font-mono text-xs font-medium tabular-nums text-[#C28852] transition-colors cursor-pointer"
                          : "border border-[#F2EBE1]/12 bg-[#141210] px-4 py-2.5 font-mono text-xs tabular-nums text-[#C4B9A9] transition-colors hover:border-[#F2EBE1]/30 hover:text-[#F2EBE1] disabled:opacity-50 cursor-pointer"
                    }
                  >
                    {slot} hs
                    {isOccupied ? <span className="sr-only"> (ocupado)</span> : null}
                  </button>
                );
              })}
            </div>

            {isLoadingSlots ? (
              <p className="mt-2.5 font-mono text-[11px] text-[#8A7F72]">
                Consultando disponibilidad...
              </p>
            ) : !hasAvailableInShift ? (
              <p className="mt-2.5 text-xs text-[#E59866]">
                No quedan horarios libres en esta franja. Probá otra franja, día o
                barbero.
              </p>
            ) : null}
          </fieldset>

          {/* Step 4: Client info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="booking-client-name"
                className="block font-mono text-[11px] uppercase tracking-[0.22em] text-[#C4B9A9]"
              >
                Tu nombre <span className="text-[#C28852]">*</span>
              </label>
              <input
                id="booking-client-name"
                type="text"
                required
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setNameError(null);
                }}
                placeholder="Ej. Santiago"
                maxLength={60}
                aria-invalid={Boolean(nameError)}
                className="mt-2.5 w-full border border-[#F2EBE1]/15 bg-[#141210] px-4 py-3 text-sm text-[#F2EBE1] placeholder:text-[#6E6459] focus:border-[#C28852] focus:outline-none"
              />
              {nameError ? (
                <p role="alert" className="mt-1.5 text-xs text-[#E59866]">
                  {nameError}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="booking-client-phone"
                className="block font-mono text-[11px] uppercase tracking-[0.22em] text-[#C4B9A9]"
              >
                Tu WhatsApp <span className="text-[#C28852]">*</span>
              </label>
              <input
                id="booking-client-phone"
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  setPhoneError(null);
                }}
                placeholder="Ej. 291 555-1234"
                maxLength={30}
                aria-invalid={Boolean(phoneError)}
                className="mt-2.5 w-full border border-[#F2EBE1]/15 bg-[#141210] px-4 py-3 text-sm text-[#F2EBE1] placeholder:text-[#6E6459] focus:border-[#C28852] focus:outline-none"
              />
              {phoneError ? (
                <p role="alert" className="mt-1.5 text-xs text-[#E59866]">
                  {phoneError}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Live Appointment Ticket */}
        <aside className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative border border-[#C28852]/35 bg-[#151310] p-7 sm:p-8">
            <span
              aria-hidden="true"
              className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-[#C28852]"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-[#C28852]"
            />

            <div className="flex items-center justify-between border-b border-[#F2EBE1]/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C28852]">
                  Resumen del turno
                </p>
                <p className="mt-1 font-serif text-2xl font-medium text-[#F2EBE1]">
                  {BARBERSHOP.name}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center border border-[#C28852]/40 font-serif text-sm font-semibold text-[#C28852]">
                {BARBERSHOP.monogram}
              </span>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EBE1]/12 pb-3.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A7F72]">
                  Servicio
                </dt>
                <dd className="text-right font-medium text-[#F2EBE1]">
                  {selectedService.name}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EBE1]/12 pb-3.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A7F72]">
                  Barbero
                </dt>
                <dd className="text-right font-medium text-[#F2EBE1]">
                  {selectedBarber.name}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EBE1]/12 pb-3.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A7F72]">
                  Día y horario
                </dt>
                <dd className="text-right font-mono text-xs tabular-nums text-[#F2EBE1]">
                  {selectedSlot
                    ? `${selectedDay.label} · ${selectedShift.label} (${selectedSlot} hs)`
                    : `${selectedDay.label} · Elegí un horario`}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EBE1]/12 pb-3.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A7F72]">
                  Duración estimada
                </dt>
                <dd className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-[#C4B9A9]">
                  <ClockIcon className="h-3.5 w-3.5 text-[#C28852]" />
                  <span>{selectedService.durationMinutes} minutos</span>
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 pt-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A7F72]">
                  Total estimado
                </dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums text-[#C28852]">
                  {formatArs(selectedService.priceArs)}{" "}
                  <span className="text-[11px] font-normal uppercase tracking-wider text-[#8A7F72]">
                    ARS
                  </span>
                </dd>
              </div>
            </dl>

            {errorMessage ? (
              <p
                role="alert"
                className="mt-5 border border-[#E59866]/40 bg-[#E59866]/10 px-4 py-3 text-xs text-[#F2EBE1]"
              >
                {errorMessage}
              </p>
            ) : null}

            {confirmedBooking ? (
              <div className="mt-6 border border-[#C28852]/50 bg-[#1C1814] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C28852]">
                  Turno confirmado
                </p>

                {/* Highlighted Booking Code + Copy button */}
                <div className="mt-3 flex items-center justify-between gap-3 border border-[#C28852]/40 bg-[#0E0D0C] px-4 py-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8A7F72]">
                      Código de reserva
                    </p>
                    <p className="mt-0.5 font-mono text-xl font-semibold tracking-[0.16em] text-[#C28852]">
                      {confirmedBooking.code}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(confirmedBooking.code)}
                    aria-label={`Copiar código de reserva ${confirmedBooking.code}`}
                    className="border border-[#F2EBE1]/18 bg-[#161412] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F2EBE1] transition-colors hover:border-[#C28852] hover:text-[#C28852] cursor-pointer"
                  >
                    {copiedCode ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#C4B9A9]">
                  Guardá este código junto a tu teléfono por si necesitás
                  cancelar el turno (
                  <strong className="text-[#F2EBE1]">
                    {confirmedBooking.turno.dayLabel} ·{" "}
                    {confirmedBooking.turno.timeSlot} hs
                  </strong>
                  ).
                </p>

                <a
                  href={confirmedBooking.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir WhatsApp con código ${confirmedBooking.code}`}
                  className="group mt-4 inline-flex w-full items-center justify-center gap-2 border border-[#C28852] bg-[#C28852] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Abrir WhatsApp</span>
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isPending || isLoadingSlots || !selectedSlot}
                aria-label={`Registrar y confirmar turno de ${selectedService.name} por WhatsApp`}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 border border-[#C28852] bg-[#C28852] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>
                  {isPending ? "Registrando turno..." : "Confirmar por WhatsApp"}
                </span>
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-relaxed text-[#8A7F72]">
              Registramos tu pedido en nuestra agenda y abrimos{" "}
              <a
                href={previewWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C4B9A9] underline decoration-[#C28852]/50 underline-offset-4 hover:text-[#F2EBE1]"
              >
                WhatsApp
              </a>{" "}
              con tu código y datos prearmados.
            </p>
          </div>
        </aside>
      </div>

      {/* Collapsible Self-Service Cancellation Block */}
      <CancelBookingPanel onCancelled={handleClientCancelled} />
    </div>
  );
}

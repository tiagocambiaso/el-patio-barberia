"use client";

import { useState, useTransition } from "react";
import {
  cancelarTurnoClienteAction,
  type CancelledTurnoInfo,
} from "@/features/turnos/actions/cancelarTurnoAction";

interface CancelBookingPanelProps {
  onCancelled: (cancelled: CancelledTurnoInfo) => void;
}

export function CancelBookingPanel({ onCancelled }: CancelBookingPanelProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<CancelledTurnoInfo | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setCodeError(null);
    setPhoneError(null);
    setSuccessInfo(null);

    startTransition(async () => {
      const result = await cancelarTurnoClienteAction({
        code,
        clientPhone,
      });

      if (!result.ok) {
        setErrorMessage(result.error);
        if (result.fieldErrors?.code?.[0]) {
          setCodeError(result.fieldErrors.code[0]);
        }
        if (result.fieldErrors?.clientPhone?.[0]) {
          setPhoneError(result.fieldErrors.clientPhone[0]);
        }
        return;
      }

      setSuccessInfo(result.cancelled);
      setCode("");
      setClientPhone("");
      onCancelled(result.cancelled);
    });
  };

  return (
    <div className="mt-12 border border-[#F2EBE1]/12 bg-[#141210]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="cancelar-turno-panel"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#191613] cursor-pointer"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C28852]">
            Autogestión de turnos
          </p>
          <p className="mt-1 font-serif text-xl font-medium text-[#F2EBE1]">
            ¿Ya tenés turno y necesitás cancelarlo?
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#F2EBE1]/15 font-mono text-sm text-[#C28852]"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div
          id="cancelar-turno-panel"
          className="border-t border-[#F2EBE1]/10 px-6 py-6"
        >
          <p className="text-xs leading-relaxed text-[#8A7F72]">
            Ingresá tu código de reserva (por ejemplo{" "}
            <span className="font-mono text-[#C4B9A9]">PT-7K4M</span>) y el
            mismo teléfono con el que reservaste. El horario se libera en el
            acto.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 grid gap-4 sm:grid-cols-12 sm:items-end"
          >
            <div className="sm:col-span-4">
              <label
                htmlFor="cancel-booking-code"
                className="block font-mono text-[11px] uppercase tracking-[0.2em] text-[#C4B9A9]"
              >
                Código de reserva
              </label>
              <input
                id="cancel-booking-code"
                type="text"
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCodeError(null);
                  setErrorMessage(null);
                }}
                placeholder="PT-XXXX"
                maxLength={10}
                aria-invalid={Boolean(codeError)}
                className="mt-2 w-full border border-[#F2EBE1]/15 bg-[#0E0D0C] px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-[#F2EBE1] placeholder:text-[#6E6459] focus:border-[#C28852] focus:outline-none"
              />
              {codeError ? (
                <p role="alert" className="mt-1.5 text-xs text-[#E59866]">
                  {codeError}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor="cancel-booking-phone"
                className="block font-mono text-[11px] uppercase tracking-[0.2em] text-[#C4B9A9]"
              >
                Teléfono registrado
              </label>
              <input
                id="cancel-booking-phone"
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  setPhoneError(null);
                  setErrorMessage(null);
                }}
                placeholder="Ej. 291 555-1234"
                maxLength={30}
                aria-invalid={Boolean(phoneError)}
                className="mt-2 w-full border border-[#F2EBE1]/15 bg-[#0E0D0C] px-4 py-3 text-sm text-[#F2EBE1] placeholder:text-[#6E6459] focus:border-[#C28852] focus:outline-none"
              />
              {phoneError ? (
                <p role="alert" className="mt-1.5 text-xs text-[#E59866]">
                  {phoneError}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center border border-[#E59866]/55 bg-[#E59866]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#E59866] transition-colors hover:bg-[#E59866] hover:text-[#0E0D0C] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isPending ? "Cancelando..." : "Cancelar turno"}
              </button>
            </div>
          </form>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-4 border border-[#E59866]/40 bg-[#E59866]/10 px-4 py-3 text-xs text-[#F2EBE1]"
            >
              {errorMessage}
            </p>
          ) : null}

          {successInfo ? (
            <div
              role="status"
              className="mt-4 border border-[#6B8E6E]/45 bg-[#6B8E6E]/12 px-4 py-3 text-xs text-[#D6E8D8]"
            >
              Listo: cancelamos tu turno{" "}
              <strong className="font-mono text-[#F2EBE1]">
                {successInfo.code}
              </strong>{" "}
              ({successInfo.serviceName} · {successInfo.dayLabel}{" "}
              {successInfo.timeSlot} hs). El horario ya volvió a quedar
              disponible.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

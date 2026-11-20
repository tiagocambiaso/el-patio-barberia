"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BARBERSHOP } from "@/lib/constants";
import { verificarPinAction } from "@/features/admin/actions/adminActions";

export function AdminLoginForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await verificarPinAction(pin);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPin("");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0E0D0C] px-6 py-16">
      <div className="relative w-full max-w-md border border-[#F2EBE1]/12 bg-[#141210] p-8 sm:p-10">
        <span
          aria-hidden="true"
          className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-[#C28852]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-[#C28852]"
        />

        <div className="flex items-center gap-3.5 border-b border-[#F2EBE1]/10 pb-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#C28852]/45 bg-[#161412] font-serif text-base font-semibold tracking-wider text-[#C28852]">
            {BARBERSHOP.monogram}
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C28852]">
              Acceso Privado
            </p>
            <h1 className="font-serif text-2xl font-medium text-[#F2EBE1]">
              {BARBERSHOP.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[#C4B9A9]">
          Ingresá el PIN de administración para gestionar los turnos y consultar
          la agenda diaria.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="admin-pin"
              className="block font-mono text-[11px] uppercase tracking-[0.22em] text-[#C4B9A9]"
            >
              PIN numérico
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              autoFocus
              required
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError(null);
              }}
              placeholder="••••"
              maxLength={16}
              className="mt-2.5 w-full border border-[#F2EBE1]/15 bg-[#0E0D0C] px-4 py-3.5 font-mono text-lg tracking-[0.35em] text-[#F2EBE1] placeholder:text-[#6E6459] focus:border-[#C28852] focus:outline-none"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="border border-[#E59866]/40 bg-[#E59866]/10 px-4 py-3 text-xs text-[#F2EBE1]"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || pin.length < 4}
            className="inline-flex w-full items-center justify-center border border-[#C28852] bg-[#C28852] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Verificando..." : "Ingresar al panel"}
          </button>
        </form>

        <div className="mt-7 border-t border-[#F2EBE1]/10 pt-5 text-center">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8A7F72] transition-colors hover:text-[#C28852]"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}

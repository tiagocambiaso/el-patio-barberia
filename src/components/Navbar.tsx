"use client";

import { useState } from "react";
import { BARBERSHOP, NAV_LINKS } from "@/lib/constants";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "@/components/Icons";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-[#F2EBE1]/10 bg-[#0E0D0C]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#inicio"
          className="group flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C28852]"
          aria-label={`${BARBERSHOP.name} — Ir al inicio`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#C28852]/45 bg-[#161412] font-serif text-base font-semibold tracking-wider text-[#C28852] transition-colors group-hover:border-[#C28852] group-hover:bg-[#C28852]/10">
            {BARBERSHOP.monogram}
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold tracking-wide text-[#F2EBE1]">
              {BARBERSHOP.shortName}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
              Barbería · Est. {BARBERSHOP.founded}
            </span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 md:flex lg:gap-10"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] text-[#C4B9A9] transition-colors hover:text-[#F2EBE1]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden shrink-0 items-center md:flex">
          <a
            href="#turnos"
            className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap border border-[#C28852] bg-[#C28852] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472] lg:px-5"
          >
            <span>Reservar turno</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#F2EBE1]/15 text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-[#F2EBE1]/10 bg-[#12100E] px-6 py-6 md:hidden"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-[#F2EBE1]/10 pb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#F2EBE1] transition-colors hover:text-[#C28852]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#turnos"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[#C28852] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0E0D0C] transition-colors hover:bg-[#D8A472]"
            >
              <span>Reservar turno</span>
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

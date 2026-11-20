import { BARBERSHOP, SCHEDULE } from "@/lib/constants";
import { ArrowUpRightIcon, MapPinIcon, ScissorsIcon } from "@/components/Icons";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#F2EBE1]/10 bg-[#0E0D0C]"
    >
      {/* Subtle warm editorial light wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-130 w-130 rounded-full bg-[#C28852]/8 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-20 h-90 w-90 rounded-full bg-[#8C5B32]/7 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2.5 border border-[#C28852]/35 bg-[#161412] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C28852]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C4B9A9]">
                {BARBERSHOP.city} · Centro · Est. {BARBERSHOP.founded}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="mt-7 font-serif text-5xl font-medium leading-[1.03] tracking-tight text-[#F2EBE1] sm:text-6xl lg:text-[4.35rem]">
              Un <span className="italic text-[#C28852]">buen corte</span>,
              hecho con tiempo.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#C4B9A9] sm:text-lg">
              En <strong className="font-medium text-[#F2EBE1]">{BARBERSHOP.name}</strong>{" "}
              hacemos cortes clásicos a tijera, fade bien pulido y barba a
              navaja con toalla caliente. Atendemos con turno en el centro de{" "}
              {BARBERSHOP.city}, sin esperas largas ni apuros.
            </p>

            {/* Primary CTAs */}
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#turnos"
                className="group inline-flex items-center justify-center gap-2.5 border border-[#C28852] bg-[#C28852] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E0D0C] transition-all hover:bg-[#D8A472] hover:border-[#D8A472]"
              >
                <span>Reservar turno</span>
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 border border-[#F2EBE1]/20 bg-transparent px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 hover:bg-[#161412]"
              >
                <span>Ver servicios y precios</span>
              </a>
            </div>

            {/* Editorial Metadata Strip */}
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#F2EBE1]/10 pt-8 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                  Dirección
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#F2EBE1]">
                  {BARBERSHOP.address}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                  Turnos
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#F2EBE1]">
                  Con reserva previa
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                  En la espera
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#F2EBE1]">
                  Café o vermut de cortesía
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Plate */}
          <div className="lg:col-span-5">
            <div className="relative border border-[#F2EBE1]/12 bg-[#141210] p-7 sm:p-9">
              {/* Decorative corner ticks */}
              <span
                aria-hidden="true"
                className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-[#C28852]"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-[#C28852]"
              />

              {/* Top plate header */}
              <div className="flex items-center justify-between border-b border-[#F2EBE1]/10 pb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C28852]">
                  Sillón N° 01 — El Patio
                </span>
                <ScissorsIcon className="h-4 w-4 text-[#C28852]" />
              </div>

              {/* Center Crest / Manifesto */}
              <div className="my-8 flex flex-col items-center border border-[#F2EBE1]/10 bg-[#0E0D0C] px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C28852]/50 bg-[#161412]">
                  <span className="font-serif text-2xl font-semibold tracking-widest text-[#C28852]">
                    {BARBERSHOP.monogram}
                  </span>
                </div>
                <p className="mt-5 font-serif text-2xl italic leading-snug text-[#F2EBE1]">
                  &ldquo;{BARBERSHOP.tagline}&rdquo;
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A7F72]">
                  {BARBERSHOP.coordinates}
                </p>
              </div>

              {/* Bottom quick facts */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#F2EBE1]/10 pb-3">
                  <span className="inline-flex items-center gap-2 text-[#8A7F72]">
                    <MapPinIcon className="h-3.5 w-3.5 text-[#C28852]" />
                    <span>Ubicación</span>
                  </span>
                  <span className="font-medium text-[#F2EBE1]">
                    {BARBERSHOP.address}, Centro
                  </span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[#8A7F72]">{SCHEDULE[0].days}</span>
                  <span className="font-mono tabular-nums text-[#F2EBE1]">
                    {SCHEDULE[0].hours}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7F72]">{SCHEDULE[1].days}</span>
                  <span className="font-mono tabular-nums text-[#F2EBE1]">
                    {SCHEDULE[1].hours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

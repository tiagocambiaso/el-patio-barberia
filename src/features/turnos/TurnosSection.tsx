import { BookingSelector } from "@/features/turnos/BookingSelector";

export function TurnosSection() {
  return (
    <section
      id="turnos"
      className="scroll-mt-20 border-b border-[#F2EBE1]/10 bg-[#0E0D0C] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#F2EBE1]/10 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#C28852]">
              02 / Reserva Directa
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#F2EBE1] sm:text-5xl">
              Armá tu turno en segundos.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#8A7F72]">
            Seleccioná servicio, barbero y franja horaria. Te derivamos directo
            a nuestro WhatsApp con el mensaje prearmado para confirmar sin
            vueltas.
          </p>
        </div>

        <div className="mt-12">
          <BookingSelector />
        </div>
      </div>
    </section>
  );
}

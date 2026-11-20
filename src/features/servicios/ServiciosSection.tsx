import { SERVICES, formatArs } from "@/lib/constants";
import { CheckIcon, ClockIcon } from "@/components/Icons";
import { SelectServiceButton } from "@/features/servicios/SelectServiceButton";

export function ServiciosSection() {
  return (
    <section
      id="servicios"
      className="scroll-mt-20 border-b border-[#F2EBE1]/10 bg-[#11100E] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#F2EBE1]/10 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#C28852]">
              01 / Carta de Servicios
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#F2EBE1] sm:text-5xl">
              Precisión en cada detalle.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#8A7F72]">
            Valores expresados en pesos argentinos (ARS). Todos los servicios
            incluyen diagnóstico previo y productos profesionales de terminación.
          </p>
        </div>

        {/* 2x2 Editorial Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className={
                service.featured
                  ? "relative flex flex-col justify-between border border-[#C28852]/45 bg-[#171411] p-7 transition-colors hover:border-[#C28852]/80 sm:p-9"
                  : "relative flex flex-col justify-between border border-[#F2EBE1]/10 bg-[#141210] p-7 transition-colors hover:border-[#F2EBE1]/25 sm:p-9"
              }
            >
              <div>
                {/* Top row: index + duration + badge */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#C28852]">
                      {service.index}
                    </span>
                    {service.featured ? (
                      <span className="border border-[#C28852]/40 bg-[#C28852]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D8A472]">
                        Más elegido
                      </span>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums text-[#8A7F72]">
                    <ClockIcon className="h-3.5 w-3.5 text-[#C28852]" />
                    <span>{service.durationMinutes} min</span>
                  </span>
                </div>

                {/* Title & Price */}
                <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-[#F2EBE1]/10 pb-5">
                  <div>
                    <h3 className="font-serif text-3xl font-medium text-[#F2EBE1]">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8A7F72]">
                      {service.subtitle}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-2xl font-medium tabular-nums text-[#F2EBE1]">
                      {formatArs(service.priceArs)}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A7F72]">
                      ARS
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-relaxed text-[#C4B9A9]">
                  {service.description}
                </p>

                {/* Included checklist */}
                <ul className="mt-6 space-y-2">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-xs text-[#A99E8F]"
                    >
                      <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#C28852]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action button */}
              <div className="mt-8 pt-2">
                <SelectServiceButton
                  serviceId={service.id}
                  serviceName={service.name}
                  featured={service.featured}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

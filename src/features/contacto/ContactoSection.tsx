import { BARBERSHOP, SCHEDULE } from "@/lib/constants";
import { buildDirectWhatsAppUrl } from "@/lib/booking";
import {
  ArrowUpRightIcon,
  ClockIcon,
  InstagramIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/Icons";

export function ContactoSection() {
  const directWhatsappUrl = buildDirectWhatsAppUrl();

  return (
    <section
      id="contacto"
      className="scroll-mt-20 bg-[#11100E] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#F2EBE1]/10 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#C28852]">
              03 / Ubicación &amp; Contacto
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#F2EBE1] sm:text-5xl">
              Te esperamos en el centro.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#8A7F72]">
            {BARBERSHOP.courtesyNote}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Left: Details */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-5">
            <div className="space-y-8">
              {/* Address */}
              <div className="border-b border-[#F2EBE1]/10 pb-7">
                <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C28852]">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  <span>Dirección</span>
                </p>
                <p className="mt-3 font-serif text-3xl font-medium text-[#F2EBE1]">
                  {BARBERSHOP.address}
                </p>
                <p className="mt-1 text-sm text-[#C4B9A9]">
                  {BARBERSHOP.postalCode}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#8A7F72]">
                  {BARBERSHOP.zoneReference}
                </p>
              </div>

              {/* Hours */}
              <div className="border-b border-[#F2EBE1]/10 pb-7">
                <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C28852]">
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span>Horarios de atención</span>
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {SCHEDULE.map((item) => (
                    <div
                      key={item.days}
                      className="flex items-center justify-between gap-4"
                    >
                      <dt className="text-[#C4B9A9]">{item.days}</dt>
                      <dd
                        className={
                          item.closed
                            ? "font-mono text-xs uppercase tracking-[0.14em] text-[#6E6459]"
                            : "font-mono text-xs tabular-nums text-[#F2EBE1]"
                        }
                      >
                        {item.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir por WhatsApp a ${BARBERSHOP.name} al ${BARBERSHOP.whatsappDisplay}`}
                className="group inline-flex w-full items-center justify-between border border-[#C28852] bg-[#C28852] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472]"
              >
                <span className="inline-flex items-center gap-2.5">
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Escribir por WhatsApp</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums">
                  {BARBERSHOP.whatsappDisplay}
                </span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={BARBERSHOP.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver perfil de Instagram de ${BARBERSHOP.name}`}
                  className="inline-flex items-center justify-center gap-2 border border-[#F2EBE1]/15 bg-[#141210] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 hover:text-[#C28852]"
                >
                  <InstagramIcon className="h-3.5 w-3.5 text-[#C28852]" />
                  <span>Instagram</span>
                </a>
                <a
                  href={BARBERSHOP.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir ubicación de ${BARBERSHOP.name} en Google Maps`}
                  className="inline-flex items-center justify-center gap-2 border border-[#F2EBE1]/15 bg-[#141210] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 hover:text-[#C28852]"
                >
                  <span>Google Maps</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5 text-[#C28852]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Editorial Vector Map of Downtown Bahía Blanca */}
          <div className="lg:col-span-7">
            <div className="relative flex h-full min-h-95 flex-col justify-between overflow-hidden border border-[#F2EBE1]/12 bg-[#0E0D0C] p-6 sm:p-8">
              {/* Top Map Bar */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="border border-[#F2EBE1]/15 bg-[#141210]/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#C4B9A9]">
                  Plano de referencia · Centro
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A7F72]">
                  {BARBERSHOP.coordinates}
                </span>
              </div>

              {/* Stylized Editorial Street Grid SVG */}
              <svg
                viewBox="0 0 640 420"
                role="img"
                aria-label="Mapa de referencia de El Patio Barbería en Zelarrayán 428, Centro de Bahía Blanca, a dos cuadras de Plaza Rivadavia"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
              >
                <defs>
                  <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C28852" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#C28852" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Urban blocks */}
                <g fill="#161412" stroke="#F2EBE1" strokeOpacity="0.06" strokeWidth="1">
                  <rect x="30" y="30" width="110" height="80" />
                  <rect x="160" y="30" width="120" height="80" />
                  <rect x="300" y="30" width="130" height="80" />
                  <rect x="450" y="30" width="150" height="80" />

                  <rect x="30" y="130" width="110" height="90" />
                  <rect x="160" y="130" width="120" height="90" />
                  <rect x="300" y="130" width="130" height="90" />
                  <rect x="450" y="130" width="150" height="90" />

                  <rect x="30" y="240" width="110" height="100" />
                  {/* Plaza Rivadavia block */}
                  <rect
                    x="160"
                    y="240"
                    width="120"
                    height="100"
                    fill="#191E18"
                    stroke="#C28852"
                    strokeOpacity="0.22"
                  />
                  <rect x="300" y="240" width="130" height="100" />
                  <rect x="450" y="240" width="150" height="100" />
                </g>

                {/* Main avenues / streets */}
                <g stroke="#F2EBE1" strokeOpacity="0.16" strokeWidth="1.5">
                  <line x1="0" y1="120" x2="640" y2="120" />
                  <line x1="0" y1="230" x2="640" y2="230" />
                  <line x1="0" y1="350" x2="640" y2="350" />
                  <line x1="150" y1="0" x2="150" y2="420" />
                  <line x1="290" y1="0" x2="290" y2="420" />
                  <line x1="440" y1="0" x2="440" y2="420" />
                </g>

                {/* Highlighted street: Zelarrayán */}
                <line
                  x1="290"
                  y1="0"
                  x2="290"
                  y2="420"
                  stroke="#C28852"
                  strokeOpacity="0.55"
                  strokeWidth="2.5"
                />

                {/* Street Labels */}
                <g
                  fill="#8A7F72"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="2"
                >
                  <text x="462" y="114">RODRÍGUEZ</text>
                  <text x="462" y="224">ALSINA</text>
                  <text x="462" y="344">CHICLANA</text>
                  <text
                    x="283"
                    y="206"
                    fill="#D8A472"
                    transform="rotate(-90 283 206)"
                  >
                    ZELARRAYÁN
                  </text>
                </g>

                {/* Plaza Rivadavia label */}
                <text
                  x="220"
                  y="286"
                  textAnchor="middle"
                  fill="#A99E8F"
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="1.6"
                >
                  PLAZA
                </text>
                <text
                  x="220"
                  y="300"
                  textAnchor="middle"
                  fill="#A99E8F"
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="1.6"
                >
                  RIVADAVIA
                </text>

                {/* Barbershop Location Marker */}
                <circle cx="290" cy="148" r="54" fill="url(#pinGlow)" />
                <circle
                  cx="290"
                  cy="148"
                  r="14"
                  fill="#0E0D0C"
                  stroke="#C28852"
                  strokeWidth="2"
                />
                <circle cx="290" cy="148" r="5" fill="#C28852" />
              </svg>

              {/* Bottom Floating Location Card */}
              <div className="relative z-10 mt-auto flex flex-col items-start justify-between gap-4 border border-[#F2EBE1]/15 bg-[#141210]/95 p-5 backdrop-blur-sm sm:flex-row sm:items-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C28852]">
                    {BARBERSHOP.name}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#F2EBE1]">
                    {BARBERSHOP.address} — {BARBERSHOP.city}
                  </p>
                </div>
                <a
                  href={BARBERSHOP.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 border border-[#C28852]/60 bg-[#C28852]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#D8A472] transition-colors hover:bg-[#C28852] hover:text-[#0E0D0C]"
                >
                  <span>Cómo llegar</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

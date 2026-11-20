import { BARBERSHOP, NAV_LINKS, SCHEDULE } from "@/lib/constants";
import { buildDirectWhatsAppUrl } from "@/lib/booking";
import { ArrowUpRightIcon, InstagramIcon, WhatsAppIcon } from "@/components/Icons";

export function Footer() {
  const whatsappUrl = buildDirectWhatsAppUrl();

  return (
    <footer className="border-t border-[#F2EBE1]/10 bg-[#0A0908] text-[#C4B9A9]">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center border border-[#C28852]/40 bg-[#161412] font-serif text-base font-semibold tracking-wider text-[#C28852]">
                {BARBERSHOP.monogram}
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold text-[#F2EBE1]">
                  {BARBERSHOP.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8A7F72]">
                  {BARBERSHOP.neighborhood}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8A7F72]">
              Barbería de oficio en el centro de {BARBERSHOP.city}. Cortes de
              precisión, ritual de barba con toalla caliente y un espacio pensado
              para frenar el ritmo del día.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir a ${BARBERSHOP.name} por WhatsApp`}
                className="inline-flex items-center gap-2 border border-[#F2EBE1]/15 bg-[#161412] px-3.5 py-2 text-xs uppercase tracking-[0.16em] text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 hover:text-[#C28852]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#C28852]" />
                <span>WhatsApp</span>
              </a>
              <a
                href={BARBERSHOP.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Seguir a ${BARBERSHOP.name} en Instagram`}
                className="inline-flex items-center gap-2 border border-[#F2EBE1]/15 bg-[#161412] px-3.5 py-2 text-xs uppercase tracking-[0.16em] text-[#F2EBE1] transition-colors hover:border-[#C28852]/60 hover:text-[#C28852]"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-[#C28852]" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C28852]">
              Ubicación &amp; Horarios
            </h2>
            <p className="mt-4 text-sm font-medium text-[#F2EBE1]">
              {BARBERSHOP.address}, {BARBERSHOP.city}
            </p>
            <p className="mt-1 text-xs text-[#8A7F72]">{BARBERSHOP.zoneReference}</p>

            <dl className="mt-5 space-y-2 border-t border-[#F2EBE1]/10 pt-4 text-xs">
              {SCHEDULE.map((item) => (
                <div key={item.days} className="flex items-center justify-between gap-4">
                  <dt className="text-[#8A7F72]">{item.days}</dt>
                  <dd
                    className={
                      item.closed
                        ? "font-mono text-[#6E6459]"
                        : "font-mono tabular-nums text-[#F2EBE1]"
                    }
                  >
                    {item.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C28852]">
              Navegación
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-[#C4B9A9] transition-colors hover:text-[#F2EBE1]"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={BARBERSHOP.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Cómo llegar a ${BARBERSHOP.name} en Google Maps`}
                  className="inline-flex items-center gap-1.5 text-[#C28852] transition-colors hover:text-[#D8A472]"
                >
                  <span>Cómo llegar</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#F2EBE1]/10 pt-8 text-xs text-[#6E6459] sm:flex-row sm:items-center">
          <p>
            © 2026 {BARBERSHOP.name}. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
            {BARBERSHOP.city} · {BARBERSHOP.province} · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { BARBERSHOP } from "@/lib/constants";
import { buildBarbershopJsonLd, serializeJsonLd } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BARBERSHOP.siteUrl),
  title: {
    default: `${BARBERSHOP.name} — Barbería en el centro de ${BARBERSHOP.city}`,
    template: `%s | ${BARBERSHOP.name}`,
  },
  description:
    "El Patio Barbería en Zelarrayán 428, centro de Bahía Blanca. Corte clásico, fade & perfilado, barba ritual con toalla caliente y reserva rápida de turnos por WhatsApp.",
  keywords: [
    "barbería Bahía Blanca",
    "barbería centro Bahía Blanca",
    "El Patio Barbería",
    "corte de pelo masculino Bahía Blanca",
    "fade y perfilado Bahía Blanca",
    "barba ritual toalla caliente",
    "turnos barbería WhatsApp Bahía Blanca",
    "peluquería masculina Bahía Blanca",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BARBERSHOP.name} — Barbería en el centro de ${BARBERSHOP.city}`,
    description:
      "Cortes clásicos, fade bien pulido y barba a navaja con toalla caliente en Zelarrayán 428, Bahía Blanca. Reservá tu turno directo por WhatsApp.",
    url: "/",
    siteName: BARBERSHOP.name,
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = buildBarbershopJsonLd();

  return (
    <html
      lang="es-AR"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0E0D0C] font-sans text-[#F2EBE1] selection:bg-[#C28852] selection:text-[#0E0D0C]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

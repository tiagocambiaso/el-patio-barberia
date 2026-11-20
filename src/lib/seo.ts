import { BARBERSHOP, SERVICES } from "@/lib/constants";

export function buildBarbershopJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "LocalBusiness"],
    "@id": `${BARBERSHOP.siteUrl}/#barbershop`,
    name: BARBERSHOP.name,
    description:
      "Barbería en el centro de Bahía Blanca especializada en corte clásico a tijera, fade & perfilado y barba ritual con toalla caliente. Turnos directos por WhatsApp.",
    url: BARBERSHOP.siteUrl,
    telephone: BARBERSHOP.whatsappDisplay,
    priceRange: BARBERSHOP.priceRange,
    currenciesAccepted: "ARS",
    areaServed: {
      "@type": "City",
      name: BARBERSHOP.city,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: BARBERSHOP.address,
      addressLocality: BARBERSHOP.city,
      addressRegion: BARBERSHOP.province,
      postalCode: BARBERSHOP.postalCodeNumber,
      addressCountry: BARBERSHOP.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BARBERSHOP.geo.latitude,
      longitude: BARBERSHOP.geo.longitude,
    },
    hasMap: BARBERSHOP.mapsUrl,
    sameAs: [BARBERSHOP.instagramUrl],
    openingHoursSpecification: BARBERSHOP.openingHoursSpecification.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...spec.dayOfWeek],
      opens: spec.opens,
      closes: spec.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Barbería",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        price: service.priceArs,
        priceCurrency: "ARS",
      })),
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

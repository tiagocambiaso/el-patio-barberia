import type { MetadataRoute } from "next";
import { BARBERSHOP } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BARBERSHOP.siteUrl}/sitemap.xml`,
    host: BARBERSHOP.siteUrl,
  };
}

import type { MetadataRoute } from "next";
import { BARBERSHOP } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BARBERSHOP.siteUrl,
      lastModified: new Date("2026-11-20"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

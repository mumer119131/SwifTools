import type { MetadataRoute } from "next";

import { categories } from "@/config/categories";
import { absoluteUrl } from "@/config/site";
import { toolHref, tools } from "@/config/tools";

/**
 * Generated straight from the registry, so a new tool is in the sitemap the
 * moment it is registered — there is no second list to keep in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: absoluteUrl(toolHref(tool)),
      lastModified,
      changeFrequency: "monthly" as const,
      // Planned tools are listed but ranked below the ones that actually work.
      priority: tool.status === "live" ? 0.7 : 0.3,
    })),
    ...["/privacy", "/terms"].map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}

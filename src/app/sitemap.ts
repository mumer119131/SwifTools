import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { populatedCategories, toolHref, tools } from "@/config/tools";
import toolDates from "@/config/tool-dates.json";

/**
 * Generated straight from the registry, so a new tool is in the sitemap the
 * moment it is registered — there is no second list to keep in sync.
 */
/**
 * The last commit that touched a tool's folder, from `pnpm dates`.
 *
 * Reporting the build time for every URL tells a crawler the whole site changed
 * on every deploy, which is both false and a signal it learns to ignore. A pair
 * page has no folder of its own, so it inherits the date of the shared
 * implementation.
 */
function modifiedAt(slug: string, fallback: Date): Date {
  const iso = (toolDates as Record<string, string>)[slug];
  if (!iso) return fallback;

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pairFallback = modifiedAt("unit-pairs", lastModified);

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...populatedCategories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: absoluteUrl(toolHref(tool)),
      lastModified: modifiedAt(tool.slug, tool.searchOnly ? pairFallback : lastModified),
      changeFrequency: "monthly" as const,
      // Planned tools are listed but ranked below the ones that actually work.
      priority: tool.status === "live" ? 0.7 : 0.3,
    })),
    ...["/about", "/contact", "/privacy", "/terms"].map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}

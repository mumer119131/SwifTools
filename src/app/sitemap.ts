import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { guides, guideHref } from "@/config/guides";
import { postHref, posts } from "@/posts";
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

  /**
   * A listing page changed when its newest entry did.
   *
   * Reporting the build time instead tells a crawler that every category page
   * changes on every deploy, which is false and a claim it learns to discount —
   * taking the pages that genuinely did change down with it. Deriving the date
   * from the contents means the signal stays meaningful.
   */
  const newestIn = (slugs: string[]): Date => {
    const dates = slugs
      .map((slug) => modifiedAt(slug, new Date(0)))
      .filter((date) => date.getTime() > 0);
    return dates.length > 0
      ? new Date(Math.max(...dates.map((date) => date.getTime())))
      : lastModified;
  };

  const newestOverall = newestIn(tools.map((tool) => tool.slug));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: newestOverall,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified: newestOverall,
      changeFrequency: "weekly" as const,
      // The full catalogue now lives here rather than on the homepage.
      priority: 0.9,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: new Date(
        Math.max(...guides.map((guide) => new Date(guide.updated).getTime())),
      ),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // Guides carry their own dates: they are written once and revised
    // occasionally, so reporting the build time would be a lie a crawler
    // eventually learns to ignore.
    ...guides.map((guide) => ({
      url: absoluteUrl(guideHref(guide)),
      lastModified: new Date(guide.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(posts.length > 0
      ? [
          {
            url: absoluteUrl("/blog"),
            lastModified: new Date(posts[0].date),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: absoluteUrl(postHref(post)),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...populatedCategories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified: newestIn(
        tools.filter((tool) => tool.category === category.slug).map((tool) => tool.slug),
      ),
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

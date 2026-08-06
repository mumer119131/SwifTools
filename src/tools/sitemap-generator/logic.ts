export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export const changeFrequencies: ChangeFrequency[] = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
];

export interface SitemapOptions {
  baseUrl: string;
  lastModified: string;
  changeFrequency: ChangeFrequency | "";
  priority: string;
  includeLastMod: boolean;
  includeChangeFreq: boolean;
  includePriority: boolean;
}

export interface SitemapResult {
  xml: string;
  urlCount: number;
  skipped: string[];
  /** The 50,000-URL limit in the sitemap protocol. */
  exceedsLimit: boolean;
}

/** XML has five predefined entities; all of them must be escaped in a URL. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Resolves each line to an absolute URL.
 *
 * Sitemaps require absolute URLs on the same host as the sitemap itself, so
 * relative paths are joined onto the base and anything that can't be resolved
 * is reported rather than silently dropped.
 */
export function buildSitemap(input: string, options: SitemapOptions): SitemapResult {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const urls: string[] = [];
  const skipped: string[] = [];

  const base = options.baseUrl.trim().replace(/\/+$/, "");

  for (const line of lines) {
    let resolved: string;

    try {
      resolved = /^https?:\/\//i.test(line)
        ? new URL(line).toString()
        : base
          ? new URL(line.startsWith("/") ? line : `/${line}`, `${base}/`).toString()
          : "";
    } catch {
      resolved = "";
    }

    if (!resolved) {
      skipped.push(line);
      continue;
    }
    // Duplicate URLs in a sitemap are wasted crawl budget.
    if (seen.has(resolved)) continue;

    seen.add(resolved);
    urls.push(resolved);
  }

  const priority = Number(options.priority);
  const body = urls
    .map((url) => {
      const parts = [`    <loc>${escapeXml(url)}</loc>`];
      if (options.includeLastMod && options.lastModified) {
        parts.push(`    <lastmod>${options.lastModified}</lastmod>`);
      }
      if (options.includeChangeFreq && options.changeFrequency) {
        parts.push(`    <changefreq>${options.changeFrequency}</changefreq>`);
      }
      if (options.includePriority && Number.isFinite(priority)) {
        parts.push(`    <priority>${priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return {
    xml: urls.length > 0 ? xml : "",
    urlCount: urls.length,
    skipped,
    exceedsLimit: urls.length > 50000,
  };
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

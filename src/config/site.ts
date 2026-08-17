/**
 * The single source of truth for app identity.
 *
 * Nothing else in the codebase may contain a string literal of the app name.
 * Changing `name` here rebrands the header, footer, every `<title>`, all meta
 * and Open Graph tags, the OG image, the manifest, the sitemap and JSON-LD.
 */
export const siteConfig = {
  name: "PocketToolz",
  tagline: "Every tool you need, always to hand.",
  description:
    "A fast, free collection of PDF, image, text, developer, and converter tools — all in one place.",
  url: "https://pockettoolz.com",
  ogImage: "/og.png",
  author: "Umer Labs",
  /**
   * The one published contact address.
   *
   * Kept here rather than in the contact page so the same address reaches the
   * page, the Organization schema and anywhere else that needs it — a site
   * whose advertised contact differs from its structured data is a trust
   * signal pointing the wrong way.
   */
  email: "umerlabsofficial@gmail.com",
  links: {
    twitter: "",
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Base URL as a `URL`, used by `metadataBase` and absolute-URL helpers. */
export const siteUrl = new URL(siteConfig.url);

/**
 * Builds a page title. Passing no segment yields the bare brand title so the
 * homepage doesn't read "PocketToolz | PocketToolz".
 */
export function pageTitle(segment?: string): string {
  return segment ? `${segment} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
}

/** Resolves a path against the site URL. Safe to pass an already-absolute URL. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

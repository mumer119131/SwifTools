export interface MetaInput {
  title: string;
  description: string;
  url: string;
  siteName: string;
  imageUrl: string;
  imageAlt: string;
  author: string;
  keywords: string;
  twitterHandle: string;
  cardType: "summary" | "summary_large_image";
  locale: string;
  robotsIndex: boolean;
}

/**
 * Where search engines and social cards start truncating. These are pixel
 * limits in reality, so character counts are approximate — which is why the UI
 * warns rather than blocks.
 */
export const limits = {
  title: 60,
  description: 160,
  ogTitle: 88,
  ogDescription: 200,
} as const;

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateTags(input: MetaInput): string {
  const lines: string[] = [];
  const tag = (markup: string) => lines.push(markup);

  const escaped = {
    title: escapeAttribute(input.title),
    description: escapeAttribute(input.description),
    url: escapeAttribute(input.url),
    siteName: escapeAttribute(input.siteName),
    imageUrl: escapeAttribute(input.imageUrl),
    imageAlt: escapeAttribute(input.imageAlt),
    author: escapeAttribute(input.author),
    keywords: escapeAttribute(input.keywords),
    twitterHandle: escapeAttribute(input.twitterHandle),
  };

  tag("<!-- Primary -->");
  if (input.title) tag(`<title>${escaped.title}</title>`);
  if (input.description) tag(`<meta name="description" content="${escaped.description}">`);
  if (input.keywords) tag(`<meta name="keywords" content="${escaped.keywords}">`);
  if (input.author) tag(`<meta name="author" content="${escaped.author}">`);
  if (input.url) tag(`<link rel="canonical" href="${escaped.url}">`);
  tag(
    `<meta name="robots" content="${input.robotsIndex ? "index, follow, max-image-preview:large" : "noindex, nofollow"}">`,
  );

  if (input.title || input.description || input.url) {
    tag("");
    tag("<!-- Open Graph — Facebook, LinkedIn, Slack, Discord -->");
    tag(`<meta property="og:type" content="website">`);
    if (input.url) tag(`<meta property="og:url" content="${escaped.url}">`);
    if (input.title) tag(`<meta property="og:title" content="${escaped.title}">`);
    if (input.description) tag(`<meta property="og:description" content="${escaped.description}">`);
    if (input.siteName) tag(`<meta property="og:site_name" content="${escaped.siteName}">`);
    if (input.locale) tag(`<meta property="og:locale" content="${escapeAttribute(input.locale)}">`);
    if (input.imageUrl) {
      tag(`<meta property="og:image" content="${escaped.imageUrl}">`);
      tag(`<meta property="og:image:width" content="1200">`);
      tag(`<meta property="og:image:height" content="630">`);
      if (input.imageAlt) tag(`<meta property="og:image:alt" content="${escaped.imageAlt}">`);
    }
  }

  tag("");
  tag("<!-- Twitter / X -->");
  tag(`<meta name="twitter:card" content="${input.cardType}">`);
  if (input.title) tag(`<meta name="twitter:title" content="${escaped.title}">`);
  if (input.description) tag(`<meta name="twitter:description" content="${escaped.description}">`);
  if (input.imageUrl) tag(`<meta name="twitter:image" content="${escaped.imageUrl}">`);
  if (input.imageAlt) tag(`<meta name="twitter:image:alt" content="${escaped.imageAlt}">`);
  if (input.twitterHandle) {
    const handle = input.twitterHandle.startsWith("@")
      ? escaped.twitterHandle
      : `@${escaped.twitterHandle}`;
    tag(`<meta name="twitter:site" content="${handle}">`);
    tag(`<meta name="twitter:creator" content="${handle}">`);
  }

  return lines.join("\n");
}

/** Renders the URL the way Google shows it — host first, path as breadcrumbs. */
export function displayUrl(url: string): string {
  if (!url) return "example.com";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return [parsed.host, ...segments].join(" › ");
  } catch {
    return url;
  }
}

export type LengthState = "empty" | "short" | "good" | "long";

export function lengthState(value: string, limit: number): LengthState {
  if (!value) return "empty";
  if (value.length > limit) return "long";
  if (value.length < limit * 0.5) return "short";
  return "good";
}

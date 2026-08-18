export interface Entry {
  id: string;
  /** "en", "en-GB", or "x-default". */
  lang: string;
  url: string;
}

export interface Issue {
  level: "error" | "warning";
  message: string;
}

/**
 * Language codes people actually need, with the traps noted.
 *
 * The region subtag is a *country*, not a language — en-UK is the single most
 * common hreflang error, because the ISO 3166 code for the United Kingdom is
 * GB. Google ignores the whole tag when it cannot parse it, silently.
 */
export const COMMON: { code: string; label: string }[] = [
  { code: "x-default", label: "Fallback for everyone else" },
  { code: "en", label: "English (any region)" },
  { code: "en-GB", label: "English — United Kingdom" },
  { code: "en-US", label: "English — United States" },
  { code: "en-AU", label: "English — Australia" },
  { code: "en-CA", label: "English — Canada" },
  { code: "en-IN", label: "English — India" },
  { code: "fr", label: "French" },
  { code: "fr-CA", label: "French — Canada" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "es-MX", label: "Spanish — Mexico" },
  { code: "pt-BR", label: "Portuguese — Brazil" },
  { code: "it", label: "Italian" },
  { code: "nl", label: "Dutch" },
  { code: "ja", label: "Japanese" },
  { code: "zh-Hans", label: "Chinese — Simplified" },
  { code: "zh-Hant", label: "Chinese — Traditional" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
];

/** Codes that look right and are not. */
const WRONG_CODES: Record<string, string> = {
  "en-uk": "en-GB",
  "en-eu": "en (the EU is not a country)",
  "zh-cn": "zh-Hans",
  "zh-tw": "zh-Hant",
  "pt-pt": "pt",
  "cs-cz": "cs",
  "ja-jp": "ja",
  "he-il": "he",
  "el-gr": "el",
};

export function validate(entries: Entry[]): Issue[] {
  const issues: Issue[] = [];
  const filled = entries.filter((entry) => entry.lang.trim() && entry.url.trim());

  if (filled.length < 2) {
    issues.push({
      level: "warning",
      message: "hreflang describes a set of alternates, so it needs at least two entries to mean anything.",
    });
  }

  const seenLang = new Set<string>();
  const seenUrl = new Set<string>();

  for (const entry of filled) {
    const lang = entry.lang.trim();
    const lower = lang.toLowerCase();

    if (WRONG_CODES[lower]) {
      issues.push({
        level: "error",
        message: `"${lang}" is not a valid hreflang value — use ${WRONG_CODES[lower]}. Google ignores the entire tag when it cannot parse the code, and says nothing.`,
      });
    } else if (lower !== "x-default" && !/^[a-z]{2,3}(-[A-Za-z]{4})?(-[A-Za-z]{2}|-\d{3})?$/.test(lang)) {
      issues.push({
        level: "error",
        message: `"${lang}" does not look like a language code. The form is language, optionally a script, optionally a country — like en, en-GB or zh-Hans.`,
      });
    }

    if (seenLang.has(lower)) {
      issues.push({ level: "error", message: `"${lang}" appears more than once. Each code may point at one URL.` });
    }
    seenLang.add(lower);

    const url = entry.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      issues.push({
        level: "error",
        message: `"${url}" must be an absolute URL. Relative paths are ignored outright.`,
      });
    }
    if (seenUrl.has(url) && lower !== "x-default") {
      issues.push({
        level: "warning",
        message: `Two codes point at ${url}. That is legal but usually a copy-and-paste slip.`,
      });
    }
    seenUrl.add(url);
  }

  if (filled.length >= 2 && !filled.some((entry) => entry.lang.trim().toLowerCase() === "x-default")) {
    issues.push({
      level: "warning",
      message: "No x-default. Without one, a visitor whose language matches nothing in the set gets whatever Google guesses.",
    });
  }

  return issues;
}

export function toLinkTags(entries: Entry[]): string {
  return entries
    .filter((entry) => entry.lang.trim() && entry.url.trim())
    .map(
      (entry) =>
        `<link rel="alternate" hreflang="${entry.lang.trim()}" href="${entry.url.trim()}" />`,
    )
    .join("\n");
}

/**
 * The XML sitemap form, which is the better option past a handful of pages —
 * link tags have to appear on every page in the set, and every page has to
 * list every other, so a 10-language site means 100 tags maintained by hand.
 */
export function toSitemapXml(entries: Entry[]): string {
  const filled = entries.filter((entry) => entry.lang.trim() && entry.url.trim());
  if (filled.length === 0) return "";

  const alternates = filled
    .map(
      (entry) =>
        `    <xhtml:link rel="alternate" hreflang="${entry.lang.trim()}" href="${entry.url.trim()}" />`,
    )
    .join("\n");

  const urls = filled
    .map(
      (entry) => `  <url>
    <loc>${entry.url.trim()}</loc>
${alternates}
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

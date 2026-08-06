export interface RuleGroup {
  id: string;
  userAgent: string;
  /** One path per line. */
  disallow: string;
  allow: string;
  /** Seconds between requests. 0 omits the directive. */
  crawlDelay: number;
}

export interface RobotsConfig {
  groups: RuleGroup[];
  sitemapUrl: string;
  host: string;
}

export const commonAgents = [
  "*",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "CCBot",
  "AhrefsBot",
  "SemrushBot",
] as const;

export interface Preset {
  id: string;
  label: string;
  description: string;
  build: () => RuleGroup[];
}

/**
 * A monotonic counter rather than `Math.random`, so ids are deterministic.
 * That lets the default groups be built during render — including on the
 * server — without producing a hydration mismatch.
 */
let nextGroupId = 0;

const group = (userAgent: string, disallow = "", allow = "", crawlDelay = 0): RuleGroup => ({
  id: `group-${(nextGroupId += 1)}`,
  userAgent,
  disallow,
  allow,
  crawlDelay,
});

export const presets: readonly Preset[] = [
  {
    id: "allow-all",
    label: "Allow everything",
    description: "Every crawler can access the whole site. The right default for most sites.",
    build: () => [group("*")],
  },
  {
    id: "block-all",
    label: "Block everything",
    description: "Ask every crawler to stay out. For staging sites and private tools.",
    build: () => [group("*", "/")],
  },
  {
    id: "typical",
    label: "Typical site",
    description: "Blocks admin, cart, search results and API paths that waste crawl budget.",
    build: () => [group("*", "/admin/\n/cart/\n/checkout/\n/search\n/api/\n/*?s=")],
  },
  {
    id: "block-ai",
    label: "Block AI training crawlers",
    description: "Allows search engines but asks known AI dataset crawlers not to collect content.",
    build: () => [
      group("*"),
      group("GPTBot", "/"),
      group("ClaudeBot", "/"),
      group("CCBot", "/"),
      group("PerplexityBot", "/"),
    ],
  },
];

/**
 * Renders the file.
 *
 * Order matters to some parsers, so groups are emitted in the order given, with
 * Sitemap and Host after all groups — they are file-level directives, not part
 * of any one group, and putting them inside a group is a common mistake.
 */
export function generateRobotsTxt(config: RobotsConfig): string {
  const lines: string[] = [];

  for (const [index, rule] of config.groups.entries()) {
    if (index > 0) lines.push("");
    lines.push(`User-agent: ${rule.userAgent.trim() || "*"}`);

    const paths = (value: string) =>
      value
        .split("\n")
        .map((path) => path.trim())
        .filter(Boolean);

    for (const path of paths(rule.allow)) lines.push(`Allow: ${normalisePath(path)}`);

    const disallowed = paths(rule.disallow);
    if (disallowed.length === 0) {
      // An empty Disallow is the explicit way to say "everything is allowed".
      lines.push("Disallow:");
    } else {
      for (const path of disallowed) lines.push(`Disallow: ${normalisePath(path)}`);
    }

    if (rule.crawlDelay > 0) lines.push(`Crawl-delay: ${rule.crawlDelay}`);
  }

  if (config.host.trim()) {
    lines.push("", `Host: ${config.host.trim().replace(/^https?:\/\//, "")}`);
  }

  if (config.sitemapUrl.trim()) {
    lines.push("", `Sitemap: ${config.sitemapUrl.trim()}`);
  }

  return lines.join("\n");
}

function normalisePath(path: string): string {
  if (path === "/" || path.startsWith("/") || path.startsWith("*")) return path;
  return `/${path}`;
}

export interface Warning {
  level: "error" | "warning";
  message: string;
}

/** Catches the mistakes that actually deindex sites. */
export function validate(config: RobotsConfig): Warning[] {
  const warnings: Warning[] = [];

  const blocksEverything = config.groups.some(
    (rule) =>
      rule.userAgent.trim() === "*" &&
      rule.disallow.split("\n").some((path) => path.trim() === "/"),
  );

  if (blocksEverything) {
    warnings.push({
      level: "warning",
      message:
        "This blocks every crawler from the entire site. Correct for staging, catastrophic on production.",
    });
  }

  if (!config.sitemapUrl.trim()) {
    warnings.push({
      level: "warning",
      message: "No sitemap declared. Adding one helps crawlers find pages that aren't linked well.",
    });
  }

  if (config.sitemapUrl.trim() && !/^https?:\/\//i.test(config.sitemapUrl.trim())) {
    warnings.push({
      level: "error",
      message: "The sitemap must be an absolute URL, including https://.",
    });
  }

  const agents = config.groups.map((rule) => rule.userAgent.trim().toLowerCase());
  const duplicates = agents.filter((agent, index) => agents.indexOf(agent) !== index);
  if (duplicates.length > 0) {
    warnings.push({
      level: "warning",
      message: `Duplicate user-agent group: ${[...new Set(duplicates)].join(", ")}. Most crawlers only honour the first matching group.`,
    });
  }

  return warnings;
}

export function blankGroup(): RuleGroup {
  return group("*");
}

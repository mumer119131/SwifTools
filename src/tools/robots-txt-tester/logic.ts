export interface Rule {
  type: "allow" | "disallow";
  path: string;
  line: number;
}

export interface Group {
  agents: string[];
  rules: Rule[];
}

export interface Parsed {
  groups: Group[];
  sitemaps: string[];
  warnings: { line: number; message: string }[];
}

/**
 * Parses robots.txt into groups.
 *
 * Consecutive User-agent lines share one group of rules — a detail that trips
 * people up, because writing two agents and then one Disallow applies that
 * rule to both, not just the second.
 */
export function parse(input: string): Parsed {
  const groups: Group[] = [];
  const sitemaps: string[] = [];
  const warnings: { line: number; message: string }[] = [];

  let current: Group | null = null;
  // Whether the last meaningful line was a User-agent, so a run of them groups.
  let collectingAgents = false;

  input.split("\n").forEach((raw, index) => {
    const line = index + 1;
    const text = raw.split("#")[0].trim();
    if (!text) return;

    const separator = text.indexOf(":");
    if (separator === -1) {
      warnings.push({ line, message: `"${text}" has no colon, so it is ignored entirely.` });
      return;
    }

    const field = text.slice(0, separator).trim().toLowerCase();
    const value = text.slice(separator + 1).trim();

    if (field === "user-agent") {
      if (!collectingAgents || current === null) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      collectingAgents = true;
      return;
    }

    collectingAgents = false;

    if (field === "sitemap") {
      sitemaps.push(value);
      return;
    }

    if (field === "allow" || field === "disallow") {
      if (current === null) {
        warnings.push({
          line,
          message: `${field} before any User-agent line. Every rule must belong to a group, so this one applies to nothing.`,
        });
        return;
      }
      current.rules.push({ type: field, path: value, line });
      return;
    }

    if (field === "crawl-delay") return;

    warnings.push({ line, message: `"${field}" is not a directive crawlers act on.` });
  });

  return { groups, sitemaps, warnings };
}

/**
 * Picks the group that applies to a crawler.
 *
 * Crawlers use the single most specific matching group and ignore every other,
 * including the wildcard. That is the rule people get wrong most often: adding
 * a Googlebot group means Googlebot stops reading the `*` group entirely, so
 * anything it needs has to be repeated.
 */
export function groupFor(parsed: Parsed, agent: string): Group | null {
  const needle = agent.toLowerCase();
  let best: Group | null = null;
  let bestLength = -1;

  for (const group of parsed.groups) {
    for (const candidate of group.agents) {
      if (candidate === "*") {
        if (bestLength < 0) {
          best = group;
          bestLength = 0;
        }
        continue;
      }
      if (needle.includes(candidate) && candidate.length > bestLength) {
        best = group;
        bestLength = candidate.length;
      }
    }
  }

  return best;
}

/** Turns a robots path, with its * and $ wildcards, into a pattern. */
function toPattern(path: string): RegExp {
  const escaped = path.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  // A trailing $ in robots.txt anchors the match to the end of the URL.
  const anchored = escaped.endsWith("\\$") ? `${escaped.slice(0, -2)}$` : escaped;
  return new RegExp(`^${anchored}`);
}

export interface Verdict {
  allowed: boolean;
  rule: Rule | null;
  group: Group | null;
  reason: string;
}

/**
 * Decides whether a path may be crawled.
 *
 * The rule is length, not order: the longest matching path wins regardless of
 * where it appears in the file, and Allow beats Disallow when both match at the
 * same length. Reading top to bottom and taking the first match — which is what
 * people assume — gives the wrong answer surprisingly often.
 */
export function test(parsed: Parsed, agent: string, path: string): Verdict {
  const group = groupFor(parsed, agent);

  if (!group) {
    return {
      allowed: true,
      rule: null,
      group: null,
      reason: `No group matches ${agent}, and nothing forbids what is not mentioned. The whole site is crawlable by this agent.`,
    };
  }

  const target = path.startsWith("/") ? path : `/${path}`;

  let winner: Rule | null = null;
  for (const rule of group.rules) {
    // An empty Disallow means "allow everything" and matches nothing itself.
    if (rule.type === "disallow" && rule.path === "") continue;
    if (!toPattern(rule.path).test(target)) continue;

    if (
      winner === null ||
      rule.path.length > winner.path.length ||
      // Equal length: Allow wins, which is what the specification says.
      (rule.path.length === winner.path.length && rule.type === "allow")
    ) {
      winner = rule;
    }
  }

  if (!winner) {
    return {
      allowed: true,
      rule: null,
      group,
      reason: "No rule in the matching group covers this path, so it is crawlable.",
    };
  }

  return {
    allowed: winner.type === "allow",
    rule: winner,
    group,
    reason:
      winner.type === "allow"
        ? `Allowed by "${winner.type}: ${winner.path}" on line ${winner.line} — the longest matching rule.`
        : `Blocked by "${winner.type}: ${winner.path}" on line ${winner.line} — the longest matching rule.`,
  };
}

export const SAMPLE = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /search
Allow: /api/public/

User-agent: Googlebot
Disallow: /admin/
Allow: /

Sitemap: https://example.com/sitemap.xml`;

export const AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "GPTBot",
  "*",
];

/**
 * `component` escapes everything that isn't unreserved — including `/ ? & = :`
 * — which is what you want for a single query value. `full` preserves URL
 * structure, so pasting a whole URL doesn't mangle its own separators.
 */
export type EncodeScope = "component" | "full";

export function encodeUrl(value: string, scope: EncodeScope): string {
  return scope === "component" ? encodeURIComponent(value) : encodeURI(value);
}

export function decodeUrl(value: string, scope: EncodeScope): string {
  // `+` means space in application/x-www-form-urlencoded but is literal in a
  // path, so it is only translated for component decoding.
  const prepared = scope === "component" ? value.replace(/\+/g, " ") : value;
  return scope === "component" ? decodeURIComponent(prepared) : decodeURI(prepared);
}

export interface ParsedUrl {
  protocol: string;
  host: string;
  path: string;
  hash: string;
  params: { key: string; value: string }[];
}

/**
 * Breaks a URL into its parts so each query value can be read decoded, which
 * is usually the actual reason someone opened a URL decoder.
 */
export function parseUrl(value: string): ParsedUrl | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    // A bare "example.com/x?y=1" is still worth parsing.
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);

    return {
      protocol: url.protocol.replace(":", ""),
      host: url.host,
      path: url.pathname,
      hash: url.hash.replace("#", ""),
      params: [...url.searchParams.entries()].map(([key, paramValue]) => ({
        key,
        value: paramValue,
      })),
    };
  } catch {
    return null;
  }
}

import type { IpResponse } from "@/app/api/ip/route";

/**
 * The address is read by our own endpoint from the proxy headers rather than by
 * a third-party lookup service, so using this tool does not hand the visitor's
 * address to anyone else. Everything below the address is read from the browser
 * itself and never leaves it.
 */
export async function fetchIp(): Promise<IpResponse> {
  const response = await fetch("/api/ip", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read your IP address.");
  return (await response.json()) as IpResponse;
}

/**
 * The browser name and version from a user-agent string.
 *
 * Order is the whole problem here. Every Chromium browser still claims to be
 * both Safari and Chrome for compatibility, and Edge claims to be Chrome too,
 * so the most specific token has to be tested first or everything reports as
 * Chrome. Returns null when nothing matches, which is honest — a user-agent is
 * a self-reported string and reduced UA strings deliberately say less.
 */
export function describeBrowser(ua: string): string | null {
  const patterns: [RegExp, string][] = [
    [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/Firefox\/(\d+)/, "Firefox"],
    [/FxiOS\/(\d+)/, "Firefox"],
    [/CriOS\/(\d+)/, "Chrome"],
    [/Chrome\/(\d+)/, "Chrome"],
    [/Version\/(\d+).*Safari/, "Safari"],
  ];

  for (const [pattern, name] of patterns) {
    const match = pattern.exec(ua);
    if (match) return `${name} ${match[1]}`;
  }
  return null;
}

/** The operating system from a user-agent string, or null if unrecognised. */
export function describeOs(ua: string): string | null {
  // iPadOS reports as Macintosh, so the iPad test has to come before macOS.
  if (/iPad/.test(ua)) return "iPadOS";
  if (/iPhone|iPod/.test(ua)) return "iOS";
  if (/Android\s([\d.]+)/.test(ua)) return `Android ${/Android\s([\d.]+)/.exec(ua)![1]}`;
  if (/Windows NT 10\.0/.test(ua)) return "Windows 10 or 11";
  if (/Windows NT ([\d.]+)/.test(ua)) return `Windows NT ${/Windows NT ([\d.]+)/.exec(ua)![1]}`;
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

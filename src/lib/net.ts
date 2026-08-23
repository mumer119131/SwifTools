/**
 * Network address helpers shared by the server-side network tools.
 *
 * These are the security boundary for anything that fetches a user-supplied
 * URL, so they live here as pure functions rather than inline in a route —
 * a guard that cannot be called from a test is a guard nobody checks.
 */

/** A dotted-quad as a 32-bit number, or null if it is not one. */
function ipv4ToNumber(value: string): number | null {
  const parts = value.split(".");
  if (parts.length !== 4) return null;

  let result = 0;
  for (const part of parts) {
    // Leading zeros are rejected: "010" is octal to some resolvers and decimal
    // to others, and that disagreement is exactly how a guard gets bypassed.
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return null;

    const octet = Number(part);
    if (octet > 255) return null;
    result = result * 256 + octet;
  }
  return result;
}

/**
 * Ranges that must never be reachable from a user-supplied URL. The one that
 * matters most is 169.254.0.0/16: it holds 169.254.169.254, the cloud instance
 * metadata endpoint, which on many hosts serves credentials to anything that
 * asks. The rest close off the private network the server sits inside.
 */
const BLOCKED_V4: readonly (readonly [string, number])[] = [
  ["0.0.0.0", 8], // "This host on this network".
  ["10.0.0.0", 8], // Private.
  ["100.64.0.0", 10], // Carrier-grade NAT.
  ["127.0.0.0", 8], // Loopback.
  ["169.254.0.0", 16], // Link-local, including cloud metadata.
  ["172.16.0.0", 12], // Private.
  ["192.0.0.0", 24], // IETF protocol assignments.
  ["192.0.2.0", 24], // Documentation.
  ["192.168.0.0", 16], // Private.
  ["198.18.0.0", 15], // Benchmarking.
  ["198.51.100.0", 24], // Documentation.
  ["203.0.113.0", 24], // Documentation.
  ["224.0.0.0", 4], // Multicast.
  ["240.0.0.0", 4], // Reserved, includes broadcast.
] as const;

/** Strips an IPv6 zone index and surrounding brackets. */
function normaliseIp(value: string): string {
  return value.trim().replace(/^\[|\]$/g, "").split("%")[0].toLowerCase();
}

/**
 * True if `value` is a literal address that a user-supplied URL must not reach.
 *
 * Anything unparseable is treated as private. Failing closed is the only safe
 * default here: an address shape we do not recognise is not one we can promise
 * is public.
 */
export function isPrivateAddress(value: string): boolean {
  const address = normaliseIp(value);
  if (address === "") return true;

  // IPv4-mapped and IPv4-compatible IPv6 ("::ffff:127.0.0.1") reach the v4
  // address they embed, so they are judged as that address.
  const mapped = /^::(?:ffff:(?:0{1,4}:)?)?(\d{1,3}(?:\.\d{1,3}){3})$/.exec(address);
  if (mapped) return isPrivateAddress(mapped[1]);

  if (address.includes(":")) {
    if (address === "::" || address === "::1") return true;
    if (/^f[cd][0-9a-f]{2}:/.test(address)) return true; // fc00::/7 unique local.
    if (/^fe[89ab][0-9a-f]:/.test(address)) return true; // fe80::/10 link local.
    if (/^64:ff9b:/.test(address)) return true; // NAT64, can wrap a v4 address.
    if (/^2002:/.test(address)) return true; // 6to4, likewise.
    return !/^[0-9a-f:]+$/.test(address) ? true : false;
  }

  const ip = ipv4ToNumber(address);
  if (ip === null) return true;

  return BLOCKED_V4.some(([base, prefix]) => {
    const network = ipv4ToNumber(base);
    if (network === null) return false;
    const shift = 32 - prefix;
    return Math.floor(ip / 2 ** shift) === Math.floor(network / 2 ** shift);
  });
}

/**
 * True if `value` looks like a DNS hostname we are willing to query.
 *
 * Deliberately stricter than the RFCs: no trailing dot, no underscores, and at
 * least one dot, so a bare "localhost" or a container name cannot be probed.
 */
export function isValidHostname(value: string): boolean {
  const host = value.trim().toLowerCase();
  if (host.length === 0 || host.length > 253) return false;
  if (!host.includes(".")) return false;

  // A bare address is not a hostname; callers check those with isPrivateAddress.
  if (ipv4ToNumber(host) !== null) return false;

  return host
    .split(".")
    .every((label) => label.length >= 1 && label.length <= 63 && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(label));
}

/**
 * The visitor's address, read from the proxy headers the host sets.
 *
 * `x-forwarded-for` accumulates left to right as a request crosses proxies, so
 * the client is the first entry — the later ones are the proxies themselves.
 */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return normaliseIp(first);
  }

  for (const header of ["x-real-ip", "cf-connecting-ip", "x-vercel-forwarded-for"]) {
    const value = headers.get(header);
    if (value) return normaliseIp(value.split(",")[0].trim());
  }

  return null;
}

/** Whether an address is IPv6, used only for labelling in the UI. */
export function ipVersion(value: string): 4 | 6 | null {
  const address = normaliseIp(value);
  if (address.includes(":")) return 6;
  return ipv4ToNumber(address) === null ? null : 4;
}

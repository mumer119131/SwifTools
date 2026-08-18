/**
 * IPv4 subnet arithmetic.
 *
 * Addresses are held as unsigned 32-bit numbers. JavaScript's bitwise
 * operators coerce to *signed* 32-bit, so every operation that could set the
 * top bit is put back through `>>> 0` — without it, anything from 128.0.0.0
 * upwards comes out negative and every derived figure is wrong.
 */

export interface Subnet {
  address: string;
  prefix: number;
  netmask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string | null;
  lastHost: string | null;
  totalAddresses: number;
  usableHosts: number;
  /** Whether this range is reserved for private use (RFC 1918). */
  isPrivate: boolean;
  /** Free-text note when the block behaves unusually. */
  note: string | null;
}

export function parseAddress(input: string): number | null {
  const parts = input.trim().split(".");
  if (parts.length !== 4) return null;

  let value = 0;
  for (const part of parts) {
    // Reject "1e2", "+1" and empty octets, which Number() would coerce, and
    // leading zeros, which are genuinely ambiguous: inet_aton and several
    // resolvers read "010" as octal 8, so treating it as decimal 10 would give
    // an answer about a different address than the one the user will hit.
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = (value * 256) + octet;
  }
  return value >>> 0;
}

export function formatAddress(value: number): string {
  const v = value >>> 0;
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join(".");
}

/** Accepts "10.0.0.1/24", "10.0.0.1 255.255.255.0" or a bare address. */
export function parseCidr(input: string): { address: number; prefix: number } | null {
  const trimmed = input.trim();

  const slash = trimmed.indexOf("/");
  if (slash !== -1) {
    const address = parseAddress(trimmed.slice(0, slash));
    const rest = trimmed.slice(slash + 1).trim();
    if (address === null || !/^\d{1,2}$/.test(rest)) return null;
    const prefix = Number(rest);
    return prefix <= 32 ? { address, prefix } : null;
  }

  const [head, tail] = trimmed.split(/\s+/);
  const address = parseAddress(head ?? "");
  if (address === null) return null;
  if (!tail) return { address, prefix: 32 };

  const mask = parseAddress(tail);
  if (mask === null) return null;
  const prefix = prefixFromMask(mask);
  return prefix === null ? null : { address, prefix };
}

/**
 * Converts a dotted mask to a prefix length, rejecting non-contiguous masks.
 *
 * 255.255.0.255 is a valid-looking address and a nonsense netmask. Accepting it
 * would produce numbers that are arithmetically consistent and operationally
 * meaningless.
 */
export function prefixFromMask(mask: number): number | null {
  const value = mask >>> 0;
  // A contiguous mask is a run of ones then a run of zeros, so inverting it and
  // adding one must yield a power of two.
  const inverted = (~value) >>> 0;
  if (((inverted + 1) & inverted) !== 0) return null;

  let bits = 0;
  for (let i = 31; i >= 0; i -= 1) {
    if ((value & (1 << i)) === 0) break;
    bits += 1;
  }
  return bits;
}

export function maskFromPrefix(prefix: number): number {
  // Shifting a 32-bit value by 32 is undefined in JS (it shifts by 0), so /0
  // has to be special-cased rather than falling out of the arithmetic.
  return prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
}

/** RFC 1918 plus the ranges people meet often enough to be worth naming. */
const RESERVED: { start: string; end: string; label: string; privateUse: boolean }[] = [
  { start: "10.0.0.0", end: "10.255.255.255", label: "Private (RFC 1918)", privateUse: true },
  { start: "172.16.0.0", end: "172.31.255.255", label: "Private (RFC 1918)", privateUse: true },
  { start: "192.168.0.0", end: "192.168.255.255", label: "Private (RFC 1918)", privateUse: true },
  { start: "127.0.0.0", end: "127.255.255.255", label: "Loopback", privateUse: false },
  { start: "169.254.0.0", end: "169.254.255.255", label: "Link-local (APIPA)", privateUse: false },
  { start: "100.64.0.0", end: "100.127.255.255", label: "Carrier-grade NAT", privateUse: false },
  { start: "224.0.0.0", end: "239.255.255.255", label: "Multicast", privateUse: false },
];

function classify(network: number): { label: string | null; privateUse: boolean } {
  for (const range of RESERVED) {
    const start = parseAddress(range.start)!;
    const end = parseAddress(range.end)!;
    if (network >= start && network <= end) {
      return { label: range.label, privateUse: range.privateUse };
    }
  }
  return { label: null, privateUse: false };
}

export function calculate(input: string): Subnet | null {
  const parsed = parseCidr(input);
  if (!parsed) return null;

  const { address, prefix } = parsed;
  const mask = maskFromPrefix(prefix);
  const network = (address & mask) >>> 0;
  const wildcard = (~mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  // 2^32 exceeds what a signed shift can express, so the count is computed with
  // exponentiation rather than bit tricks.
  const totalAddresses = 2 ** (32 - prefix);

  // /31 carries no network or broadcast address — both are usable, for
  // point-to-point links (RFC 3021). /32 is a single host. Subtracting two, as
  // the general rule says, gives 0 and -1 respectively.
  let usableHosts: number;
  let firstHost: string | null;
  let lastHost: string | null;
  let note: string | null = null;

  if (prefix === 32) {
    usableHosts = 1;
    firstHost = lastHost = formatAddress(network);
    note = "A /32 is a single address — one host, no network or broadcast.";
  } else if (prefix === 31) {
    usableHosts = 2;
    firstHost = formatAddress(network);
    lastHost = formatAddress(broadcast);
    note = "A /31 has no network or broadcast address. Both addresses are usable, which is what RFC 3021 defines it for: point-to-point links.";
  } else {
    usableHosts = totalAddresses - 2;
    firstHost = formatAddress((network + 1) >>> 0);
    lastHost = formatAddress((broadcast - 1) >>> 0);
  }

  const { label, privateUse } = classify(network);
  if (label && !note) note = label;
  else if (label && note) note = `${note} ${label}.`;

  return {
    address: formatAddress(address),
    prefix,
    netmask: formatAddress(mask),
    wildcard: formatAddress(wildcard),
    network: formatAddress(network),
    broadcast: formatAddress(broadcast),
    firstHost,
    lastHost,
    totalAddresses,
    usableHosts,
    isPrivate: privateUse,
    note,
  };
}

/** Splits a block into equal subnets one or more prefix bits longer. */
export function divide(input: string, newPrefix: number): Subnet[] {
  const parsed = parseCidr(input);
  if (!parsed || newPrefix < parsed.prefix || newPrefix > 32) return [];

  const network = (parsed.address & maskFromPrefix(parsed.prefix)) >>> 0;
  const count = 2 ** (newPrefix - parsed.prefix);
  const step = 2 ** (32 - newPrefix);

  // A /8 split into /32s is 16.7 million rows. Nobody reads those, and building
  // them locks the tab.
  const shown = Math.min(count, 256);

  const out: Subnet[] = [];
  for (let i = 0; i < shown; i += 1) {
    const start = (network + i * step) >>> 0;
    const subnet = calculate(`${formatAddress(start)}/${newPrefix}`);
    if (subnet) out.push(subnet);
  }
  return out;
}

/** How many subnets a division would produce, before the display cap. */
export function divisionCount(input: string, newPrefix: number): number {
  const parsed = parseCidr(input);
  if (!parsed || newPrefix < parsed.prefix || newPrefix > 32) return 0;
  return 2 ** (newPrefix - parsed.prefix);
}

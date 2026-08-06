export type UuidVersion = "v4" | "v7" | "nil";
export type UuidFormat = "plain" | "uppercase" | "braced" | "no-dashes" | "json-array";

const hex = (bytes: Uint8Array): string =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

function withDashes(raw: string): string {
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20, 32)}`;
}

/**
 * v4 — 122 random bits.
 *
 * `crypto.randomUUID` is used when available: it is the platform's own
 * implementation and is guaranteed to draw from a CSPRNG. The fallback does the
 * same work by hand for the few contexts where it is missing (notably
 * non-secure origins).
 */
export function uuidV4(): string {
  // Feature-tested on the function rather than with `in`, which would narrow
  // `crypto` to `never` in the fallback branch.
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  return withDashes(hex(bytes));
}

/**
 * v7 — 48-bit Unix millisecond timestamp followed by 74 random bits.
 *
 * The leading timestamp means v7 IDs sort lexicographically in creation order,
 * which keeps database B-tree inserts sequential instead of scattering them the
 * way v4 does. That is the whole reason to prefer it for primary keys.
 */
export function uuidV7(): string {
  const timestamp = Date.now();
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  bytes[0] = (timestamp / 2 ** 40) & 0xff;
  bytes[1] = (timestamp / 2 ** 32) & 0xff;
  bytes[2] = (timestamp / 2 ** 24) & 0xff;
  bytes[3] = (timestamp / 2 ** 16) & 0xff;
  bytes[4] = (timestamp / 2 ** 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant

  return withDashes(hex(bytes));
}

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export function generateUuids(version: UuidVersion, count: number): string[] {
  const total = Math.max(1, Math.min(1000, Math.floor(count)));
  return Array.from({ length: total }, () => {
    if (version === "v4") return uuidV4();
    if (version === "v7") return uuidV7();
    return NIL_UUID;
  });
}

export function formatUuids(uuids: string[], format: UuidFormat): string {
  switch (format) {
    case "uppercase":
      return uuids.map((id) => id.toUpperCase()).join("\n");
    case "braced":
      return uuids.map((id) => `{${id}}`).join("\n");
    case "no-dashes":
      return uuids.map((id) => id.replace(/-/g, "")).join("\n");
    case "json-array":
      return JSON.stringify(uuids, null, 2);
    default:
      return uuids.join("\n");
  }
}

/** Reads the embedded timestamp back out of a v7 UUID. */
export function timestampFromV7(uuid: string): Date | null {
  const raw = uuid.replace(/-/g, "");
  if (raw.length !== 32 || raw[12] !== "7") return null;
  const milliseconds = parseInt(raw.slice(0, 12), 16);
  return Number.isFinite(milliseconds) ? new Date(milliseconds) : null;
}

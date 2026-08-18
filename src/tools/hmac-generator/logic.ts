/**
 * HMAC via Web Crypto.
 *
 * HMAC is not "hash the key and message together" — that construction is
 * vulnerable to length extension, which is the reason HMAC exists. `crypto.subtle`
 * implements RFC 2104 properly, so this file does no cryptography of its own.
 */

export type HashName = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const hashes: HashName[] = ["SHA-256", "SHA-512", "SHA-384", "SHA-1"];

export type Encoding = "hex" | "base64" | "base64url";

export const encodingLabels: Record<Encoding, string> = {
  hex: "Hex",
  base64: "Base64",
  base64url: "Base64URL",
};

/** How the secret is written down. Webhook secrets are hex or Base64 as often as text. */
export type KeyFormat = "text" | "hex" | "base64";

export const keyFormatLabels: Record<KeyFormat, string> = {
  text: "Plain text",
  hex: "Hex",
  base64: "Base64",
};

function fromHex(input: string): Uint8Array | null {
  const cleaned = input.replace(/\s+/g, "");
  if (cleaned.length === 0 || cleaned.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(cleaned)) return null;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function fromBase64(input: string): Uint8Array | null {
  try {
    const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/").trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

export function decodeKey(key: string, format: KeyFormat): Uint8Array | null {
  if (format === "hex") return fromHex(key);
  if (format === "base64") return fromBase64(key);
  return new TextEncoder().encode(key);
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64(bytes: Uint8Array, urlSafe: boolean): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  return urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
}

export function encode(bytes: Uint8Array, encoding: Encoding): string {
  if (encoding === "hex") return toHex(bytes);
  return toBase64(bytes, encoding === "base64url");
}

export async function hmac(
  message: string,
  key: string,
  hash: HashName,
  keyFormat: KeyFormat,
): Promise<Uint8Array> {
  const keyBytes = decodeKey(key, keyFormat);
  if (!keyBytes) throw new Error(`That key is not valid ${keyFormatLabels[keyFormat]}.`);

  const imported = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    { name: "HMAC", hash },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    imported,
    new TextEncoder().encode(message) as BufferSource,
  );
  return new Uint8Array(signature);
}

/**
 * Compares two signatures without leaking where they diverge through timing.
 *
 * Overkill in a browser, where an attacker has the page anyway — but this is a
 * tool people copy from, and `a === b` is precisely the line that should not be
 * copied into a webhook handler.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}
